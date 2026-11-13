import {
  createAccessCode,
  createApprovalToken,
  createGuardianAdmin,
  enforceGuardianRateLimit,
  escapeEmailHtml,
  getClientAddress,
  getProductionOrigin,
  GuardianConsentError,
  hashGuardianValue,
  normalizeEmail,
  readFormBody,
  readJsonBody,
  renderApprovalPage,
  renderApprovalResult,
  sendGuardianEmail,
  sendGuardianHtml,
  sendGuardianJson,
} from './guardianConsent.js';

async function handleGuardianRequest(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendGuardianJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const body = readJsonBody(req);
    const childEmail = normalizeEmail(body.childEmail);
    const parentEmail = normalizeEmail(body.parentEmail);
    const learnerAlias = typeof body.learnerAlias === 'string' ? body.learnerAlias.trim().slice(0, 28) : '';
    const tutorId = typeof body.tutorId === 'string' ? body.tutorId.trim().slice(0, 64) : '';
    if (childEmail === parentEmail) {
      throw new GuardianConsentError(400, 'Use a separate parent or guardian email address.');
    }
    if (learnerAlias.length < 2 || /[<>]/.test(learnerAlias)) {
      throw new GuardianConsentError(400, 'Enter a short learner nickname.');
    }
    if (body.tutorId && !/^[a-z0-9-]{1,64}$/.test(tutorId)) {
      throw new GuardianConsentError(400, 'The selected tutor is not valid.');
    }

    const productionOrigin = getProductionOrigin();
    const admin = createGuardianAdmin();
    await enforceGuardianRateLimit(admin, parentEmail, 'request', 3, 3_600);
    const clientAddress = getClientAddress(req);
    if (clientAddress) {
      await enforceGuardianRateLimit(admin, clientAddress, 'request_ip', 12, 3_600);
    }
    const token = createApprovalToken();
    const { data: request, error } = await admin
      .from('guardian_access_requests')
      .insert({
        child_email: childEmail,
        parent_email: parentEmail,
        learner_alias: learnerAlias,
        tutor_id: tutorId || null,
        approval_token_hash: hashGuardianValue(token),
        request_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1_000).toISOString(),
      })
      .select('id')
      .single();
    if (error || !request) {
      throw new GuardianConsentError(503, 'The guardian request could not be saved.');
    }

    const approvalUrl = `${productionOrigin}/api/guardian/approve?token=${encodeURIComponent(token)}`;
    const safeAlias = escapeEmailHtml(learnerAlias);
    try {
      await sendGuardianEmail({
        to: parentEmail,
        subject: 'Review a child learning request on Idilewa',
        text: `${learnerAlias} is requesting a supervised Idilewa learning account. Review and approve it here: ${approvalUrl}\n\nThis approval link expires in 24 hours. If you did not request this, ignore this email.`,
        html: `<p>${safeAlias} is requesting a supervised Idilewa learning account.</p><p><a href="${approvalUrl}">Review the request and decide</a></p><p>This approval link expires in 24 hours. No code is issued until you submit the approval form. If you did not request this, ignore this email.</p>`,
      });
    } catch (error) {
      await admin.from('guardian_access_requests').delete().eq('id', request.id);
      throw error;
    }

    return sendGuardianJson(res, 202, {
      message: 'Request sent. Ask your parent or guardian to review the email before you enter the code.',
    });
  } catch (error) {
    if (error instanceof GuardianConsentError) {
      return sendGuardianJson(res, error.statusCode, { error: error.message });
    }
    console.error('[guardian/request] Internal request failure.');
    return sendGuardianJson(res, 500, { error: 'The guardian request could not be completed.' });
  }
}

async function handleGuardianVerify(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendGuardianJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const body = readJsonBody(req);
    const email = normalizeEmail(body.email);
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    if (!/^\d{6}$/.test(code)) {
      throw new GuardianConsentError(400, 'Enter the six-digit code from the approval email.');
    }

    const admin = createGuardianAdmin();
    await enforceGuardianRateLimit(admin, email, 'verify', 5, 900);
    const clientAddress = getClientAddress(req);
    if (clientAddress) {
      await enforceGuardianRateLimit(admin, clientAddress, 'verify_ip', 20, 900);
    }
    const { data, error } = await admin.rpc('verify_guardian_access_code', {
      p_child_email: email,
      p_code_hash: hashGuardianValue(code),
    });
    if (error) {
      throw new GuardianConsentError(503, 'Guardian code verification is temporarily unavailable.');
    }
    if (typeof data !== 'string' || !/^[0-9a-f-]{36}$/i.test(data)) {
      throw new GuardianConsentError(400, 'That code is invalid, expired, or already used.');
    }
    return sendGuardianJson(res, 200, { approvalId: data });
  } catch (error) {
    if (error instanceof GuardianConsentError) {
      return sendGuardianJson(res, error.statusCode, { error: error.message });
    }
    console.error('[guardian/verify] Code verification failed.');
    return sendGuardianJson(res, 500, { error: 'The code could not be verified.' });
  }
}

function readApprovalToken(req, body = {}) {
  const value = body.token || req.query?.token || '';
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{40,50}$/.test(value)) {
    throw new GuardianConsentError(400, 'This approval link is not valid.');
  }
  return value;
}

async function findPendingRequest(admin, tokenHash) {
  const { data, error } = await admin
    .from('guardian_access_requests')
    .select('id, learner_alias, tutor_id, status, code_sent_at')
    .eq('approval_token_hash', tokenHash)
    .gt('request_expires_at', new Date().toISOString())
    .maybeSingle();
  if (error) {
    throw new GuardianConsentError(503, 'Guardian approval is temporarily unavailable.');
  }
  if (!data || (data.status !== 'pending' && !(data.status === 'approved' && !data.code_sent_at))) {
    throw new GuardianConsentError(404, 'This approval link is expired or has already been used.');
  }
  return data;
}

async function handleGuardianApprove(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendGuardianHtml(res, 405, renderApprovalResult('Method not allowed.'));
  }

  try {
    const admin = createGuardianAdmin();
    if (req.method === 'GET') {
      const token = readApprovalToken(req);
      const request = await findPendingRequest(admin, hashGuardianValue(token));
      return sendGuardianHtml(res, 200, renderApprovalPage({
        token,
        learnerAlias: request.learner_alias,
        tutorRequested: Boolean(request.tutor_id),
      }));
    }

    const body = readFormBody(req);
    const token = readApprovalToken(req, body);
    const clientAddress = getClientAddress(req);
    if (clientAddress) {
      await enforceGuardianRateLimit(admin, clientAddress, 'approve_ip', 5, 900);
    }
    if (body.authority !== 'yes' || body.accountConsent !== 'yes' || body.privacyReviewed !== 'yes') {
      throw new GuardianConsentError(400, 'Complete each required approval before continuing.');
    }
    const request = await findPendingRequest(admin, hashGuardianValue(token));
    const accessCode = createAccessCode();
    const { data, error } = await admin.rpc('issue_guardian_access_code', {
      p_token_hash: hashGuardianValue(token),
      p_code_hash: hashGuardianValue(accessCode),
      p_code_lifetime_seconds: 900,
      p_tutor_approved: request.tutor_id ? body.tutorConsent === 'yes' : false,
    });
    const issued = Array.isArray(data) ? data[0] : data;
    if (error || !issued?.id || !issued.child_email) {
      throw new GuardianConsentError(404, 'This approval link is expired or has already been used.');
    }

    await sendGuardianEmail({
      to: issued.child_email,
      subject: 'Your Idilewa one-time sign-up code',
      text: `Your parent or guardian approved your Idilewa account request. Your one-time code is ${accessCode}. Enter it during child account sign-up within 15 minutes. Do not share it with anyone else.`,
      html: `<p>Your parent or guardian approved your Idilewa account request.</p><p>Your one-time sign-up code:</p><p style="font-size:28px;font-weight:700;letter-spacing:5px">${accessCode}</p><p>Enter it during child account sign-up within 15 minutes. Do not share it with anyone else.</p>`,
    });
    const { data: sent, error: sentError } = await admin.rpc('mark_guardian_access_code_sent', {
      p_request_id: issued.id,
    });
    if (sentError || sent !== true) {
      console.error('[guardian/approve] Approval email sent but delivery record update failed.');
      throw new GuardianConsentError(503, 'The code email was sent, but its status could not be confirmed. Please contact support before requesting another code.');
    }

    return sendGuardianHtml(res, 200, renderApprovalResult('The learner’s one-time sign-up code has been emailed to the address provided in the request.'));
  } catch (error) {
    const status = error instanceof GuardianConsentError ? error.statusCode : 500;
    if (!(error instanceof GuardianConsentError)) {
      console.error('[guardian/approve] Approval processing failed.');
    }
    return sendGuardianHtml(
      res,
      status,
      renderApprovalResult(error instanceof GuardianConsentError
        ? error.message
        : 'The approval could not be completed. Please try again later.'),
    );
  }
}

function getGuardianRoute(req) {
  const url = new URL(req.url || '/', 'https://idilewa.local');
  const prefix = '/api/guardian';
  const rest = url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length) : '';
  return rest.replace(/^\/+|\/+$/g, '');
}

export async function dispatchGuardian(req, res) {
  const route = getGuardianRoute(req);
  if (route === 'request') return handleGuardianRequest(req, res);
  if (route === 'verify') return handleGuardianVerify(req, res);
  if (route === 'approve') return handleGuardianApprove(req, res);
  return sendGuardianJson(res, 404, { error: 'Not found.' });
}
