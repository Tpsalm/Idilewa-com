import { createHmac, randomBytes, randomInt } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class GuardianConsentError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'GuardianConsentError';
    this.statusCode = statusCode;
  }
}

export function normalizeEmail(value) {
  if (typeof value !== 'string') {
    throw new GuardianConsentError(400, 'Enter a valid email address.');
  }
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw new GuardianConsentError(400, 'Enter a valid email address.');
  }
  return email;
}

export function normalizeEducatorInviteCode(value) {
  if (typeof value !== 'string') {
    throw new GuardianConsentError(400, 'Enter a valid educator invitation code.');
  }
  const code = value.trim().toUpperCase();
  if (code.length < 8 || code.length > 64 || !/^[A-Z0-9-]+$/.test(code)) {
    throw new GuardianConsentError(400, 'Enter a valid educator invitation code.');
  }
  return code;
}

export function createGuardianAdmin() {
  const url = process.env.SUPABASE_URL
    || process.env.SUPABASE_PUBLIC_URL
    || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new GuardianConsentError(503, 'Guardian approval is not configured yet.');
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getTokenSecret() {
  const secret = process.env.GUARDIAN_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new GuardianConsentError(503, 'Guardian approval is not configured yet.');
  }
  return secret;
}

export function hashGuardianValue(value) {
  return createHmac('sha256', getTokenSecret()).update(value).digest('hex');
}

export function createApprovalToken() {
  return randomBytes(32).toString('base64url');
}

export function createAccessCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function readJsonBody(req) {
  let body = req.body;
  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > 8_192) {
    throw new GuardianConsentError(413, 'The request is too large.');
  }
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      throw new GuardianConsentError(400, 'The request body must be valid JSON.');
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new GuardianConsentError(400, 'A JSON request body is required.');
  }
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > 8_192) {
    throw new GuardianConsentError(413, 'The request is too large.');
  }
  return body;
}

export function getClientAddress(req) {
  const forwarded = req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'];
  const values = Array.isArray(forwarded) ? forwarded : [forwarded];
  const addresses = values.filter((value) => typeof value === 'string').join(',').split(',');
  const address = addresses.at(-1)?.trim();
  return address && address.length <= 64 ? address : null;
}

export function readFormBody(req) {
  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > 8_192) {
    throw new GuardianConsentError(413, 'The approval form is too large.');
  }
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    if (Buffer.byteLength(JSON.stringify(req.body), 'utf8') > 8_192) {
      throw new GuardianConsentError(413, 'The approval form is too large.');
    }
    return req.body;
  }
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf8') > 8_192) {
      throw new GuardianConsentError(413, 'The approval form is too large.');
    }
    return Object.fromEntries(new URLSearchParams(req.body));
  }
  return {};
}

export async function enforceGuardianRateLimit(admin, email, action, limit, windowSeconds) {
  const bucketHash = hashGuardianValue(`${action}:${email}`);
  const { data, error } = await admin.rpc('guardian_rate_limit', {
    p_bucket_hash: bucketHash,
    p_action: action,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    throw new GuardianConsentError(503, 'Guardian approval is temporarily unavailable.');
  }
  if (data !== true) {
    throw new GuardianConsentError(429, 'Too many attempts. Please wait before trying again.');
  }
}

export function getProductionOrigin() {
  const configuredOrigin = process.env.APP_BASE_URL;
  if (!configuredOrigin) {
    throw new GuardianConsentError(503, 'Guardian approval is not configured yet.');
  }
  let origin;
  try {
    origin = new URL(configuredOrigin);
  } catch {
    throw new GuardianConsentError(503, 'Guardian approval is not configured yet.');
  }
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/') {
    throw new GuardianConsentError(503, 'Guardian approval is not configured yet.');
  }
  return origin.origin;
}

export async function sendGuardianEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || !EMAIL_PATTERN.test(from.match(/<([^<>]+)>$/)?.[1] || from)) {
    throw new GuardianConsentError(503, 'Guardian email delivery is not configured yet.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new GuardianConsentError(502, 'The approval email could not be sent. Please try again later.');
  }
}

export function escapeEmailHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function sendGuardianJson(res, statusCode, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(statusCode).json(body);
}

export function sendGuardianHtml(res, statusCode, html) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
  res.status(statusCode).send(html);
}

export function renderApprovalPage({ token, learnerAlias, tutorRequested }) {
  const safeAlias = escapeEmailHtml(learnerAlias);
  const tutorSummary = tutorRequested
    ? '<p>The learner has requested approval to connect with one selected tutor. You can approve or decline that separate connection below.</p>'
    : '';
  const tutorCheck = tutorRequested
    ? '<label><input type="checkbox" name="tutorConsent" value="yes"> I separately approve the requested tutor connection.</label>'
    : '';
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Review Idilewa guardian request</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#f7faf6;color:#183326;margin:0;padding:24px}.card{max-width:620px;margin:8vh auto;background:white;padding:clamp(24px,5vw,42px);border-radius:20px;box-shadow:0 16px 45px #18332618}h1{line-height:1.15}label{display:flex;gap:12px;margin:18px 0;align-items:flex-start}input{margin-top:5px;accent-color:#15764a}button{background:#15764a;color:white;border:0;border-radius:999px;padding:14px 20px;font:inherit;font-weight:700;cursor:pointer}.notice{color:#56665b;font-size:14px}</style><main class="card"><p>Idilewa · Family approval</p><h1>Review this learning request</h1><p>${safeAlias} is asking for a supervised Idilewa learning account.</p>${tutorSummary}<p>Review the privacy notice and decide whether to approve. Approval sends a short-lived sign-up code to the learner’s email address. This confirms your click, not your legal identity or authority.</p><form method="post"><input type="hidden" name="token" value="${escapeEmailHtml(token)}"><label><input type="checkbox" name="authority" value="yes" required> I am the learner’s parent or legal guardian, or am legally authorized to act for them.</label><label><input type="checkbox" name="accountConsent" value="yes" required> I have reviewed the information and approve this supervised learning account.</label>${tutorCheck}<label><input type="checkbox" name="privacyReviewed" value="yes" required> I understand the approval code expires and can only be used for this learner’s account.</label><button type="submit">Approve and email the learner’s code</button></form><p class="notice">If you did not request this, close this page. No approval is recorded until you submit this form.</p></main></html>`;
}

export function renderApprovalResult(message) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Idilewa approval</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#f7faf6;color:#183326;margin:0;padding:24px}.card{max-width:620px;margin:8vh auto;background:white;padding:clamp(24px,5vw,42px);border-radius:20px;box-shadow:0 16px 45px #18332618}h1{line-height:1.15}</style><main class="card"><p>Idilewa · Family approval</p><h1>Thank you</h1><p>${escapeEmailHtml(message)}</p></main></html>`;
}
