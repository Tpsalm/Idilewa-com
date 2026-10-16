import assert from 'node:assert/strict';
import test from 'node:test';
import { translateText } from '../src/translationEngine.js';

test('translateText returns phrasebook greetings for all supported languages', () => {
  assert.equal(translateText('hello', 'yo').translated, 'Báwo ni?');
  assert.equal(translateText('hello', 'ig').translated, 'Kedu?');
  assert.equal(translateText('hello', 'ha').translated, 'Sannu');
  assert.equal(translateText('hello', 'pcm').translated, 'How you dey?');
  assert.equal(translateText('hello', 'sw').translated, 'Habari');
});

test('translateText applies offline word mappings and handles empty input', () => {
  assert.equal(translateText('I eat food', 'sw').translated, 'mimi kula food');
  assert.equal(translateText('', 'yo').translated, '');
});