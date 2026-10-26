import assert from 'node:assert/strict';
import test from 'node:test';
import authHandler from '../api/auth/welcome.js';
import { createAuthCodeEmail, createAuthRecoveryEmail } from '../src/server/authCodeEmail.js';

const testUserId = '550e8400-e29b-41d4-a716-446655440000';

function createResponse() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('auth code email templates validate codes and explain each purpose', () => {
  const childSignin = createAuthCodeEmail({ code: '12345678', purpose: 'child-signin' });
  assert.match(childSignin.subject, /child’s Idilewa sign-in passcode/);
  assert.match(childSignin.text, /Share this one-time passcode with your child/);
  assert.match(childSignin.html, />12345678</);
  assert.match(childSignin.html, /idilewa-email-logo\.png/);

  assert.throws(() => createAuthCodeEmail({ code: '<script>', purpose: 'child-signin' }));
  assert.throws(() => createAuthCodeEmail({ code: '123456', purpose: 'signin' }));
  assert.throws(() => createAuthCodeEmail({ code: '123456', purpose: 'recovery' }));
  assert.throws(() => createAuthCodeEmail({ code: '123456', purpose: 'password-reset' }));
});

test('password recovery email includes a safe one-time link in HTML and plain text', () => {
  const email = createAuthRecoveryEmail({
    recoveryUrl: 'https://auth.example.com/verify?token=abc&type=recovery',
  });
  assert.match(email.subject, /Reset your Idilewa password/);
  assert.match(email.text, /https:\/\/auth\.example\.com\/verify\?token=abc&amp;type=recovery|https:\/\/auth\.example\.com\/verify\?token=abc&type=recovery/);
  assert.match(email.html, /href="https:\/\/auth\.example\.com\/verify\?token=abc&amp;type=recovery"/);
  assert.throws(() => createAuthRecoveryEmail({ recoveryUrl: 'javascript:alert(1)' }));
  assert.throws(() => createAuthRecoveryEmail({ recoveryUrl: 'https://user:pass@example.com/reset' }));
});

test('auth code endpoint validates methods and malformed requests', async () => {
  const methodResponse = createResponse();
  await authHandler({ method: 'GET', headers: {}, query: { action: 'email-code' } }, methodResponse);
  assert.equal(methodResponse.statusCode, 405);
  assert.equal(methodResponse.headers.Allow, 'POST');

  const invalidEmailResponse = createResponse();
  await authHandler({
    method: 'POST',
    headers: {},
    query: { action: 'email-code' },
    body: { email: 'not-an-email', purpose: 'signup' },
  }, invalidEmailResponse);
  assert.equal(invalidEmailResponse.statusCode, 400);

  const invalidPurposeResponse = createResponse();
  await authHandler({
    method: 'POST',
    headers: {},
    query: { action: 'email-code' },
    body: { email: 'learner@example.com', purpose: 'admin' },
  }, invalidPurposeResponse);
  assert.equal(invalidPurposeResponse.statusCode, 400);
  const resetRequestResponse = createResponse();
  await authHandler({
    method: 'POST',
    headers: {},
    query: { action: 'email-code' },
    body: { email: 'adult@example.com', purpose: 'password-reset' },
  }, resetRequestResponse);
  assert.equal(resetRequestResponse.statusCode, 503);
  const disabledAdultCodeResponse = createResponse();
  await authHandler({
    method: 'POST',
    headers: {},
    query: { action: 'email-code' },
    body: { email: 'adult@example.com', purpose: 'signin' },
  }, disabledAdultCodeResponse);
  assert.equal(disabledAdultCodeResponse.statusCode, 400);
});

test('password reset creates a Supabase recovery link and sends it through Resend', async () => {
  const envNames = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GUARDIAN_TOKEN_SECRET',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'APP_BASE_URL',
  ];
  const previousEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));
  const originalFetch = globalThis.fetch;
  const requests = [];
  process.env.SUPABASE_URL = 'https://test-project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  process.env.GUARDIAN_TOKEN_SECRET = 'test-only-secret-that-is-at-least-32-characters';
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.RESEND_FROM_EMAIL = 'Idilewa <no-reply@example.com>';
  process.env.APP_BASE_URL = 'https://www.idilewa.com';

  globalThis.fetch = async (input, init = {}) => {
    const url = String(input);
    const body = init.body ? JSON.parse(init.body) : null;
    requests.push({ url, body });
    if (url.includes('/rpc/guardian_rate_limit')) {
      return new Response('true', { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/auth/v1/admin/generate_link')) {
      assert.equal(body.type, 'recovery');
      assert.equal(body.email, 'adult@example.com');
      assert.equal(new URL(url).searchParams.get('redirect_to'), 'https://www.idilewa.com/auth-callback.html?next=login');
      const recoveryUrl = 'https://test-project.supabase.co/auth/v1/verify?token=recovery-token&type=recovery&redirect_to=https%3A%2F%2Fwww.idilewa.com%2Fauth-callback.html%3Fnext%3Dlogin';
      return new Response(JSON.stringify({
        action_link: recoveryUrl,
        properties: { action_link: recoveryUrl },
        user: { id: testUserId, email: 'adult@example.com' },
      }), { status: 200 });
    }
    if (url === 'https://api.resend.com/emails') {
      return new Response(JSON.stringify({ id: 'test-email-id' }), { status: 200 });
    }
    throw new Error(`Unexpected request URL: ${url}`);
  };

  try {
    const response = createResponse();
    await authHandler({
      method: 'POST',
      headers: { 'x-forwarded-for': '203.0.113.25' },
      query: { action: 'email-code' },
      body: { email: 'Adult@example.com', purpose: 'password-reset' },
    }, response);

    assert.equal(response.statusCode, 202);
    assert.equal(response.body.message, 'If an account uses this email, a password-reset link will be sent.');
    const resendRequest = requests.find(({ url }) => url === 'https://api.resend.com/emails');
    assert.ok(resendRequest);
    assert.deepEqual(resendRequest.body.to, ['adult@example.com']);
    assert.match(resendRequest.body.html, /auth-callback\.html/);
    assert.equal(requests.some(({ url }) => url.includes('/auth/v1/recover')), false);
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of envNames) {
      if (previousEnv[name] === undefined) delete process.env[name];
      else process.env[name] = previousEnv[name];
    }
  }
});

test('password reset responds generically when the requested account does not exist', async () => {
  const envNames = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GUARDIAN_TOKEN_SECRET',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'APP_BASE_URL',
  ];
  const previousEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));
  const originalFetch = globalThis.fetch;
  process.env.SUPABASE_URL = 'https://test-project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  process.env.GUARDIAN_TOKEN_SECRET = 'test-only-secret-that-is-at-least-32-characters';
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.RESEND_FROM_EMAIL = 'Idilewa <no-reply@example.com>';
  process.env.APP_BASE_URL = 'https://www.idilewa.com';
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('/rpc/guardian_rate_limit')) {
      return new Response('true', { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/auth/v1/admin/generate_link')) {
      return new Response(JSON.stringify({ code: 'user_not_found', msg: 'User not found' }), { status: 404 });
    }
    throw new Error(`Unexpected request URL: ${url}`);
  };

  try {
    const response = createResponse();
    await authHandler({
      method: 'POST',
      headers: {},
      query: { action: 'email-code' },
      body: { email: 'unknown@example.com', purpose: 'password-reset' },
    }, response);
    assert.equal(response.statusCode, 202);
    assert.equal(response.body.message, 'If an account uses this email, a password-reset link will be sent.');
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of envNames) {
      if (previousEnv[name] === undefined) delete process.env[name];
      else process.env[name] = previousEnv[name];
    }
  }
});

test('child sign-in code is generated by Supabase and delivered only to the approved parent', async () => {
  const envNames = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GUARDIAN_TOKEN_SECRET',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
  ];
  const previousEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));
  const originalFetch = globalThis.fetch;
  const requests = [];
  process.env.SUPABASE_URL = 'https://test-project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  process.env.GUARDIAN_TOKEN_SECRET = 'test-only-secret-that-is-at-least-32-characters';
  process.env.RESEND_API_KEY = 'test-resend-key';
  process.env.RESEND_FROM_EMAIL = 'Idilewa <no-reply@example.com>';

  globalThis.fetch = async (input, init = {}) => {
    const url = String(input);
    const body = init.body ? JSON.parse(init.body) : null;
    requests.push({ url, body });
    if (url.includes('/rpc/guardian_rate_limit')) {
      return new Response('true', { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/rest/v1/profiles')) {
      return new Response(JSON.stringify({
        id: testUserId,
        role: 'child',
        parent_consent_request_id: '9346b1d4-eacd-4a90-a25e-5fe08ea17416',
      }), { status: 200 });
    }
    if (url.includes('/rest/v1/guardian_access_requests')) {
      return new Response(JSON.stringify({ parent_email: 'guardian@example.com' }), { status: 200 });
    }
    if (url.includes(`/auth/v1/admin/users/${testUserId}`)) {
      return new Response(JSON.stringify({
        user: {
          id: testUserId,
          email: 'learner@example.com',
          email_confirmed_at: '2026-10-23T05:00:00.000Z',
        },
      }), { status: 200 });
    }
    if (url.includes('/auth/v1/admin/generate_link')) {
      assert.equal(body.type, 'magiclink');
      return new Response(JSON.stringify({
        action_link: 'https://example.com/verify',
        email_otp: '123456',
        hashed_token: 'hashed-token',
        redirect_to: '',
        verification_type: 'magiclink',
        user: { id: testUserId, email: 'learner@example.com' },
      }), { status: 200 });
    }
    if (url === 'https://api.resend.com/emails') {
      return new Response(JSON.stringify({ id: 'test-email-id' }), { status: 200 });
    }
    throw new Error(`Unexpected request URL: ${url}`);
  };

  try {
    const response = createResponse();
    await authHandler({
      method: 'POST',
      headers: { 'x-forwarded-for': '203.0.113.25' },
      query: { action: 'email-code' },
      body: { email: 'Learner@example.com', purpose: 'child-signin' },
    }, response);

    assert.equal(response.statusCode, 202);
    assert.equal(response.body.message, 'If the account exists and is eligible, a passcode will be sent to its parent or guardian.');
    const resendRequest = requests.find(({ url }) => url === 'https://api.resend.com/emails');
    assert.ok(resendRequest);
    assert.deepEqual(resendRequest.body.to, ['guardian@example.com']);
    assert.match(resendRequest.body.text, /123456/);
    assert.equal(JSON.stringify(response.body).includes('123456'), false);
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of envNames) {
      if (previousEnv[name] === undefined) delete process.env[name];
      else process.env[name] = previousEnv[name];
    }
  }
});
