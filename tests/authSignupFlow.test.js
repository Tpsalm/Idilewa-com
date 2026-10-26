import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const supabaseClientSource = await readFile(new URL('../src/supabaseClient.js', import.meta.url), 'utf8');
const authEmailCodeSource = await readFile(new URL('../src/server/authEmailCode.js', import.meta.url), 'utf8');
const authCallbackSource = await readFile(new URL('../src/authCallback.js', import.meta.url), 'utf8');

test('signup offers adult accounts without guardian consent and retains child approval', () => {
  assert.match(appSource, /data-role="adult"[^>]*role="radio" aria-checked=/);
  assert.match(appSource, /Adult accounts do not require guardian approval/);
  assert.match(appSource, /const accountType = data\.get\('accountType'\) === 'adult' \? 'adult' : 'child';/);
  assert.match(appSource, /accountType === 'child'\s*&&\s*\(!verifiedGuardianSignup/);
  assert.match(appSource, /!signUp \|\| !isChild \|\| verifiedGuardianSignup/);
  assert.match(appSource, /Create Adult Learning Space/);
});

test('signup handles both immediate sessions and email-confirmation-required accounts', async () => {
  assert.match(supabaseClientSource, /emailRedirectTo: getAuthCallbackUrl\(\)/);
  assert.match(supabaseClientSource, /emailConfirmationRequired: true/);
  assert.match(supabaseClientSource, /emailConfirmationRequired: false/);
  assert.match(supabaseClientSource, /client\.auth\.resend\(\{\s*type: 'signup'/);
  assert.match(appSource, /if \(signup\.emailConfirmationRequired\) \{[\s\S]*?pendingSignupEmail = email;[\s\S]*?navigate\('login', \{ mode: 'signin' \}, true\);/);
  assert.doesNotMatch(supabaseClientSource, /Email confirmation must be disabled in the hosted Supabase auth settings/);
  assert.doesNotMatch(appSource, /await signOutAccount\(\{ notify: false \}\);\s*signupEmailForSignin/);
});

test('homepage uses only the supplied family learning photo as the hero artwork', async () => {
  assert.match(appSource, /src="\/assets\/home-family-learning\.jpg"/);
  assert.match(appSource, /src="\/assets\/\$\{language\.image\}"/);
  assert.match(appSource, /src="\/assets\/story-grandmother\.jpg"/);
  assert.doesNotMatch(appSource, /home-hero-illustration\.svg|home-hero-art-label/);
  assert.doesNotMatch(appSource, /idilewa-family-view\.png/);
  const photo = await readFile(new URL('../public/assets/home-family-learning.jpg', import.meta.url));
  assert.deepEqual([...photo.subarray(0, 2)], [0xff, 0xd8]);
});

test('adult sign-in is password-based and child sign-in uses a parent-issued passcode', () => {
  assert.doesNotMatch(appSource, /request-signin-otp|resend-signup-otp|signup-otp/);
  assert.match(appSource, /data-action="request-child-signin-code"/);
  assert.match(appSource, /requestSigninOtp\(email, 'child-signin'\)/);
  assert.match(appSource, /expectedRole: 'child'/);
  assert.match(appSource, /signInAccount\(\{ email, password, expectedRole: 'adult' \}\)/);
  assert.match(supabaseClientSource, /expectedRole === 'adult' && \['parent', 'educator'\]\.includes\(userRecord\.role\)/);
  assert.match(supabaseClientSource, /if \(expectedRole && userRecord\.role !== expectedRole\s*&& !\(expectedRole === 'adult' && \['parent', 'educator'\]\.includes\(userRecord\.role\)\)\)/);
  assert.match(supabaseClientSource, /Email codes are only available for parent-issued child sign-in/);
  assert.match(supabaseClientSource, /purpose: 'password-reset'/);
  assert.doesNotMatch(supabaseClientSource, /resetPasswordForEmail\(/);
  assert.match(authEmailCodeSource, /admin\.auth\.admin\.generateLink\(\{[\s\S]*?type: 'recovery'/);
  assert.match(authEmailCodeSource, /createAuthRecoveryEmail/);
});

test('direct sign-in and signup routes default to the adult email-and-password flow', () => {
  assert.match(appSource, /authRole: stored\.authRole === 'child' \? 'child' : 'adult'/);
  assert.match(appSource, /if \(defaultPage === 'login' && !defaultAuthEntryInitialized\) \{\s*state\.loginMode = 'signin';\s*state\.authRole = 'adult';/);
  assert.match(appSource, /if \(page === 'login' && \['signin', 'signup', 'recovery'\]\.includes\(params\.mode\)\) \{\s*state\.loginMode = params\.mode;\s*if \(params\.mode === 'signup' \|\| !\['adult', 'child'\]\.includes\(state\.authRole\)\) \{\s*state\.authRole = 'adult';/);
});

test('auth errors display inline and repeated form submissions are disabled', () => {
  assert.match(appSource, /id="authInlineError" class="auth-inline-error" role="alert"/);
  assert.match(appSource, /submitButton\.disabled = true;[\s\S]*?Signing in…/);
  assert.match(supabaseClientSource, /invalid login credentials\|invalid credentials\|wrong password\|incorrect password/);
});

test('confirmation callback and restored sessions are part of the auth flow', () => {
  assert.match(supabaseClientSource, /exchangeCodeForSession/);
  assert.match(supabaseClientSource, /verifyOtp\(\{\s*token_hash:/);
  assert.match(supabaseClientSource, /setSession\(\{/);
  assert.match(supabaseClientSource, /export async function restoreAuthSession/);
  assert.match(supabaseClientSource, /export function subscribeToAuthChanges/);
  assert.match(appSource, /AUTH_RECOVERY_PENDING_KEY/);
  assert.match(appSource, /void restoreAuthSession\(\)\.then/);
  assert.match(supabaseClientSource, /recovery: callbackType === 'recovery' \|\| query\.get\('next'\) === 'login'/);
  assert.match(authCallbackSource, /window\.sessionStorage\.removeItem\('idilewa-pending-signup-email'\)/);
});

test('sign-in and sign-out activity emails are sent without blocking local logout', () => {
  assert.match(appSource, /await sendAuthActivityEmail\('sign-in'\)/);
  assert.match(supabaseClientSource, /body: JSON\.stringify\(\{ event: 'sign-out' \}\)/);
  assert.match(appSource, /await requestPasswordReset\(email\)/);
  assert.match(appSource, /await sendAuthActivityEmail\('sign-in'\)/);
  assert.match(supabaseClientSource, /supabase\.auth\.signOut\(\{ scope: 'local' \}\)/);
  assert.match(supabaseClientSource, /return \{\s*signedOut: true,\s*activityEmailError:/);
  assert.doesNotMatch(supabaseClientSource, /if \(activityEmailError\) \{\s*throw new Error\('You are signed out/);
});

test('sign-out clears pending verification and recovery steps before returning to sign-in', () => {
  assert.match(appSource, /function clearPendingAuthFlow\(\) \{[\s\S]*?pendingSignupEmail = '';[\s\S]*?pendingSignin = null;[\s\S]*?passwordResetVerified = false;[\s\S]*?idilewa-pending-signup-email[\s\S]*?idilewa-pending-signin-otp[\s\S]*?idilewa-password-reset-verified/);
  assert.match(appSource, /case 'account-sign-out':\s*case 'profile-sign-out':\s*const authStorageError = clearPendingAuthFlow\(\);\s*void signOutAccount\(\)\.then/);
  assert.match(appSource, /catch\(\(error\) => \{\s*state\.loginMode = 'signin';\s*state\.authRole = 'adult';\s*navigate\('login', \{ mode: 'signin' \}, true\);/);
});

test('sign-out clears the current device session without relying on global logout', () => {
  assert.match(supabaseClientSource, /supabase\.auth\.signOut\(\{ scope: 'local' \}\)/);
});
