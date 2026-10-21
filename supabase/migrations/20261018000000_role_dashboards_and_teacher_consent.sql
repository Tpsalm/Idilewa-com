-- Role dashboards are backed by service-only relationship records. All reads
-- are mediated by authenticated server endpoints that verify the caller role.

CREATE TABLE IF NOT EXISTS public.educator_connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guardian_request_id UUID NOT NULL REFERENCES public.guardian_access_requests(id) ON DELETE CASCADE,
  approval_token_hash TEXT NOT NULL UNIQUE CHECK (approval_token_hash ~ '^[0-9a-f]{64}$'),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'declined', 'withdrawn')),
  expires_at TIMESTAMPTZ NOT NULL,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (educator_id <> child_id),
  CHECK ((status = 'pending' AND decided_at IS NULL) OR (status <> 'pending' AND decided_at IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS guardian_access_parent_status_idx
  ON public.guardian_access_requests (lower(parent_email), status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS educator_connection_active_pair_idx
  ON public.educator_connection_requests (educator_id, child_id)
  WHERE status IN ('pending', 'approved');
CREATE INDEX IF NOT EXISTS educator_connection_educator_status_idx
  ON public.educator_connection_requests (educator_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS educator_connection_child_status_idx
  ON public.educator_connection_requests (child_id, status, created_at DESC);

ALTER TABLE public.educator_connection_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.educator_connection_requests FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.educator_connection_requests TO service_role;

ALTER TABLE public.guardian_rate_limit_events
  DROP CONSTRAINT IF EXISTS guardian_rate_limit_events_action_check;
ALTER TABLE public.guardian_rate_limit_events
  ADD CONSTRAINT guardian_rate_limit_events_action_check
  CHECK (action IN (
    'request', 'verify', 'request_ip', 'verify_ip', 'approve_ip',
    'educator_verify', 'educator_verify_ip',
    'educator_connection_request', 'educator_connection_request_ip',
    'educator_connection_decision_ip'
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
    'educator_verify', 'educator_verify_ip',
    'educator_connection_request', 'educator_connection_request_ip',
    'educator_connection_decision_ip'
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

CREATE OR REPLACE FUNCTION public.child_guardian_is_approved()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles child
    JOIN public.guardian_access_requests guardian
      ON guardian.id = child.parent_consent_request_id
    WHERE child.id = auth.uid()
      AND child.role = 'child'
      AND guardian.status = 'used'
      AND guardian.claimed_by = child.id
      AND lower(guardian.child_email) = lower(child.email)
  );
$$;

REVOKE ALL ON FUNCTION public.child_guardian_is_approved() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.child_guardian_is_approved() TO authenticated;

CREATE OR REPLACE FUNCTION public.decide_educator_connection(
  p_token_hash TEXT,
  p_approve BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.educator_connection_requests connection
  SET status = CASE WHEN p_approve THEN 'approved' ELSE 'declined' END,
      decided_at = NOW()
  WHERE connection.approval_token_hash = p_token_hash
    AND connection.status = 'pending'
    AND connection.expires_at > NOW()
    AND EXISTS (
      SELECT 1
      FROM public.guardian_access_requests guardian
      WHERE guardian.id = connection.guardian_request_id
        AND guardian.status = 'used'
        AND guardian.claimed_by = connection.child_id
    );
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.decide_educator_connection(TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decide_educator_connection(TEXT, BOOLEAN) TO service_role;
