const OTP_PATTERN = /^\d{6,8}$/;

const EMAIL_COPY = {
  'child-signin': {
    subject: 'Your child’s Idilewa sign-in passcode',
    title: 'A child sign-in passcode',
    instruction: 'Share this one-time passcode with your child so they can sign in to Idilewa. It is valid only for this sign-in and expires soon.',
  },
  recovery: {
    subject: 'Reset your Idilewa password',
    title: 'Reset your password',
    instruction: 'Enter this one-time code on the Idilewa password recovery page to choose a new password.',
  },
};

export function createAuthCodeEmail({ code, purpose, logoUrl = 'https://idilewa.com/assets/idilewa-email-logo.png' }) {
  const copy = EMAIL_COPY[purpose];
  let safeLogoUrl;
  try {
    const parsedLogoUrl = new URL(logoUrl);
    if (parsedLogoUrl.protocol !== 'https:') throw new Error('Invalid logo URL.');
    safeLogoUrl = parsedLogoUrl.href.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  } catch {
    throw new Error('A secure Idilewa logo URL is required.');
  }
  if (!copy || !OTP_PATTERN.test(code || '')) {
    throw new Error('A valid email code and purpose are required.');
  }

  return {
    subject: copy.subject,
    text: `${copy.title}\n\n${copy.instruction}\n\nYour one-time passcode: ${code}\n\nThis code expires soon and can only be used once. Never share it with anyone other than the child you are helping sign in. If you did not request it, ignore this email.\n\nThe Idilewa team`,
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${copy.title}</title></head>
  <body style="margin:0;padding:32px 14px;background:#f3f6f1;color:#20372b;font:16px/1.6 Arial,Helvetica,sans-serif">
    <main style="max-width:560px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e4ebe2;border-radius:18px">
      <img src="${safeLogoUrl}" width="150" alt="Idilewa" style="display:block;width:150px;max-width:100%;height:auto;margin:0 0 20px" />
      <h1 style="margin:22px 0 12px;color:#173f32;font-size:27px">${copy.title}</h1>
      <p style="margin:0 0 22px;color:#526358">${copy.instruction}</p>
      <p style="margin:0;padding:18px;text-align:center;background:#eaf6ec;border-radius:12px;color:#173f32;font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p>
      <p style="margin:22px 0 0;color:#718076;font-size:13px">This code expires soon and can only be used once. Share it only with the child you are helping sign in. If you did not request it, ignore this email.</p>
      <p style="margin:24px 0 0;color:#718076;font-size:13px">The Idilewa team · Keep your language close.</p>
    </main>
  </body>
</html>`,
  };
}
