import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createAccessCode,
  createApprovalToken,
  getClientAddress,
  getProductionOrigin,
  GuardianConsentError,
  hashGuardianValue,
  normalizeEducatorInviteCode,
  normalizeEmail,
  readFormBody,
  readJsonBody,
  renderApprovalPage,
} from '../src/server/guardianConsent.js';

test('guardian inputs are normalized, bounded, and escaped', () => {
  assert.equal(normalizeEmail('  Parent@Example.COM '), 'parent@example.com');
  assert.throws(() => normalizeEmail('not-an-email'), GuardianConsentError);
  assert.throws(() => readJsonBody({ headers: {}, body: { payload: 'x'.repeat(9_000) } }), (error) => error.statusCode === 413);
  assert.throws(() => readJsonBody({ headers: { 'content-length': '9000' }, body: {} }), (error) => error.statusCode === 413);
  assert.throws(() => readFormBody({ headers: {}, body: `payload=${'x'.repeat(9_000)}` }), (error) => error.statusCode === 413);
  assert.match(
    renderApprovalPage({ token: 'a'.repeat(40), learnerAlias: '<script>', tutorRequested: false }),
    /&lt;script&gt;/,
  );
});

test('educator invitations normalize and validate before lookup', () => {
  assert.equal(normalizeEducatorInviteCode('  abcdef0123456789  '), 'ABCDEF0123456789');
  assert.throws(() => normalizeEducatorInviteCode('short'), GuardianConsentError);
  assert.throws(() => normalizeEducatorInviteCode('invite_code_with_underscore'), GuardianConsentError);
  assert.throws(() => normalizeEducatorInviteCode('bad code value'), GuardianConsentError);
});

test('guardian tokens and codes use bounded cryptographically random formats', () => {
  const previousSecret = process.env.GUARDIAN_TOKEN_SECRET;
  process.env.GUARDIAN_TOKEN_SECRET = 'test-only-secret-that-is-at-least-32-characters';
  try {
    const token = createApprovalToken();
    const code = createAccessCode();
    assert.match(token, /^[A-Za-z0-9_-]{40,50}$/);
    assert.match(code, /^\d{6}$/);
    assert.equal(hashGuardianValue(token), hashGuardianValue(token));
    assert.notEqual(hashGuardianValue(token), token);
  } finally {
    if (previousSecret === undefined) delete process.env.GUARDIAN_TOKEN_SECRET;
    else process.env.GUARDIAN_TOKEN_SECRET = previousSecret;
  }
});

test('production approval origin is HTTPS-only and proxy address parsing is bounded', () => {
  const previousOrigin = process.env.APP_BASE_URL;
  try {
    process.env.APP_BASE_URL = 'https://idilewa.example/';
    assert.equal(getProductionOrigin(), 'https://idilewa.example');
    process.env.APP_BASE_URL = 'http://idilewa.example/';
    assert.throws(() => getProductionOrigin(), GuardianConsentError);
  } finally {
    if (previousOrigin === undefined) delete process.env.APP_BASE_URL;
    else process.env.APP_BASE_URL = previousOrigin;
  }

  assert.equal(getClientAddress({ headers: { 'x-forwarded-for': 'spoofed, 203.0.113.5' } }), '203.0.113.5');
  assert.equal(getClientAddress({ headers: {} }), null);
});
