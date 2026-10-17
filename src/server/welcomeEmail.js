function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function createWelcomeEmail({ name, loginUrl }) {
  const displayName = String(name).replace(/\s+/g, ' ').trim().slice(0, 80);
  const safeName = escapeHtml(displayName);
  const safeLoginUrl = escapeHtml(loginUrl);
  return {
    subject: 'Welcome to Idilewa — keep your language close',
    text: `Ẹ káàbọ̀, ${displayName}!\n\nWelcome to Idilewa. Your learning space is ready for you to explore Yoruba, African stories, culture and coding at your own pace.\n\nSign in whenever you are ready: ${loginUrl}\n\nIf you did not create this account, you can safely ignore this email.\n\nWith warmth,\nThe Idilewa team`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>Welcome to Idilewa</title>
  </head>
  <body style="margin:0;background:#f3f6f1;color:#20372b;font-family:Arial,Helvetica,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">Your Idilewa learning space is ready. Explore languages, stories and coding at your own pace.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6f1;padding:36px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border:1px solid #e4ebe2;border-radius:20px;overflow:hidden">
          <tr><td style="padding:30px 36px;background:#173f32;color:#fff">
            <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c7ead2">idílẹ́wà</div>
            <div style="margin-top:10px;font-size:13px;color:#dce9df">LANGUAGE · CULTURE · CURIOSITY</div>
          </td></tr>
          <tr><td style="padding:38px 36px 18px">
            <div style="font-size:14px;font-weight:700;color:#28734d">Ẹ KÁÀBỌ̀ — YOU’RE HOME</div>
            <h1 style="margin:12px 0 16px;font-size:30px;line-height:1.2;color:#173f32">Welcome, ${safeName}.</h1>
            <p style="margin:0;font-size:16px;line-height:1.7;color:#526358">Your Idilewa learning space is ready. Bring your curiosity and explore Yoruba, African languages, stories, culture and creative coding at your own pace.</p>
          </td></tr>
          <tr><td style="padding:14px 36px 28px">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding:15px 16px;background:#f5f8f3;border-radius:12px">
                <div style="font-size:15px;font-weight:700;color:#20372b">A little of everything, made for you</div>
                <div style="padding-top:7px;font-size:14px;line-height:1.65;color:#526358">Practice a language · Discover a story · Make something with code</div>
              </td></tr>
            </table>
            <div style="padding-top:26px">
              <a href="${safeLoginUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#28734d;color:#fff;text-decoration:none;font-size:15px;font-weight:700">Open your learning space</a>
            </div>
            <p style="margin:26px 0 0;font-size:13px;line-height:1.65;color:#718076">If you did not create this account, you can safely ignore this email. Your sign-in details are never included in email.</p>
          </td></tr>
          <tr><td style="padding:20px 36px;background:#f8faf7;border-top:1px solid #e8eee6;font-size:13px;line-height:1.6;color:#718076">
            With warmth,<br><strong style="color:#365443">The Idilewa team</strong>
            <div style="padding-top:10px">Keep your language close.</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
  };
}
