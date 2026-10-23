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

test('successful signup returns to sign-in rather than navigating into the app', async () => {
  assert.match(appSource, /await signOutAccount\(\{ notify: false \}\);\s*signupEmailForSignin = email\.toLowerCase\(\);[\s\S]*?navigate\('login', \{ mode: 'signin' \}, true\);/);
  assert.match(appSource, /Account created\. Sign in with your email and password\./);
  assert.match(supabaseClientSource, /if \(!data\.session\) \{\s*throw new Error\('The account was created, but Supabase did not start a session/);
  assert.match(await readFile(new URL('../supabase/config.toml', import.meta.url), 'utf8'), /\[auth\.email\]\s*enable_confirmations = false/);
});

test('homepage uses only the supplied family learning photo as the hero artwork', async () => {
  assert.match(appSource, /home-family-learning\.jpg/);
  assert.doesNotMatch(appSource, /home-hero-illustration\.svg|home-hero-art-label/);
  assert.doesNotMatch(appSource, /idilewa-family-view\.png/);
  const photo = await readFile(new URL('../public/assets/home-family-learning.jpg', import.meta.url));
  assert.deepEqual([...photo.subarray(0, 2)], [0xff, 0xd8]);
});

test('adult sign-in is password-based and child sign-in uses a parent-issued passcode', () => {
  assert.doesNotMatch(appSource, /request-signin-otp|resend-signup-otp|signup-otp/);
  assert.match(appSource, /data-action="request-child-signin-code"/);
  assert.match(appSource, /requestSigninOtp\(email, 'child-signin'\)/);
  assert.match(appSource, /expectedRole: purpose === 'child-signin' \? 'child'/);
  assert.match(appSource, /signInAccount\(\{ email, password, expectedRole: 'adult' \}\)/);
  assert.match(supabaseClientSource, /expectedRole === 'adult' && \['parent', 'educator'\]\.includes\(userRecord\.role\)/);
  assert.match(supabaseClientSource, /if \(expectedRole && userRecord\.role !== expectedRole\s*&& !\(expectedRole === 'adult' && \['parent', 'educator'\]\.includes\(userRecord\.role\)\)\)/);
  assert.match(supabaseClientSource, /Email codes are only available for child sign-in and password recovery/);
  assert.match(supabaseClientSource, /requestAuthEmailCode\(email, purpose === 'password-reset' \? 'recovery' : purpose\)/);
});

test('invalid password sign-in displays guidance inline instead of an overlapping toast', () => {
  assert.match(appSource, /id="authInlineError" class="auth-inline-error" role="alert"/);
  assert.match(appSource, /We couldn’t sign you in with those details\.[\s\S]*?inlineError\.hidden = false/);
});

test('sign-in and sign-out activity emails are sent without blocking local logout', () => {
  assert.match(appSource, /await sendAuthActivityEmail\('sign-in'\)/);
  assert.match(supabaseClientSource, /body: JSON\.stringify\(\{ event: 'sign-out' \}\)/);
  assert.match(appSource, /requestSigninOtp\(email, 'password-reset'\)/);
  assert.match(supabaseClientSource, /supabase\.auth\.signOut\(\{ scope: 'local' \}\)/);
});

test('sign-out clears pending verification and recovery steps before returning to sign-in', () => {
  assert.match(appSource, /function clearPendingAuthFlow\(\) \{[\s\S]*?pendingSignupEmail = '';[\s\S]*?pendingSignin = null;[\s\S]*?passwordResetVerified = false;[\s\S]*?idilewa-pending-signup-email[\s\S]*?idilewa-pending-signin-otp[\s\S]*?idilewa-password-reset-verified/);
  assert.match(appSource, /case 'account-sign-out':\s*case 'profile-sign-out':\s*const authStorageError = clearPendingAuthFlow\(\);\s*void signOutAccount\(\)\.then/);
  assert.match(appSource, /catch\(\(error\) => \{\s*state\.loginMode = 'signin';\s*state\.authRole = 'adult';\s*navigate\('login', \{ mode: 'signin' \}, true\);/);
});

test('sign-out clears the current device session without relying on global logout', () => {
  assert.match(supabaseClientSource, /supabase\.auth\.signOut\(\{ scope: 'local' \}\)/);
});
