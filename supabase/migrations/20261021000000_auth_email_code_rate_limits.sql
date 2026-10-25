ALTER TABLE public.guardian_rate_limit_events
  DROP CONSTRAINT IF EXISTS guardian_rate_limit_events_action_check;

ALTER TABLE public.guardian_rate_limit_events
  ADD CONSTRAINT guardian_rate_limit_events_action_check
  CHECK (action IN (
    'request', 'verify', 'request_ip', 'verify_ip', 'approve_ip',
    'educator_verify', 'educator_verify_ip',
    'educator_connection_request', 'educator_connection_request_ip',
    'educator_connection_decision_ip',
    'auth_email_code', 'auth_email_code_ip'
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
    'educator_connection_decision_ip',
    'auth_email_code', 'auth_email_code_ip'
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
