import assert from 'node:assert/strict';
import test from 'node:test';
import translateHandler from '../api/translate.js';

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

async function withTranslationMocks({ apiKey = 'test-google-key', fetchMock, run }) {
  const previousKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  if (apiKey === null) delete process.env.GOOGLE_TRANSLATE_API_KEY;
  else process.env.GOOGLE_TRANSLATE_API_KEY = apiKey;
  globalThis.fetch = fetchMock;
  console.error = () => {};
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
    if (previousKey === undefined) delete process.env.GOOGLE_TRANSLATE_API_KEY;
    else process.env.GOOGLE_TRANSLATE_API_KEY = previousKey;
  }
}

test('translation endpoint validates methods, configuration and request bodies', async () => {
  await withTranslationMocks({
    apiKey: null,
    fetchMock: async () => {
      throw new Error('Should not call Google without a configured key.');
    },
    run: async () => {
      const unconfigured = createResponse();
      await translateHandler({ method: 'POST', headers: {}, body: {} }, unconfigured);
      assert.equal(unconfigured.statusCode, 503);

      const method = createResponse();
      await translateHandler({ method: 'DELETE', headers: {} }, method);
      assert.equal(method.statusCode, 405);
      assert.equal(method.headers.Allow, 'GET, POST');
    },
  });

  await withTranslationMocks({
    fetchMock: async () => {
      throw new Error('Validation should prevent upstream calls.');
    },
    run: async () => {
      for (const [body, expectedStatus] of [
        [{ text: '', target: 'yo' }, 400],
        [{ text: 'Hello', target: 'bad value' }, 400],
        [{ text: 'x'.repeat(5_001), target: 'yo' }, 413],
      ]) {
        const response = createResponse();
        await translateHandler({ method: 'POST', headers: {}, body }, response);
        assert.equal(response.statusCode, expectedStatus);
      }
    },
  });
});

test('translation endpoint returns supported target languages from Google', async () => {
  await withTranslationMocks({
    fetchMock: async (url) => {
      assert.match(String(url), /\/languages\?/);
      return new Response(JSON.stringify({
        data: {
          languages: [
            { language: 'yo', name: 'Yoruba' },
            { language: 'en', name: 'English' },
            { language: '../bad', name: 'Invalid' },
          ],
        },
      }), { status: 200 });
    },
    run: async () => {
      const response = createResponse();
      await translateHandler({ method: 'GET', headers: {} }, response);
      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body.languages, [
        { code: 'en', name: 'English' },
        { code: 'yo', name: 'Yoruba' },
      ]);
      assert.match(response.headers['Cache-Control'], /s-maxage=86400/);
    },
  });
});

test('translation endpoint sends bounded plain text to Google and returns machine translation', async () => {
  await withTranslationMocks({
    fetchMock: async (url, options) => {
      assert.match(String(url), /^https:\/\/translation\.googleapis\.com\/language\/translate\/v2\?/);
      assert.equal(options.method, 'POST');
      assert.equal(options.headers['Content-Type'], 'application/json; charset=utf-8');
      assert.deepEqual(JSON.parse(options.body), {
        q: 'God is good to everyone today.',
        source: 'en',
        target: 'yo',
        format: 'text',
        model: 'nmt',
      });
      return new Response(JSON.stringify({
        data: { translations: [{ translatedText: 'Ọlọ́run dára sí gbogbo ènìyàn lónìí.' }] },
      }), { status: 200 });
    },
    run: async () => {
      const response = createResponse();
      await translateHandler({
        method: 'POST',
        headers: {},
        body: { text: ' God is good to everyone today. ', target: 'yo' },
      }, response);
      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.body, {
        translated: 'Ọlọ́run dára sí gbogbo ènìyàn lónìí.',
        target: 'yo',
        provider: 'Google Cloud Translation',
        machineTranslated: true,
      });
      assert.equal(response.headers['Cache-Control'], 'no-store');
    },
  });
});
