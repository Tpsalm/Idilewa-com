import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAdjacentVoicePracticeLesson,
  getVoicePracticeLesson,
  VOICE_PRACTICE_COURSES,
  VOICE_PRACTICE_TOOL_ORDER,
} from '../src/voicePracticeLessons.js';

test('each voice practice tool has exactly 50 ordered, phrasebook-backed lessons', () => {
  for (const tool of VOICE_PRACTICE_TOOL_ORDER) {
    const lessons = VOICE_PRACTICE_COURSES[tool];
    assert.equal(lessons.length, 50, `${tool} lesson count`);
    assert.deepEqual(lessons.map(({ id }) => id), Array.from({ length: 50 }, (_, index) => index + 1));
    assert.ok(lessons.every(({ sourceText, practiceText, objective }) => sourceText && practiceText && objective));
    assert.equal(new Set(lessons.map(({ phraseKey }) => phraseKey)).size, 50, `${tool} phrase uniqueness`);
  }
});

test('lesson lookup safely selects the requested lesson and bounds route values', () => {
  assert.equal(getVoicePracticeLesson('voice-translation', '12')?.id, 12);
  assert.equal(getVoicePracticeLesson('voice-text-to-speech', 0)?.id, 1);
  assert.equal(getVoicePracticeLesson('voice-speech-to-text', 51)?.id, 50);
  assert.equal(getVoicePracticeLesson('voice-cloning', 1), null);
});

test('previous and next lesson navigation continues across the three courses', () => {
  assert.equal(getAdjacentVoicePracticeLesson('voice-translation', 1, -1), null);
  assert.deepEqual(
    getAdjacentVoicePracticeLesson('voice-translation', 50, 1),
    { tool: 'voice-text-to-speech', lesson: VOICE_PRACTICE_COURSES['voice-text-to-speech'][0] },
  );
  assert.deepEqual(
    getAdjacentVoicePracticeLesson('voice-speech-to-text', 1, -1),
    { tool: 'voice-text-to-speech', lesson: VOICE_PRACTICE_COURSES['voice-text-to-speech'][49] },
  );
  assert.equal(getAdjacentVoicePracticeLesson('voice-speech-to-text', 50, 1), null);
});
