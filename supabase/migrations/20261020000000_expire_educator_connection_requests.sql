ALTER TABLE public.educator_connection_requests
  DROP CONSTRAINT IF EXISTS educator_connection_requests_status_check;

ALTER TABLE public.educator_connection_requests
  ADD CONSTRAINT educator_connection_requests_status_check
  CHECK (status IN ('pending', 'approved', 'declined', 'withdrawn', 'expired'));
