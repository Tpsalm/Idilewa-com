const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 32 * 1_024;
const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 4_000;

const TOPICS = {
  'learning-support': 'Learning support',
  'school-partnership': 'School partnership',
  'safety-concern': 'Safety & privacy concern',
  'general-question': 'General question',
  'tutor-connection': 'Tutor connection request',
};

const SOURCES = {
  contact: { subject: '[Idilewa contact]', label: 'contact message' },
  tutor: { subject: '[Idilewa tutor message]', label: 'tutor message' },
};

const MAX_TEACHER_LENGTH = 80;

export const config = { maxDuration: 15 };

function sendJson(res, statusCode, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(statusCode).json(body);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function parseBody(req) {
  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { error: { status: 413, message: 'That message is too large to send.' } };
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

  if (typeof body.company === 'string' && body.company.trim()) {
    return { error: { status: 400, message: 'This message could not be sent.' } };
  }

  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const topicKey = TOPICS[body.topic] ? body.topic : 'general-question';
  const teacher = typeof body.teacher === 'string' ? body.teacher.trim().replace(/\s+/g, ' ') : '';
  const source = SOURCES[body.source] ? body.source : 'contact';

  if (!name) return { error: { status: 400, message: 'Enter your name.' } };
  if (name.length > MAX_NAME_LENGTH) {
    return { error: { status: 400, message: `Keep your name under ${MAX_NAME_LENGTH} characters.` } };
  }
  if (!EMAIL_PATTERN.test(email)) return { error: { status: 400, message: 'Enter a valid email address.' } };
  if (!message) return { error: { status: 400, message: 'Write a message before sending.' } };
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: { status: 413, message: `Keep your message under ${MAX_MESSAGE_LENGTH} characters.` } };
  }
  if (teacher.length > MAX_TEACHER_LENGTH) {
    return { error: { status: 400, message: 'That tutor reference is not valid.' } };
  }

  return { name, email, message, topicKey, teacher, source };
}

function buildEmail({ name, email, message, topicKey, teacher, source }) {
  const topic = TOPICS[topicKey];
  const meta = SOURCES[source];
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    topic: escapeHtml(topic),
    teacher: escapeHtml(teacher),
    message: escapeHtml(message).replace(/\n/g, '<br />'),
  };
  const teacherText = teacher ? `\nTutor: ${teacher}` : '';
  const teacherHtml = teacher ? `<p style="margin:0 0 4px"><strong>Tutor:</strong> ${safe.teacher}</p>` : '';
  return {
    subject: `${meta.subject} ${topic} — ${name}`,
    text: `New Idilewa ${meta.label}\n\nTopic: ${topic}${teacherText}\nFrom: ${name} <${email}>\n\n${message}\n\nReply directly to this email to respond.`,
    html: `<div style="font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#20372b">
      <p style="margin:0 0 12px"><strong>New Idilewa ${escapeHtml(meta.label)}</strong></p>
      <p style="margin:0 0 4px"><strong>Topic:</strong> ${safe.topic}</p>
      ${teacherHtml}
      <p style="margin:0 0 4px"><strong>From:</strong> ${safe.name} &lt;${safe.email}&gt;</p>
      <hr style="border:none;border-top:1px solid #e3ebe5;margin:16px 0" />
      <p style="margin:0">${safe.message}</p>
    </div>`,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const from = (process.env.RESEND_FROM_EMAIL || 'Idilewa <onboarding@resend.dev>').trim();
  const inbox = (process.env.CONTACT_INBOX_EMAIL || 'idilewa2026@gmail.com').trim();
  if (!apiKey) {
    return sendJson(res, 503, { error: 'The contact form is not configured on this deployment yet.' });
  }

  const parsed = parseBody(req);
  if (parsed.error) return sendJson(res, parsed.error.status, { error: parsed.error.message });

  const emailContent = buildEmail(parsed);

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [inbox],
        reply_to: parsed.email,
        ...emailContent,
      }),
      signal: AbortSignal.timeout(12_000),
    });
  } catch (error) {
    console.error('[contact] Email provider request failed.', {
      errorType: error instanceof Error ? error.name : 'UnknownError',
    });
    return sendJson(res, 502, { error: 'Your message could not be sent right now. Please try again.' });
  }

  if (!response.ok) {
    let providerCode = '';
    try {
      const result = await response.json();
      providerCode = typeof result?.name === 'string' ? result.name : '';
    } catch {
      providerCode = 'invalid_provider_response';
    }
    console.error('[contact] Email provider rejected the message.', {
      status: response.status,
      code: providerCode,
    });
    return sendJson(res, response.status === 429 ? 429 : 502, {
      error: response.status === 429
        ? 'Too many messages were sent. Please wait a moment and try again.'
        : 'Your message could not be sent right now. Please try again.',
    });
  }

  return sendJson(res, 200, {
    ok: true,
    message: 'Thank you — your message has been sent to the Idilewa team.',
  });
}
