const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MAX_MESSAGE_LENGTH = 2_000;
const MAX_HISTORY = 20;
const MAX_BODY_BYTES = 64 * 1_024;

const LANGUAGES = {
  Yorùbá: { english: 'Yoruba', code: 'yo' },
  Igbo: { english: 'Igbo', code: 'ig' },
  Hausa: { english: 'Hausa', code: 'ha' },
  Swahili: { english: 'Swahili', code: 'sw' },
  'Nigerian Pidgin': { english: 'Nigerian Pidgin', code: 'pcm' },
};

export const config = { maxDuration: 30 };

function sendJson(res, statusCode, body, headers = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  return res.status(statusCode).json(body);
}

function getApiKey() {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '').trim();
  return apiKey || null;
}

function parseBody(req) {
  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { error: { status: 413, message: 'That request is too large.' } };
  }
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return { error: { status: 400, message: 'The request body must contain valid JSON.' } };
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: { status: 400, message: 'A JSON request body is required.' } };
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) return { error: { status: 400, message: 'Enter a message to send.' } };
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: { status: 413, message: `Keep each message under ${MAX_MESSAGE_LENGTH} characters.` } };
  }

  const language = LANGUAGES[body.language] ? body.language : 'Yorùbá';
  const topic = typeof body.topic === 'string' && body.topic.trim()
    ? body.topic.trim().slice(0, 80)
    : 'Everyday Conversation';

  const history = Array.isArray(body.history) ? body.history : [];
  const turns = history
    .slice(-MAX_HISTORY)
    .map((turn) => ({
      role: turn?.role === 'model' ? 'model' : 'user',
      text: typeof turn?.text === 'string' ? turn.text.trim().slice(0, MAX_MESSAGE_LENGTH) : '',
    }))
    .filter((turn) => turn.text);

  return { message, language, topic, turns };
}

function buildSystemInstruction({ language, topic }) {
  const { english } = LANGUAGES[language];
  return [
    `You are Idilewa's African-language conversation partner. The learner is practising ${english} (shown to them as "${language}").`,
    `The current practice topic is "${topic}".`,
    'Reply in TWO parts, always. First the reply written in the target language, then the same reply translated into natural English.',
    'Use correct diacritics and tone marks for the target language, and keep the language warm, encouraging and age-appropriate.',
    'Keep each reply short: one to three sentences, suitable for a spoken practice turn.',
    'Add one gentle follow-up question to keep the conversation going.',
    'Never ask for or repeat personal details. Never produce unsafe or adult content. This platform is used by children.',
  ].join(' ');
}

function buildContents({ turns, message }) {
  const contents = turns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] }));
  contents.push({ role: 'user', parts: [{ text: message }] });
  return contents;
}

function readCandidate(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .filter((part) => part && typeof part.text === 'string' && !part.thought)
    .map((part) => part.text)
    .join('')
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'AI Conversation is not configured on this deployment yet.',
    });
  }

  const parsed = parseBody(req);
  if (parsed.error) return sendJson(res, parsed.error.status, { error: parsed.error.message });

  const { message, language, topic, turns } = parsed;

  let response;
  try {
    response = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemInstruction({ language, topic }) }] },
        contents: buildContents({ turns, message }),
        generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
      }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch (error) {
    console.error('[ai-conversation] Gemini request failed.', {
      errorType: error instanceof Error ? error.name : 'UnknownError',
    });
    return sendJson(res, 502, { error: 'The AI partner could not be reached. Please try again.' });
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    return sendJson(res, 502, { error: 'The AI partner returned an invalid response.' });
  }

  if (!response.ok) {
    const status = response.status === 429 ? 429 : response.status >= 500 ? 502 : 503;
    console.error('[ai-conversation] Gemini rejected the request.', {
      upstreamStatus: response.status,
      reason: typeof payload?.error?.message === 'string' ? payload.error.message.slice(0, 200) : null,
    });
    return sendJson(res, status, {
      error: status === 429
        ? 'The AI partner is busy right now. Try again in a moment.'
        : 'The AI partner is temporarily unavailable. Try again later.',
    });
  }

  const text = readCandidate(payload);
  if (!text) {
    const blocked = payload?.promptFeedback?.blockReason;
    return sendJson(res, 422, {
      error: blocked
        ? 'That message could not be answered. Try rephrasing it.'
        : 'The AI partner returned an empty reply. Try again.',
    });
  }

  return sendJson(res, 200, { reply: text, language, topic, provider: 'Google Gemini' });
}
