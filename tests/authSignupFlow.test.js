import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const supabaseClientSource = await readFile(new URL('../src/supabaseClient.js', import.meta.url), 'utf8');

test('signup offers adult accounts without guardian consent and retains child approval', () => {
  assert.match(appSource, /data-role="adult"[^>]*role="radio" aria-checked=/);
  assert.match(appSource, /Adult accounts can be created directly and do not require parent or guardian consent/);
  assert.match(appSource, /const accountType = data\.get\('accountType'\) === 'adult' \? 'adult' : 'child';/);
  assert.match(appSource, /accountType === 'child'\s*&&\s*\(!verifiedGuardianSignup/);
  assert.match(appSource, /!signUp \|\| !isChild \|\| verifiedGuardianSignup/);
  assert.match(appSource, /Create Adult Learning Space/);
});

test('successful signup returns to sign-in rather than navigating into the app', () => {
  assert.match(appSource, /await signOutAccount\(\);\s*signupEmailForSignin = email\.toLowerCase\(\);[\s\S]*?navigate\('login', \{ mode: 'signin' \}, true\);/);
  assert.match(appSource, /await verifySignupOtp\(\{ email: pendingSignupEmail, token \}\);[\s\S]*?navigate\('login', \{ mode: 'signin' \}, true\);/);
  assert.match(appSource, /Your account is ready; sign in with your email and password\./);
});

test('sign-in page offers email-code login and recovery', () => {
  assert.match(appSource, /data-action="request-signin-otp">Email me a sign-in code instead/);
  assert.match(appSource, /requestSigninOtp\(email, 'password-reset'\)/);
  assert.match(supabaseClientSource, /purpose === 'password-reset' \? 'recovery' : 'magiclink'/);
});
