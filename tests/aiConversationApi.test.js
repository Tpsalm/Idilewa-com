import assert from 'node:assert/strict';
import test from 'node:test';
import aiConversationHandler from '../api/ai-conversation.js';

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

function geminiReply(text) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ candidates: [{ content: { parts: [{ text }] } }] }),
  };
}

async function withAiMocks({ apiKey = 'test-gemini-key', fetchMock, run }) {
  const previousKey = process.env.GEMINI_API_KEY;
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  if (apiKey === null) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = apiKey;
  globalThis.fetch = fetchMock;
  console.error = () => {};
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
}

test('ai-conversation rejects unsupported methods and unconfigured deployments', async () => {
  await withAiMocks({
    apiKey: null,
    fetchMock: async () => {
      throw new Error('Should not call Gemini without a configured key.');
    },
    run: async () => {
      const method = createResponse();
      await aiConversationHandler({ method: 'GET', headers: {} }, method);
      assert.equal(method.statusCode, 405);
      assert.equal(method.headers.Allow, 'POST');

      const unconfigured = createResponse();
      await aiConversationHandler({ method: 'POST', headers: {}, body: { message: 'hi' } }, unconfigured);
      assert.equal(unconfigured.statusCode, 503);
      assert.match(unconfigured.body.error, /not configured/i);
    },
  });
});

test('ai-conversation validates the message body before calling the model', async () => {
  await withAiMocks({
    fetchMock: async () => {
      throw new Error('Validation should prevent upstream calls.');
    },
    run: async () => {
      for (const body of [null, [], {}, { message: '   ' }, { message: 42 }]) {
        const response = createResponse();
        await aiConversationHandler({ method: 'POST', headers: {}, body }, response);
        assert.equal(response.statusCode, 400, JSON.stringify(body));
      }

      const tooLong = createResponse();
      await aiConversationHandler(
        { method: 'POST', headers: {}, body: { message: 'a'.repeat(2_001) } },
        tooLong,
      );
      assert.equal(tooLong.statusCode, 413);
    },
  });
});

test('ai-conversation forwards language, topic and history and returns the model reply', async () => {
  let capturedUrl = '';
  let capturedBody = null;
  await withAiMocks({
    fetchMock: async (url, options) => {
      capturedUrl = String(url);
      capturedBody = JSON.parse(options.body);
      return geminiReply('Báwo ni!\nHow are you?');
    },
    run: async () => {
      const response = createResponse();
      await aiConversationHandler(
        {
          method: 'POST',
          headers: {},
          body: {
            message: 'Hello',
            language: 'Yorùbá',
            topic: 'Family & Friends',
            history: [
              { role: 'user', text: 'Hi' },
              { role: 'model', text: 'Báwo ni' },
              { role: 'user', text: '   ' },
            ],
          },
        },
        response,
      );
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.reply, 'Báwo ni!\nHow are you?');
      assert.equal(response.body.language, 'Yorùbá');
      assert.equal(response.body.provider, 'Google Gemini');
    },
  });

  assert.match(capturedUrl, /generativelanguage\.googleapis\.com/);
  assert.match(capturedUrl, /gemini-2\.5-flash/);
  assert.match(capturedBody.systemInstruction.parts[0].text, /Yoruba/);
  assert.match(capturedBody.systemInstruction.parts[0].text, /Family & Friends/);
  // Blank history turns are dropped, real ones are preserved in order.
  assert.equal(capturedBody.contents.length, 3);
  assert.equal(capturedBody.contents[0].role, 'user');
  assert.equal(capturedBody.contents[1].role, 'model');
  assert.equal(capturedBody.contents[2].parts[0].text, 'Hello');
});

test('ai-conversation surfaces provider failures and empty replies as errors', async () => {
  await withAiMocks({
    fetchMock: async () => ({ ok: false, status: 429, json: async () => ({ error: { message: 'quota' } }) }),
    run: async () => {
      const response = createResponse();
      await aiConversationHandler({ method: 'POST', headers: {}, body: { message: 'hi' } }, response);
      assert.equal(response.statusCode, 429);
    },
  });

  await withAiMocks({
    fetchMock: async () => ({ ok: true, status: 200, json: async () => ({ candidates: [] }) }),
    run: async () => {
      const response = createResponse();
      await aiConversationHandler({ method: 'POST', headers: {}, body: { message: 'hi' } }, response);
      assert.equal(response.statusCode, 422);
    },
  });

  await withAiMocks({
    fetchMock: async () => {
      throw new Error('network down');
    },
    run: async () => {
      const response = createResponse();
      await aiConversationHandler({ method: 'POST', headers: {}, body: { message: 'hi' } }, response);
      assert.equal(response.statusCode, 502);
    },
  });
});
