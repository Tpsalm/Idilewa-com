import assert from 'node:assert/strict';
import test from 'node:test';
import { isSignupPasswordValid } from '../src/supabaseClient.js';

test('signup password policy enforces length and character variety', () => {
  assert.equal(isSignupPasswordValid('River!Drum7Leaf'), true);
  assert.equal(isSignupPasswordValid('short1!A'), false);
  assert.equal(isSignupPasswordValid('lowercaseword!7'), false);
  assert.equal(isSignupPasswordValid('UppercaseWord!'), false);
  assert.equal(isSignupPasswordValid('River Drum 7 Leaf'), false);
  assert.equal(isSignupPasswordValid(`River!Drum7Leaf${'x'.repeat(114)}`), false);
});
