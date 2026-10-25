import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const templateNames = ['confirmation', 'magic_link', 'recovery', 'email_change'];

test('authentication templates are Idilewa branded and retain their required Supabase variables', async () => {
  for (const name of templateNames) {
    const template = await readFile(new URL(`../supabase/templates/${name}.html`, import.meta.url), 'utf8');
    assert.match(template, /idílẹ́wà/);
    assert.match(template, /<!doctype html>/i);
    if (name !== 'confirmation') {
      assert.match(template, /{{ \.Token }}/);
    }
    if (name !== 'confirmation') {
      assert.match(template, /{{ \.ConfirmationURL }}/);
    }
  }
});

test('signup confirmation uses a link and the app handles optional email confirmation', async () => {
  const template = await readFile(new URL('../supabase/templates/confirmation.html', import.meta.url), 'utf8');
  const config = await readFile(new URL('../supabase/config.toml', import.meta.url), 'utf8');
  const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(config, /^\[auth\.email\]\s*[\s\S]*?^enable_confirmations = false$/m);
  assert.match(config, /https:\/\/www\.idilewa\.com\/auth-callback\.html/);
  assert.doesNotMatch(app, /signup-otp|verifySignupOtp|resendSignupOtp/);
  assert.doesNotMatch(template, /YOUR CONFIRMATION CODE/);
  assert.match(template, /{{ \.ConfirmationURL }}/);
  assert.match(template, /Confirm your email/);
  assert.match(template, /https:\/\/www\.idilewa\.com\/assets\/idilewa-email-logo\.png\?v=2/);
  assert.match(template, /alt="idílẹ́wà — Language · culture · future"/);
  assert.doesNotMatch(template, /No email confirmation code is needed/);
  assert.doesNotMatch(template, /LANGUAGE · CULTURE · CURIOSITY|>È<\/td>/);
});

test('email logo is a real PNG that can be served from public assets', async () => {
  const logo = await readFile(new URL('../public/assets/idilewa-email-logo.png', import.meta.url));
  assert.deepEqual([...logo.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(logo.readUInt32BE(16), 762);
  assert.equal(logo.readUInt32BE(20), 192);
});

test('Supabase project config deploys all four branded authentication templates', async () => {
  const config = await readFile(new URL('../supabase/config.toml', import.meta.url), 'utf8');
  assert.match(config, /^\[auth\.email\]\s*[\s\S]*?^enable_confirmations = false$/m);
  for (const name of templateNames) {
    assert.match(config, new RegExp(`\\[auth\\.email\\.template\\.${name}\\]`));
    assert.match(config, new RegExp(`content_path = \"\\./supabase/templates/${name}\\.html\"`));
  }
});
