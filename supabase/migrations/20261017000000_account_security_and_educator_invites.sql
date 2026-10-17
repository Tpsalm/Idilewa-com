-- Apply after the initial schema and guardian consent migrations.
-- Restrict profile access, validate account roles, and require educator invites.

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF auth.uid() = OLD.id
    AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.email IS DISTINCT FROM OLD.email) THEN
    RAISE EXCEPTION 'Account role and email cannot be changed through profile updates.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role_before_update ON public.profiles;
CREATE TRIGGER protect_profile_role_before_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

CREATE OR REPLACE FUNCTION public.sync_profile_from_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  UPDATE public.profiles
  SET name = COALESCE(new.raw_user_meta_data->>'name', name),
      avatar_url = COALESCE(new.raw_user_meta_data->>'avatar_url', avatar_url),
      updated_at = NOW()
  WHERE id = new.id;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_metadata_updated ON auth.users;
CREATE TRIGGER on_auth_user_metadata_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  WHEN (old.raw_user_meta_data IS DISTINCT FROM new.raw_user_meta_data)
  EXECUTE FUNCTION public.sync_profile_from_auth_user();

CREATE TABLE IF NOT EXISTS public.educator_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash TEXT NOT NULL UNIQUE CHECK (code_hash ~ '^[0-9a-f]{64}$'),
  expires_at TIMESTAMPTZ NOT NULL,
  redeemed_by UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (redeemed_by IS NULL OR redeemed_at IS NOT NULL)
);

ALTER TABLE public.educator_invites ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.educator_invites FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.educator_invites TO service_role;

ALTER TABLE public.guardian_rate_limit_events
  DROP CONSTRAINT IF EXISTS guardian_rate_limit_events_action_check;
ALTER TABLE public.guardian_rate_limit_events
  ADD CONSTRAINT guardian_rate_limit_events_action_check
  CHECK (action IN (
    'request', 'verify', 'request_ip', 'verify_ip', 'approve_ip',
    'educator_verify', 'educator_verify_ip'
  ));

CREATE OR REPLACE FUNCTION public.guardian_rate_limit(
  p_bucket_hash TEXT,
  p_action TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_attempts INTEGER;
BEGIN
  IF p_action NOT IN (
    'request', 'verify', 'request_ip', 'verify_ip', 'approve_ip',
    'educator_verify', 'educator_verify_ip'
  ) OR p_limit < 1 OR p_window_seconds < 1 THEN
    RETURN FALSE;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(p_action), hashtext(p_bucket_hash));
  SELECT COUNT(*) INTO v_attempts
  FROM public.guardian_rate_limit_events
  WHERE bucket_hash = p_bucket_hash
    AND action = p_action
    AND created_at > NOW() - make_interval(secs => p_window_seconds);

  IF v_attempts >= p_limit THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.guardian_rate_limit_events (bucket_hash, action)
  VALUES (p_bucket_hash, p_action);
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.guardian_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guardian_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_role TEXT := COALESCE(new.raw_user_meta_data->>'role', 'adult');
  v_request_id UUID;
  v_invite_id UUID;
BEGIN
  IF v_role NOT IN ('child', 'adult', 'parent', 'educator') THEN
    RAISE EXCEPTION 'Unsupported account role.';
  END IF;

  IF v_role = 'child' THEN
    BEGIN
      v_request_id := NULLIF(new.raw_user_meta_data->>'guardian_access_request_id', '')::UUID;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'A verified guardian approval is required.';
    END;

    PERFORM 1
    FROM public.guardian_access_requests
    WHERE id = v_request_id
      AND lower(child_email) = lower(new.email)
      AND status = 'approved'
      AND access_code_expires_at > NOW()
      AND access_code_verified_at > NOW() - INTERVAL '10 minutes'
      AND claimed_by IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'A verified guardian approval is required.';
    END IF;

    UPDATE public.guardian_access_requests
    SET status = 'used', claimed_by = new.id
    WHERE id = v_request_id;
  ELSIF v_role = 'educator' THEN
    BEGIN
      v_invite_id := NULLIF(new.raw_user_meta_data->>'educator_invite_id', '')::UUID;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'A valid educator invitation is required.';
    END;

    UPDATE public.educator_invites
    SET redeemed_by = new.id, redeemed_at = NOW()
    WHERE id = v_invite_id
      AND expires_at > NOW()
      AND redeemed_by IS NULL
      AND redeemed_at IS NULL
    RETURNING id INTO v_invite_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'A valid, unused educator invitation is required.';
    END IF;
  END IF;

  INSERT INTO public.profiles (
    id, email, name, role, avatar_url, points, streak, parent_consent_request_id
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    v_role,
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    0,
    0,
    v_request_id
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    parent_consent_request_id = EXCLUDED.parent_consent_request_id,
    updated_at = NOW();
  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_profile_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_profile_from_auth_user() FROM PUBLIC, anon, authenticated;
