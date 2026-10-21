import {
  executeCode,
  getRuntimeLanguages,
  readCodeRequest,
  RunnerConfigurationError,
  sendJson,
} from '../../src/server/judge0.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  const operation = typeof req.query?.operation === 'string' ? req.query.operation : 'run';
  if (operation === 'languages') {
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
  if (operation !== 'run') return sendJson(res, 404, { error: 'Not found.' });

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const { language, code } = readCodeRequest(req);
    const result = await executeCode(language, code);
    return sendJson(res, 200, result);
  } catch (error) {
    const status = error instanceof RunnerConfigurationError
      ? 503
      : (error && Number.isInteger(error.statusCode) ? error.statusCode : 502);
    if (status === 502) {
      const message = error instanceof Error ? error.message : '';
      const upstreamStatus = message.match(/\bHTTP (\d{3})\b/)?.[1] || null;
      console.error('[code/run] Private runner execution failed.', {
        errorType: error instanceof Error ? error.name : 'UnknownError',
        upstreamStatus,
      });
    }
    return sendJson(res, status, {
      error: status === 503
        ? 'The private code runner has not been configured.'
        : status === 400 || status === 413 || status === 422
          ? error.message
          : status === 502
            ? 'The private code runner failed to respond. Check the runner service and try again.'
            : 'The code could not be run.',
    });
  }
}
