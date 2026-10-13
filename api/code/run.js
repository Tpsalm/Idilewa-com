import {
  executeCode,
  readCodeRequest,
  RunnerConfigurationError,
  sendJson,
} from '../../src/server/judge0.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
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
