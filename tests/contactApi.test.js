import assert from 'node:assert/strict';
import test from 'node:test';
import contactHandler from '../api/contact.js';

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

async function withContactMocks({ apiKey = 'test-resend-key', fetchMock, run }) {
  const previousKey = process.env.RESEND_API_KEY;
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  if (apiKey === null) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = apiKey;
  globalThis.fetch = fetchMock;
  console.error = () => {};
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
  }
}

const validBody = {
  name: 'Adaeze O.',
  email: 'adaeze@example.com',
  topic: 'learning-support',
  message: 'Please help me reset a lesson.',
};

test('contact endpoint enforces method, configuration and validation', async () => {
  await withContactMocks({
    apiKey: null,
    fetchMock: async () => {
      throw new Error('Should not call Resend without a configured key.');
    },
    run: async () => {
      const method = createResponse();
      await contactHandler({ method: 'GET', headers: {} }, method);
      assert.equal(method.statusCode, 405);
      assert.equal(method.headers.Allow, 'POST');

      const unconfigured = createResponse();
      await contactHandler({ method: 'POST', headers: {}, body: validBody }, unconfigured);
      assert.equal(unconfigured.statusCode, 503);
    },
  });

  await withContactMocks({
    fetchMock: async () => {
      throw new Error('Validation should prevent upstream calls.');
    },
    run: async () => {
      const cases = [
        [{ ...validBody, name: '' }, 400],
        [{ ...validBody, email: 'not-an-email' }, 400],
        [{ ...validBody, message: '   ' }, 400],
        [{ ...validBody, message: 'a'.repeat(4_001) }, 413],
      ];
      for (const [body, status] of cases) {
        const response = createResponse();
        await contactHandler({ method: 'POST', headers: {}, body }, response);
        assert.equal(response.statusCode, status, JSON.stringify(body).slice(0, 60));
      }
    },
  });
});

test('contact endpoint silently drops honeypot submissions', async () => {
  await withContactMocks({
    fetchMock: async () => {
      throw new Error('Honeypot submissions must not reach Resend.');
    },
    run: async () => {
      const response = createResponse();
      await contactHandler(
        { method: 'POST', headers: {}, body: { ...validBody, company: 'spam-co' } },
        response,
      );
      assert.equal(response.statusCode, 400);
    },
  });
});

test('contact endpoint emails the team and sets reply-to to the sender', async () => {
  let capturedBody = null;
  let capturedAuth = '';
  await withContactMocks({
    fetchMock: async (url, options) => {
      assert.equal(String(url), 'https://api.resend.com/emails');
      capturedBody = JSON.parse(options.body);
      capturedAuth = options.headers.Authorization;
      return { ok: true, status: 200, json: async () => ({ id: 'email_123' }) };
    },
    run: async () => {
      const response = createResponse();
      await contactHandler({ method: 'POST', headers: {}, body: validBody }, response);
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.ok, true);
      assert.match(response.body.message, /sent/i);
    },
  });

  assert.match(capturedAuth, /^Bearer /);
  assert.deepEqual(capturedBody.to, ['idilewa2026@gmail.com']);
  assert.equal(capturedBody.reply_to, 'adaeze@example.com');
  assert.match(capturedBody.subject, /Learning support/);
  assert.match(capturedBody.html, /Please help me reset a lesson\./);
});

test('contact endpoint escapes user content in the email body', async () => {
  let capturedBody = null;
  await withContactMocks({
    fetchMock: async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return { ok: true, status: 200, json: async () => ({ id: 'email_456' }) };
    },
    run: async () => {
      const response = createResponse();
      await contactHandler(
        {
          method: 'POST',
          headers: {},
          body: { ...validBody, name: '<script>alert(1)</script>', message: '<b>bold</b>' },
        },
        response,
      );
      assert.equal(response.statusCode, 200);
    },
  });

  assert.doesNotMatch(capturedBody.html, /<script>/);
  assert.match(capturedBody.html, /&lt;script&gt;/);
  assert.match(capturedBody.html, /&lt;b&gt;bold&lt;\/b&gt;/);
});

test('contact endpoint routes tutor messages with the educator named in the subject', async () => {
  let capturedBody = null;
  await withContactMocks({
    fetchMock: async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return { ok: true, status: 200, json: async () => ({ id: 'email_tutor' }) };
    },
    run: async () => {
      const response = createResponse();
      await contactHandler(
        {
          method: 'POST',
          headers: {},
          body: {
            name: 'Bola T.',
            email: 'bola@example.com',
            topic: 'tutor-connection',
            teacher: 'Tola A.',
            source: 'tutor',
            message: 'Are there evening Live Lessons for beginners?',
          },
        },
        response,
      );
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.ok, true);
    },
  });

  assert.match(capturedBody.subject, /\[Idilewa tutor message\]/);
  assert.match(capturedBody.subject, /Tutor connection request/);
  assert.match(capturedBody.text, /Tutor: Tola A\./);
  assert.match(capturedBody.html, /Tola A\./);
  assert.match(capturedBody.html, /evening Live Lessons/);
});

test('contact endpoint rejects an oversized tutor reference', async () => {
  await withContactMocks({
    fetchMock: async () => {
      throw new Error('Validation should prevent upstream calls.');
    },
    run: async () => {
      const response = createResponse();
      await contactHandler(
        { method: 'POST', headers: {}, body: { ...validBody, teacher: 'x'.repeat(81), source: 'tutor' } },
        response,
      );
      assert.equal(response.statusCode, 400);
    },
  });
});

test('contact endpoint reports provider failures without leaking details', async () => {
  await withContactMocks({
    fetchMock: async () => ({ ok: false, status: 422, json: async () => ({ name: 'validation_error' }) }),
    run: async () => {
      const response = createResponse();
      await contactHandler({ method: 'POST', headers: {}, body: validBody }, response);
      assert.equal(response.statusCode, 502);
      assert.match(response.body.error, /could not be sent/i);
    },
  });
});
