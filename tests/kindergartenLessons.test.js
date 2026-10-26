import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getKindergartenLessons } from '../src/kindergartenLessons.js';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const languages = ['yoruba', 'igbo', 'hausa', 'swahili'];

test('each supported language has exactly 50 ordered Kindergarten lessons', () => {
  for (const language of languages) {
    const lessons = getKindergartenLessons(language);
    assert.equal(lessons.length, 50, `${language} should have 50 lessons`);
    assert.deepEqual(lessons.map(({ id }) => id), Array.from({ length: 50 }, (_, index) => index + 1));
    assert.ok(lessons.every(({ title, phrase, translation, objective }) =>
      title && phrase && translation && objective
    ));
  }
});

test('each Kindergarten course covers foundational sounds, vocabulary, synonyms, and antonyms', () => {
  for (const language of languages) {
    const lessons = getKindergartenLessons(language);
    const categories = new Set(lessons.map(({ category }) => category));
    assert.ok(categories.has('Alphabet and writing'), `${language} should teach its alphabet`);
    assert.ok(categories.has('Vowel sounds'), `${language} should teach vowel sounds`);
    assert.ok(categories.has('Consonant sounds'), `${language} should teach consonant sounds`);
    assert.ok(categories.has('First words'), `${language} should teach first words`);
    assert.equal(lessons.filter(({ category }) => category === 'Words with similar meanings').length, 2);
    assert.equal(lessons.filter(({ category }) => category === 'Opposite meanings').length, 3);
  }
});

test('the Kindergarten grade uses its 50-lesson course for lesson cards and practice', () => {
  assert.match(appSource, /gradePath\?\.id === 'kindergarten'\s*\?\s*getKindergartenLessons\(selectedLanguage\)/);
  assert.match(appSource, /const practiceLessons = gradePath && gradePath\.level === lessonLevel \? gradeLessons : lessons/);
  assert.match(appSource, /50 foundational lessons/);
  assert.match(appSource, /data-lesson="\$\{lesson\.id\}"/);
  assert.match(appSource, /Learning goal/);
  assert.match(appSource, /data-phrase="\$\{esc\(activeLesson\.phrase\)\}"/);
  assert.match(appSource, /const phrase = el\.dataset\.phrase \|\| activeLesson\?\.phrase/);
  assert.match(appSource, /renderVoicePracticeLessonNavigation\(selectedLanguage, lessonLevel, gradePath, practiceLessons, activeLesson\)/);
});

test('the homepage hero is smaller and both headline lines retain the existing green', () => {
  assert.match(styles, /\.landing-hero-copy h1 \{\s*margin: 16px 0 0;\s*color: #087c48;[\s\S]*?font-size: clamp\(36px, 4\.4vw, 52px\)/);
  assert.match(styles, /\.landing-hero-copy h1 span \{ color: inherit; \}/);
  assert.match(styles, /\.landing-hero-copy h1 \{\s*margin-top: 12px;\s*font-size: 25px;\s*line-height: 30px;/);
});
