import {
  createGuardianAdmin,
  GuardianConsentError,
  readJsonBody,
} from './guardianConsent.js';

export { GuardianConsentError, readJsonBody };

export async function requireAuthenticatedProfile(req, allowedRoles) {
  const authorization = req.headers?.authorization || req.headers?.Authorization || '';
  const match = typeof authorization === 'string'
    ? authorization.match(/^Bearer ([A-Za-z0-9._~-]+)$/)
    : null;
  if (!match) throw new GuardianConsentError(401, 'Sign in to continue.');

  const admin = createGuardianAdmin();
  const { data, error } = await admin.auth.getUser(match[1]);
  const user = data?.user;
  if (error || !user) throw new GuardianConsentError(401, 'Your sign-in session is invalid or expired.');
  if (!user.email_confirmed_at) {
    throw new GuardianConsentError(403, 'Verify your email before opening this dashboard.');
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id,email,name,role,points,streak,parent_consent_request_id')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) throw new GuardianConsentError(503, 'Your account profile could not be loaded.');
  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new GuardianConsentError(403, 'This account does not have access to this area.');
  }

  return { admin, user, profile };
}

export function sendApiJson(res, statusCode, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(statusCode).json(body);
}

export function sendApiFailure(res, error, label) {
  if (error instanceof GuardianConsentError) {
    return sendApiJson(res, error.statusCode, { error: error.message });
  }
  console.error(`[${label}] Request failed.`);
  return sendApiJson(res, 500, { error: 'The request could not be completed.' });
}
