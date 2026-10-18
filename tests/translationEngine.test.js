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

test('translateText returns curated religious terms with Yoruba orthography and plain-letter forms', () => {
  assert.equal(translateText('God', 'yo').translated, 'Ọlọ́run');
  assert.equal(translateText('God', 'yo').transliteration, 'Olorun');
  assert.equal(translateText('Lord', 'yo').translated, 'Olúwa');
  assert.equal(translateText('Master', 'yo').translated, 'Ọ̀gá');
  assert.equal(translateText('Savior', 'yo').translated, 'Olùgbàlà');
  assert.equal(translateText('Saviour', 'yo').transliteration, 'Olugbala');
});

test('translateText uses the curated Yoruba sentence and normalizes punctuation and case', () => {
  const result = translateText('God is good to africans', 'yo');
  assert.equal(result.translated, 'Ọlọ́run dára sí àwọn ará Áfríkà.');
  assert.equal(result.transliteration, 'Olorun dara si awon ara Afrika.');
  assert.equal(result.exact, true);
  assert.equal(translateText(' GOD IS GOOD TO AFRICANS! ', 'yo').translated, result.translated);
});

test('translateText does not invent word-by-word sentence translations', () => {
  const result = translateText('I eat food', 'sw');
  assert.equal(result.translated, '');
  assert.equal(result.notFound, true);
});

test('translateText handles empty input and missing target-language entries', () => {
  assert.equal(translateText('', 'yo').translated, '');
  assert.equal(translateText('God is good to Africans', 'ig').notFound, true);
});