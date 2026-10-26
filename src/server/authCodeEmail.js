const OTP_PATTERN = /^\d{6,8}$/;

const EMAIL_COPY = {
  'child-signin': {
    subject: 'Your child’s Idilewa sign-in passcode',
    title: 'A child sign-in passcode',
    instruction: 'Share this one-time passcode with your child so they can sign in to Idilewa. It is valid only for this sign-in and expires soon.',
  },
  'password-reset': {
    subject: 'Reset your Idilewa password',
    title: 'Choose a new password',
    instruction: 'Use the secure link below to choose a new password for your Idilewa account. The link can only be used once and expires soon.',
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function getSafeLogoUrl(logoUrl) {
  try {
    const parsedLogoUrl = new URL(logoUrl);
    if (parsedLogoUrl.protocol !== 'https:') throw new Error('Invalid logo URL.');
    return escapeHtml(parsedLogoUrl.href);
  } catch {
    throw new Error('A secure Idilewa logo URL is required.');
  }
}

function createEmail({ title, instruction, contentText, contentHtml, logoUrl }) {
  const safeLogoUrl = getSafeLogoUrl(logoUrl);
  return {
    subject: title,
    text: `${title}\n\n${instruction}\n\n${contentText}\n\nIf you did not request this, ignore this email.\n\nThe Idilewa team`,
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
  <body style="margin:0;padding:32px 14px;background:#f3f6f1;color:#20372b;font:16px/1.6 Arial,Helvetica,sans-serif">
    <main style="max-width:560px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e4ebe2;border-radius:18px">
      <img src="${safeLogoUrl}" width="150" alt="Idilewa" style="display:block;width:150px;max-width:100%;height:auto;margin:0 0 20px" />
      <h1 style="margin:22px 0 12px;color:#173f32;font-size:27px">${escapeHtml(title)}</h1>
      <p style="margin:0 0 22px;color:#526358">${escapeHtml(instruction)}</p>
      ${contentHtml}
      <p style="margin:22px 0 0;color:#718076;font-size:13px">If you did not request this, ignore this email.</p>
      <p style="margin:24px 0 0;color:#718076;font-size:13px">The Idilewa team · Keep your language close.</p>
    </main>
  </body>
</html>`,
  };
}

export function createAuthCodeEmail({ code, purpose, logoUrl = 'https://idilewa.com/assets/idilewa-email-logo.png' }) {
  const copy = purpose === 'child-signin' ? EMAIL_COPY[purpose] : null;
  if (!copy || !OTP_PATTERN.test(code || '')) {
    throw new Error('A valid email code and purpose are required.');
  }

  return createEmail({
    title: copy.subject,
    instruction: copy.instruction,
    contentText: `Your one-time passcode: ${code}\nThis code expires soon and can only be used once.`,
    contentHtml: `<p style="margin:0;padding:18px;text-align:center;background:#eaf6ec;border-radius:12px;color:#173f32;font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p>`,
    logoUrl,
  });
}

export function createAuthRecoveryEmail({ recoveryUrl, logoUrl = 'https://idilewa.com/assets/idilewa-email-logo.png' }) {
  let safeRecoveryUrl;
  let parsedRecoveryUrl;
  try {
    parsedRecoveryUrl = new URL(recoveryUrl);
    if (parsedRecoveryUrl.protocol !== 'https:' || parsedRecoveryUrl.username || parsedRecoveryUrl.password) {
      throw new Error('Invalid recovery URL.');
    }
    safeRecoveryUrl = escapeHtml(parsedRecoveryUrl.href);
  } catch {
    throw new Error('A secure password recovery URL is required.');
  }
  const copy = EMAIL_COPY['password-reset'];
  const button = `<p><a href="${safeRecoveryUrl}" style="display:inline-block;padding:14px 22px;background:#15764a;border-radius:999px;color:#fff;font-weight:bold;text-decoration:none">Reset your password</a></p>`;
  return createEmail({
    title: copy.subject,
    instruction: copy.instruction,
    contentText: `Reset your password: ${parsedRecoveryUrl.href}`,
    contentHtml: `${button}<p style="color:#526358;word-break:break-all">${safeRecoveryUrl}</p>`,
    logoUrl,
  });
}
