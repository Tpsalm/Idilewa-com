import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getApiBase, speakWithDeviceVoice } from '../src/plotweaverClient.js';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const stylesSource = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

test('local Vite playback uses Idilewa voice API instead of a missing local function route', () => {
  const previousWindow = globalThis.window;
  globalThis.window = { location: { hostname: 'localhost' } };
  try {
    assert.equal(getApiBase(), 'https://www.idilewa.com');
    globalThis.window.location.hostname = '127.0.0.1';
    assert.equal(getApiBase(), 'https://www.idilewa.com');
    globalThis.window.location.hostname = 'www.idilewa.com';
    assert.equal(getApiBase(), '');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('device speech uses the requested language and resolves when playback ends', async () => {
  const previousWindow = globalThis.window;
  const utterances = [];
  class MockUtterance {
    constructor(text) {
      this.text = text;
    }
  }
  globalThis.window = {
    SpeechSynthesisUtterance: MockUtterance,
    speechSynthesis: {
      cancel() {},
      speak(utterance) {
        utterances.push(utterance);
        queueMicrotask(() => utterance.onend());
      },
    },
  };

  try {
    await speakWithDeviceVoice('Ẹ káàárọ̀', 'yo');
    assert.equal(utterances[0].text, 'Ẹ káàárọ̀');
    assert.equal(utterances[0].lang, 'yo');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('device speech reports playback errors instead of pretending audio played', async () => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    SpeechSynthesisUtterance: class {},
    speechSynthesis: {
      cancel() {},
      speak(utterance) {
        queueMicrotask(() => utterance.onerror({ error: 'voice-unavailable' }));
      },
    },
  };

  try {
    await assert.rejects(
      speakWithDeviceVoice('Ẹ káàárọ̀', 'yo'),
      /Device speech could not play this phrase \(voice-unavailable\)/,
    );
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('all app image sources resolve from the site root without changing the green palette', () => {
  assert.match(appSource, /const imageUrl = .*`\/assets\/\$\{filename\}`/);
  assert.ok(appSource.includes('return output.replace(/(\\bsrc=["\'])\\.\\/assets\\//gi, \'$1/assets/\');'));
  assert.match(stylesSource, /--green: #15764a;/);
  assert.match(stylesSource, /--green-dark: #0c5737;/);
  assert.doesNotMatch(stylesSource, /--green: #a9543e|--clay:|--royal-indigo:|--sahara-gold:|--savannah-green:/);
});
