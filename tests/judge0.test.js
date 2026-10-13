import assert from 'node:assert/strict';
import test from 'node:test';
import {
  executeCode,
  getRunnerUrl,
  readCodeRequest,
  RunnerConfigurationError,
} from '../src/server/judge0.js';

test('readCodeRequest accepts bounded source and rejects malformed or oversized data', () => {
  assert.deepEqual(
    readCodeRequest({
      headers: { 'content-length': '39' },
      body: { language: 'python', code: 'print("hello")' },
    }),
    { language: 'python', code: 'print("hello")' },
  );
  assert.throws(
    () => readCodeRequest({ headers: {}, body: { language: 'python', code: '' } }),
    /Add code before running it/,
  );
  assert.throws(
    () => readCodeRequest({ headers: {}, body: { language: 'python', code: '🙂'.repeat(10_001) } }),
    (error) => error.statusCode === 413,
  );
});

test('getRunnerUrl requires a credential-free HTTP(S) endpoint', () => {
  const previous = process.env.JUDGE0_URL;
  try {
    delete process.env.JUDGE0_URL;
    assert.throws(() => getRunnerUrl(), RunnerConfigurationError);
    process.env.JUDGE0_URL = 'https://runner.example.test/';
    assert.equal(getRunnerUrl(), 'https://runner.example.test');
    process.env.JUDGE0_URL = 'https://user:pass@runner.example.test';
    assert.throws(() => getRunnerUrl(), RunnerConfigurationError);
  } finally {
    if (previous === undefined) delete process.env.JUDGE0_URL;
    else process.env.JUDGE0_URL = previous;
  }
});

test('executeCode polls queued submissions and returns bounded output details', async () => {
  const previousUrl = process.env.JUDGE0_URL;
  const previousToken = process.env.JUDGE0_AUTH_TOKEN;
  const previousFetch = globalThis.fetch;
  const requests = [];
  process.env.JUDGE0_URL = 'https://runner.example.test';
  process.env.JUDGE0_AUTH_TOKEN = 'server-only-token';
  globalThis.fetch = async (url, options = {}) => {
    requests.push({ url: String(url), options });
    if (String(url).endsWith('/languages')) {
      return Response.json([{ id: 71, name: 'Python (3.11.4)' }]);
    }
    if (String(url).includes('/submissions?')) {
      return Response.json({ token: 'submission-1', status: { id: 1, description: 'In Queue' } });
    }
    return Response.json({
      status: { id: 3, description: 'Accepted' },
      stdout: Buffer.from('hello\n').toString('base64'),
      stderr: null,
      time: '0.01',
      memory: 1_024,
    });
  };

  try {
    const result = await executeCode('python', 'print("hello")');
    assert.deepEqual(result, {
      status: 'Accepted',
      stdout: 'hello\n',
      stderr: '',
      time: '0.01',
      memory: 1_024,
      accepted: true,
    });
    assert.equal(requests.length, 3);
    assert.equal(requests[1].options.headers.get('Content-Type'), 'application/json');
    assert.equal(requests[1].options.headers.get('X-Auth-Token'), 'server-only-token');
    assert.equal(requests[2].options.headers.get('X-Auth-Token'), 'server-only-token');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.JUDGE0_URL;
    else process.env.JUDGE0_URL = previousUrl;
    if (previousToken === undefined) delete process.env.JUDGE0_AUTH_TOKEN;
    else process.env.JUDGE0_AUTH_TOKEN = previousToken;
  }
});
