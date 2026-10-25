import { AUTH_RECOVERY_PENDING_KEY, completeAuthCallback } from './supabaseClient.js';

const title = document.getElementById('auth-callback-title');
const message = document.getElementById('auth-callback-message');
const returnLink = document.getElementById('auth-callback-link');

function cleanCallbackUrl() {
  window.history.replaceState(null, '', `${window.location.origin}/auth-callback.html`);
}

function redirectAfterAuth({ recovery, next }) {
  window.sessionStorage.removeItem('idilewa-pending-signup-email');
  if (recovery) {
    window.sessionStorage.setItem(AUTH_RECOVERY_PENDING_KEY, 'true');
    window.location.replace('/login.html#/login?mode=recovery');
    return;
  }
  const route = typeof next === 'string' && /^[a-z][a-z0-9_-]*$/i.test(next)
    && !['login', 'auth-callback'].includes(next)
    ? next
    : 'index';
  window.location.replace(`/index.html#/${encodeURIComponent(route)}`);
}

async function runAuthCallback() {
  try {
    const result = await completeAuthCallback();
    cleanCallbackUrl();
    redirectAfterAuth(result);
  } catch (error) {
    cleanCallbackUrl();
    if (title) title.textContent = 'This verification link could not be used';
    if (message) {
      message.textContent = error instanceof Error
        ? error.message
        : 'The link may have expired. Return to sign in and request a new confirmation or recovery email.';
    }
    if (returnLink) returnLink.hidden = false;
  }
}

void runAuthCallback();
