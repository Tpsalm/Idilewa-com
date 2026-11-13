import { getCurrentUser, saveProgress } from './supabaseClient.js';

const KEY_PREFIX = 'idilewa_heritage_';
const user = (() => {
  try {
    return getCurrentUser();
  } catch {
    return null;
  }
})();

const keyFor = (id) => KEY_PREFIX + id;

function readLocal(id) {
  try {
    return JSON.parse(localStorage.getItem(keyFor(id)) || '{}');
  } catch {
    return {};
  }
}

async function pushProgress(id, patch) {
  const merged = { ...readLocal(id), ...patch, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(keyFor(id), JSON.stringify(merged));
  } catch {
    /* storage may be unavailable */
  }
  if (user?.id) {
    try {
      await saveProgress({ userId: user.id, lessonType: 'heritage', lessonId: id, meta: merged });
    } catch (error) {
      console.warn('Heritage progress saved on this device only.', error);
    }
  }
  return merged;
}

// The page's own lesson scripts persist to localStorage; mirror those writes into
// the account so reading progress survives across devices.
const nativeSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = (key, value) => {
  const result = nativeSetItem(key, value);
  try {
    if (typeof key === 'string' && (key.startsWith('idilewa_174_') || key === 'idilewa16sample')) {
      const id = key === 'idilewa16sample' ? 'iwa-lewa-journey' : key.slice('idilewa_174_'.length);
      let patch;
      try {
        patch = JSON.parse(value);
      } catch {
        patch = { value };
      }
      void pushProgress(id, patch);
    }
  } catch {
    /* ignore mirroring failures */
  }
  return result;
};

window.idilewaHeritage = { readLocal, pushProgress, isSignedIn: Boolean(user?.id) };

if (!user?.id) {
  const strip = document.querySelector('.heritage-progress-strip');
  if (strip) {
    const note = document.createElement('small');
    note.textContent = 'Sign in to save your reading progress to your account across devices.';
    strip.appendChild(note);
  }
}
