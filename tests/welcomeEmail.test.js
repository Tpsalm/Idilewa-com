import assert from 'node:assert/strict';
import test from 'node:test';
import welcomeHandler from '../api/auth/welcome.js';
import { createWelcomeEmail } from '../src/server/welcomeEmail.js';

function createResponse() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('welcome endpoint rejects unsupported methods and malformed account ids', async () => {
  const methodResponse = createResponse();
  await welcomeHandler({ method: 'GET', headers: {} }, methodResponse);
  assert.equal(methodResponse.statusCode, 405);
  assert.equal(methodResponse.headers.Allow, 'POST');

  const bodyResponse = createResponse();
  await welcomeHandler({ method: 'POST', headers: {}, body: { userId: 'not-a-uuid' } }, bodyResponse);
  assert.equal(bodyResponse.statusCode, 400);
});

test('welcome email includes a clear sign-in action and matching plain text', () => {
  const email = createWelcomeEmail({
    name: 'Ayo',
    loginUrl: 'https://www.idlewa.com/login',
  });

  assert.match(email.subject, /Welcome to Idilewa/);
  assert.match(email.html, /Welcome, Ayo\./);
  assert.match(email.html, /href="https:\/\/www\.idlewa\.com\/login"/);
  assert.match(email.text, /https:\/\/www\.idlewa\.com\/login/);
  assert.match(email.html, /<!doctype html>/i);
});

test('welcome email escapes user-controlled name and URL values', () => {
  const email = createWelcomeEmail({
    name: '<img src=x onerror=alert(1)>',
    loginUrl: 'https://www.idlewa.com/login?a=1&b="2"',
  });

  assert.doesNotMatch(email.html, /<img src=x/);
  assert.match(email.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(email.html, /&amp;b=&quot;2&quot;/);
});
