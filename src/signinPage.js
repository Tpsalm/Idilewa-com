import {
  isSupabaseConfigured,
  signIn,
  signUp,
  sendWelcomeEmail,
  requestPasswordReset,
  normalizeAuthError,
  getCurrentUser,
} from '/src/supabaseClient.js';

const $ = (id) => document.getElementById(id);
const state = { type: 'adult', tab: 'signin', busy: false, live: isSupabaseConfigured };
const APP_HOME = '/index.html#/index';

function message(text, isError = false) {
  const el = $('status');
  el.textContent = text;
  el.classList.remove('hidden');
  el.classList.toggle('error', Boolean(isError));
}

function busy(on) {
  state.busy = on;
  $('submit').disabled = on;
  $('submit').innerHTML = on
    ? '<span class="spinner"></span> Please wait…'
    : state.tab === 'signup'
      ? 'Create Family Account →'
      : state.type === 'child'
        ? 'Enter Child Learning Space →'
        : 'Sign In to Learning Space →';
}

function render() {
  const isChild = state.type === 'child';
  const isSignup = state.tab === 'signup';
  for (const [id, on] of [['signin', !isSignup], ['signup', isSignup], ['child', isChild], ['adult', !isChild]]) {
    $(id).classList.toggle('active', on);
    $(id).setAttribute(id === 'signin' || id === 'signup' ? 'aria-selected' : 'aria-pressed', String(on));
  }
  $('nameWrap').classList.toggle('hidden', !isSignup);
  $('childWrap').classList.toggle('hidden', !isChild);
  $('childHelp').classList.toggle('hidden', !isChild);
  $('forgot').classList.toggle('hidden', isSignup || isChild);
  $('options').classList.toggle('hidden', isSignup);
  $('emailLabel').textContent = isChild ? 'Parent / guardian email' : 'Email address';
  $('passwordLabel').textContent = isChild ? 'Child passcode' : isSignup ? 'Create password' : 'Password';
  $('password').placeholder = isChild ? 'Enter child passcode' : isSignup ? 'Create a strong password' : 'Enter your password';
  $('password').autocomplete = isSignup ? 'new-password' : 'current-password';
  $('title').textContent = isSignup ? 'Join Ìdíléwa today' : 'Welcome back to Ìdíléwa';
  $('subtitle').textContent = isSignup
    ? 'Create your family account to begin learning.'
    : 'Sign in to continue your learning journey.';
  $('mode').textContent = state.live ? 'Live authentication' : 'Service unavailable';
  $('notice').textContent = state.live
    ? '🔒 Live authentication is connected to the Ìdíléwa account service. Adult and family accounts sign in with email and password.'
    : 'The account service is not configured on this deployment yet. Please try again later.';
  $('status').classList.add('hidden');
}

$('signin').onclick = () => { state.tab = 'signin'; render(); };
$('signup').onclick = () => { state.tab = 'signup'; state.type = 'adult'; render(); };
$('adult').onclick = () => { state.type = 'adult'; render(); };
$('child').onclick = () => { state.type = 'child'; state.tab = 'signin'; render(); };

$('eye').onclick = () => {
  const el = $('password');
  const show = el.type === 'password';
  el.type = show ? 'text' : 'password';
  $('eye').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  $('eye').setAttribute('aria-pressed', String(show));
};

$('language').onchange = () => {
  if ($('language').value !== 'en') {
    message('Interface translation for this language is coming soon. English remains active.');
    $('language').value = 'en';
  }
};

function validate() {
  const email = $('email').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  if (state.tab === 'signup' && !$('name').value.trim()) throw new Error('Enter your full name.');
  if (state.tab === 'signup' && $('password').value.length < 12) {
    throw new Error('Use 12–128 characters with uppercase and lowercase letters, a number, and a symbol.');
  }
  if (state.tab === 'signin' && !$('password').value) throw new Error('Enter your password.');
  return email;
}

$('form').onsubmit = async (event) => {
  event.preventDefault();
  if (state.busy) return;
  try {
    const email = validate();
    if (state.type === 'child') {
      throw new Error('Child sign-in uses a one-time passcode sent to the approved parent or guardian. Please use the main app sign-in.');
    }
    if (!state.live) {
      throw new Error('Account authentication is not configured on this deployment. Please try again later.');
    }
    busy(true);
    if (state.tab === 'signup') {
      const result = await signUp({
        email,
        password: $('password').value,
        name: $('name').value.trim(),
        role: 'adult',
      });
      void sendWelcomeEmail(result.user.id).catch(() => {});
      if (result.emailConfirmationRequired) {
        message('Account created. Check your email for a confirmation link, then sign in.');
        state.tab = 'signin';
        busy(false);
        render();
        return;
      }
      window.location.assign(APP_HOME);
      return;
    }
    await signIn({ email, password: $('password').value, expectedRole: 'adult' });
    window.location.assign(APP_HOME);
  } catch (error) {
    message(normalizeAuthError(error, state.tab === 'signup' ? 'sign-up' : 'sign-in'), true);
  } finally {
    busy(false);
  }
};


$('forgot').onclick = async () => {
  const email = $('email').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message('Enter your email address before requesting a reset.', true);
    return;
  }
  try {
    if (!state.live) throw new Error('Password recovery is not configured on this deployment yet.');
    await requestPasswordReset(email);
    message('If this address is registered, password reset instructions will be sent.');
  } catch (error) {
    message(normalizeAuthError(error, 'password-reset'), true);
  }
};

$('privacy').onclick = () => window.location.assign('./index.html#/privacy');
$('help').onclick = () => window.location.assign('./index.html#/contact');

render();
const existing = getCurrentUser();
if (existing?.email) $('email').value = existing.email;
