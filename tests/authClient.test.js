import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAuthCallbackUrl,
  isSignupPasswordValid,
  normalizeAuthError,
} from '../src/supabaseClient.js';

test('auth errors are normalized for common Supabase failures', () => {
  assert.match(normalizeAuthError({ message: 'Invalid login credentials' }), /couldn’t sign you in/i);
  assert.match(normalizeAuthError({ message: 'Email not confirmed' }), /confirm your email/i);
  assert.match(normalizeAuthError({ status: 429 }), /too many attempts/i);
  assert.match(normalizeAuthError({ message: 'Failed to fetch' }), /connection/i);
  assert.equal(normalizeAuthError({ message: 'Unexpected provider error' }), 'Unexpected provider error');
});

test('auth callback URLs stay on the supplied origin and accept only route identifiers', () => {
  const callback = new URL(getAuthCallbackUrl('voice-practice', 'https://www.idilewa.com'));
  assert.equal(callback.origin, 'https://www.idilewa.com');
  assert.equal(callback.pathname, '/auth-callback.html');
  assert.equal(callback.searchParams.get('next'), 'voice-practice');

  const rejectedRoute = new URL(getAuthCallbackUrl('//attacker.example', 'https://www.idilewa.com'));
  assert.equal(rejectedRoute.origin, 'https://www.idilewa.com');
  assert.equal(rejectedRoute.searchParams.get('next'), 'index');

  const recoveryRoute = new URL(getAuthCallbackUrl('login', 'https://www.idilewa.com'));
  assert.equal(recoveryRoute.searchParams.get('next'), 'login');
});

test('registration password policy rejects weak values and accepts a strong password', () => {
  assert.equal(isSignupPasswordValid('short'), false);
  assert.equal(isSignupPasswordValid('river drum leaf 7'), false);
  assert.equal(isSignupPasswordValid('River!Drum7Leaf'), true);
  assert.equal(isSignupPasswordValid(`${'A'.repeat(127)}!a1`), false);
});
