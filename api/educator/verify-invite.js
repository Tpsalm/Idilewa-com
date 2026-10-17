import {
  createGuardianAdmin,
  enforceGuardianRateLimit,
  getClientAddress,
  GuardianConsentError,
  hashGuardianValue,
  normalizeEducatorInviteCode,
  readJsonBody,
  sendGuardianJson,
} from '../../src/server/guardianConsent.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendGuardianJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const body = readJsonBody(req);
    const inviteCode = normalizeEducatorInviteCode(body.code);
    const codeHash = hashGuardianValue(inviteCode);
    const admin = createGuardianAdmin();
    await enforceGuardianRateLimit(admin, codeHash, 'educator_verify', 5, 900);
    const clientAddress = getClientAddress(req);
    if (clientAddress) {
      await enforceGuardianRateLimit(admin, clientAddress, 'educator_verify_ip', 20, 900);
    }

    const { data, error } = await admin
      .from('educator_invites')
      .select('id')
      .eq('code_hash', codeHash)
      .is('redeemed_by', null)
      .is('redeemed_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
    if (error) throw new GuardianConsentError(503, 'Educator invitations are temporarily unavailable.');
    if (!data?.id) throw new GuardianConsentError(400, 'That invitation is invalid, expired, or already used.');
    return sendGuardianJson(res, 200, { inviteId: data.id });
  } catch (error) {
    if (error instanceof GuardianConsentError) {
      return sendGuardianJson(res, error.statusCode, { error: error.message });
    }
    console.error('[educator/verify-invite] Invitation verification failed.');
    return sendGuardianJson(res, 500, { error: 'The educator invitation could not be verified.' });
  }
}
