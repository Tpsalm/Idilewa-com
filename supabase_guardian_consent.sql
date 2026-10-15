-- Apply this migration in the Supabase SQL Editor before enabling guardian sign-up.
-- The service-role key is used only by Vercel server functions.

CREATE TABLE IF NOT EXISTS public.guardian_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_email TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  learner_alias TEXT NOT NULL CHECK (char_length(learner_alias) BETWEEN 2 AND 28),
  tutor_id TEXT,
  tutor_approved BOOLEAN NOT NULL DEFAULT FALSE,
  approval_token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'used')),
  request_expires_at TIMESTAMPTZ NOT NULL,
  approved_at TIMESTAMPTZ,
  access_code_hash TEXT,
  access_code_expires_at TIMESTAMPTZ,
  access_code_verified_at TIMESTAMPTZ,
  code_sent_at TIMESTAMPTZ,
  claimed_by UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (lower(child_email) <> lower(parent_email))
);

CREATE INDEX IF NOT EXISTS guardian_access_email_status_idx
  ON public.guardian_access_requests (lower(child_email), status, created_at DESC);

ALTER TABLE public.guardian_access_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.guardian_access_requests FROM anon, authenticated;
GRANT ALL ON public.guardian_access_requests TO service_role;

CREATE TABLE IF NOT EXISTS public.guardian_rate_limit_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  bucket_hash TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('request', 'verify', 'request_ip', 'verify_ip', 'approve_ip')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.guardian_rate_limit_events
  DROP CONSTRAINT IF EXISTS guardian_rate_limit_events_action_check;
ALTER TABLE public.guardian_rate_limit_events
  ADD CONSTRAINT guardian_rate_limit_events_action_check
  CHECK (action IN ('request', 'verify', 'request_ip', 'verify_ip', 'approve_ip'));

CREATE INDEX IF NOT EXISTS guardian_rate_limit_window_idx
  ON public.guardian_rate_limit_events (bucket_hash, action, created_at DESC);

ALTER TABLE public.guardian_rate_limit_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.guardian_rate_limit_events FROM anon, authenticated;
GRANT ALL ON public.guardian_rate_limit_events TO service_role;

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
  IF p_action NOT IN ('request', 'verify', 'request_ip', 'verify_ip', 'approve_ip')
    OR p_limit < 1 OR p_window_seconds < 1 THEN
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

CREATE OR REPLACE FUNCTION public.issue_guardian_access_code(
  p_token_hash TEXT,
  p_code_hash TEXT,
  p_code_lifetime_seconds INTEGER,
  p_tutor_approved BOOLEAN
)
RETURNS TABLE (id UUID, child_email TEXT, learner_alias TEXT, tutor_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_request public.guardian_access_requests%ROWTYPE;
BEGIN
  SELECT * INTO v_request
  FROM public.guardian_access_requests
  WHERE approval_token_hash = p_token_hash
    AND request_expires_at > NOW()
    AND (
      status = 'pending'
      OR (status = 'approved' AND code_sent_at IS NULL)
    )
  FOR UPDATE;

  IF NOT FOUND OR p_code_lifetime_seconds < 60 OR p_code_lifetime_seconds > 1800 THEN
    RETURN;
  END IF;

  UPDATE public.guardian_access_requests
  SET status = 'approved',
      approved_at = COALESCE(approved_at, NOW()),
      tutor_approved = (v_request.tutor_id IS NOT NULL AND p_tutor_approved),
      access_code_hash = p_code_hash,
      access_code_expires_at = NOW() + make_interval(secs => p_code_lifetime_seconds),
      access_code_verified_at = NULL
  WHERE guardian_access_requests.id = v_request.id;

  RETURN QUERY SELECT v_request.id, v_request.child_email, v_request.learner_alias, v_request.tutor_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_guardian_access_code_sent(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.guardian_access_requests
  SET code_sent_at = NOW()
  WHERE id = p_request_id
    AND status = 'approved'
    AND code_sent_at IS NULL
    AND access_code_expires_at > NOW();
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_guardian_access_code(
  p_child_email TEXT,
  p_code_hash TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_request_id UUID;
BEGIN
  SELECT id INTO v_request_id
  FROM public.guardian_access_requests
  WHERE lower(child_email) = lower(p_child_email)
    AND access_code_hash = p_code_hash
    AND status = 'approved'
    AND code_sent_at IS NOT NULL
    AND access_code_expires_at > NOW()
    AND access_code_verified_at IS NULL
    AND claimed_by IS NULL
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  UPDATE public.guardian_access_requests
  SET access_code_verified_at = NOW()
  WHERE id = v_request_id;
  RETURN v_request_id;
END;
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS parent_consent_request_id UUID
  REFERENCES public.guardian_access_requests(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_role TEXT := COALESCE(new.raw_user_meta_data->>'role', 'child');
  v_request_id UUID;
BEGIN
  IF v_role NOT IN ('child', 'adult', 'parent', 'educator', 'institution') THEN
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

REVOKE ALL ON FUNCTION public.guardian_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.issue_guardian_access_code(TEXT, TEXT, INTEGER, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.mark_guardian_access_code_sent(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.verify_guardian_access_code(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.guardian_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.issue_guardian_access_code(TEXT, TEXT, INTEGER, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_guardian_access_code_sent(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_guardian_access_code(TEXT, TEXT) TO service_role;
