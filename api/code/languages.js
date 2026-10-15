import { getRuntimeLanguages, RunnerConfigurationError, sendJson } from '../../src/server/judge0.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const languages = await getRuntimeLanguages();
    return sendJson(res, 200, { languages: languages.map(({ id, name }) => ({ id, name })) }, {
      'Cache-Control': 'private, max-age=60',
    });
  } catch (error) {
    const status = error instanceof RunnerConfigurationError ? 503 : 502;
    if (status === 502) {
      const message = error instanceof Error ? error.message : '';
      const upstreamStatus = message.match(/\bHTTP (\d{3})\b/)?.[1] || null;
      console.error('[code/languages] Private runner lookup failed.', {
        errorType: error instanceof Error ? error.name : 'UnknownError',
        upstreamStatus,
      });
    }
    return sendJson(res, status, {
      error: status === 503
        ? 'The private code runner has not been configured.'
        : 'The private code runner is unavailable. Try again later.',
    });
  }
}
