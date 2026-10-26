import {
  createGuardianAdmin,
  getClientAddress,
  GuardianConsentError,
  hashGuardianValue,
  normalizeEmail,
  readJsonBody,
  sendGuardianJson,
} from './guardianConsent.js';
import { createAuthCodeEmail, createAuthRecoveryEmail } from './authCodeEmail.js';

const PURPOSES = new Set(['child-signin', 'password-reset']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECOVERY_ACCEPTED_MESSAGE = 'If an account uses this email, a password-reset link will be sent.';

async function enforceEmailCodeLimit(admin, bucket, action, limit, windowSeconds) {
  const { data, error } = await admin.rpc('guardian_rate_limit', {
    p_bucket_hash: hashGuardianValue(`auth_email_code:${action}:${bucket}`),
    p_action: action,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) throw new GuardianConsentError(503, 'Email verification is temporarily unavailable.');
  if (data !== true) throw new GuardianConsentError(429, 'Too many code requests. Wait a little before trying again.');
}

function validateRequestBody(body) {
  const email = normalizeEmail(body.email);
  const purpose = body.purpose === 'recovery' ? 'password-reset' : body.purpose;
  if (!PURPOSES.has(purpose)) {
    throw new GuardianConsentError(400, 'Choose a valid email-code request.');
  }
  return { email, purpose };
}

function getRecoveryRedirectUrl() {
  const callback = new URL('/auth-callback.html', 'https://www.idilewa.com');
  callback.searchParams.set('next', 'login');
  return callback.toString();
}

async function sendPasswordResetEmail(admin, email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const fromAddress = from?.match(/<([^<>]+)>$/)?.[1] || from || '';
  if (!apiKey || !EMAIL_PATTERN.test(fromAddress)) {
    throw new GuardianConsentError(503, 'Password recovery is temporarily unavailable.');
  }

  let linkData;
  let linkError;
  try {
    ({ data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: getRecoveryRedirectUrl() },
    }));
  } catch (error) {
    console.error('[auth/password-reset] Supabase link generation failed.', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    return;
  }
  if (linkError) {
    if (linkError.status === 404 || linkError.code === 'user_not_found') return;
    console.error('[auth/password-reset] Supabase link generation failed.', {
      status: linkError.status,
      code: linkError.code,
    });
    return;
  }
  const recoveryUrl = linkData?.properties?.action_link;
  if (typeof recoveryUrl !== 'string') {
    console.error('[auth/password-reset] Supabase returned no recovery link.');
    return;
  }

  const emailContent = createAuthRecoveryEmail({ recoveryUrl });
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `******`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [email], ...emailContent }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      let providerCode = '';
      try {
        const result = await response.json();
        providerCode = typeof result?.name === 'string' ? result.name : '';
      } catch {
        providerCode = 'invalid_provider_response';
      }
      console.error('[auth/password-reset] Email provider rejected the message.', {
        status: response.status,
        code: providerCode,
      });
    }
  } catch (error) {
    console.error('[auth/password-reset] Email provider request failed.', {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
  }
}

export default async function handleAuthEmailCode(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendGuardianJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const { email, purpose } = validateRequestBody(readJsonBody(req));
    const admin = createGuardianAdmin();
    await enforceEmailCodeLimit(admin, email, 'request', 4, 3_600);
    const clientAddress = getClientAddress(req);
    if (clientAddress) {
      await enforceEmailCodeLimit(admin, clientAddress, 'request_ip', 20, 3_600);
    }
    if (purpose === 'password-reset') {
      await sendPasswordResetEmail(admin, email);
      return sendGuardianJson(res, 202, { message: RECOVERY_ACCEPTED_MESSAGE });
    }

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('id, role, parent_consent_request_id')
      .eq('email', email)
      .maybeSingle();
    if (profileError) {
      throw new GuardianConsentError(503, 'Email verification is temporarily unavailable.');
    }
    if (!profile?.id) {
      return sendGuardianJson(res, 202, { message: 'If the account exists and is eligible, a passcode will be sent to its parent or guardian.' });
    }

    let recipientEmail = email;
    if (purpose === 'child-signin') {
      if (profile.role !== 'child' || !profile.parent_consent_request_id) {
        return sendGuardianJson(res, 202, { message: 'If the account exists and is eligible, a passcode will be sent to its parent or guardian.' });
      }
      const { data: guardianRequest, error: guardianError } = await admin
        .from('guardian_access_requests')
        .select('parent_email')
        .eq('id', profile.parent_consent_request_id)
        .eq('claimed_by', profile.id)
        .eq('status', 'used')
        .maybeSingle();
      if (guardianError) {
        throw new GuardianConsentError(503, 'Parent passcode delivery is temporarily unavailable.');
      }
      if (!guardianRequest?.parent_email || guardianRequest.parent_email.toLowerCase() === email) {
        return sendGuardianJson(res, 202, { message: 'If the account exists and is eligible, a passcode will be sent to its parent or guardian.' });
      }
      recipientEmail = guardianRequest.parent_email.toLowerCase();
    }

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
    const user = userData?.user;
    if (userError || !user || user.email?.toLowerCase() !== email) {
      throw new GuardianConsentError(503, 'Email verification is temporarily unavailable.');
    }
    if (purpose === 'child-signin' && (profile.role !== 'child' || !profile.parent_consent_request_id)) {
      return sendGuardianJson(res, 202, { message: 'If the account exists and is eligible, a passcode will be sent to its parent or guardian.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const fromAddress = from?.match(/<([^<>]+)>$/)?.[1] || from || '';
    if (!apiKey || !EMAIL_PATTERN.test(fromAddress)) {
      throw new GuardianConsentError(503, 'Email delivery is not configured yet.');
    }

    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });
    const code = linkData?.properties?.email_otp;
    if (linkError || !/^\d{6,8}$/.test(code || '')) {
      console.error('[auth/email-code] Supabase did not generate a valid email code.', {
        status: linkError?.status,
        code: linkError?.code,
      });
      throw new GuardianConsentError(503, 'A code could not be generated. Please try again shortly.');
    }

    const emailContent = createAuthCodeEmail({ code, purpose });
    let response;
    try {
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `******`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to: [recipientEmail], ...emailContent }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch (error) {
      console.error('[auth/email-code] Email provider request failed.', {
        name: error instanceof Error ? error.name : 'UnknownError',
      });
      throw new GuardianConsentError(502, 'The code email could not be sent. Please try again shortly.');
    }

    if (!response.ok) {
      let providerCode = '';
      try {
        const result = await response.json();
        providerCode = typeof result?.name === 'string' ? result.name : '';
      } catch {
        providerCode = 'invalid_provider_response';
      }
      console.error('[auth/email-code] Email provider rejected the message.', {
        status: response.status,
        code: providerCode,
      });
      throw new GuardianConsentError(502, 'The code email could not be sent. Please try again shortly.');
    }

    return sendGuardianJson(res, 202, {
      message: 'If the account exists and is eligible, a passcode will be sent to its parent or guardian.',
    });
  } catch (error) {
    if (error instanceof GuardianConsentError) {
      return sendGuardianJson(res, error.statusCode, { error: error.message });
    }
    console.error('[auth/email-code] Code email request failed.');
    return sendGuardianJson(res, 500, { error: 'The code email could not be sent. Please try again shortly.' });
  }
}
