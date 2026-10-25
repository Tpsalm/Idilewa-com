import { DICTIONARY } from './translationEngine.js';

const PHRASE_KEYS = [
  'hi',
  'hello',
  'good morning',
  'good morning, how are you',
  'good afternoon',
  'good evening',
  'good night',
  'how are you',
  'how are you doing',
  'i am fine',
  'thank you',
  'thank you very much',
  'welcome',
  'please',
  'sorry',
  'yes',
  'no',
  'excuse me',
  'goodbye',
  'see you later',
  'congratulations',
  'what is your name',
  'my name is',
  'family',
  'mother',
  'father',
  'child',
  'children',
  'brother',
  'sister',
  'friend',
  'teacher',
  'student',
  'home',
  'school',
  'language',
  'yoruba language',
  'igbo language',
  'hausa language',
  'i want to learn',
  'i love my culture',
  'code',
  'computer',
  'story',
  'proverb',
  'music',
  'voice',
  'speak',
  'listen',
  'read',
];

const titleCase = (phrase) => phrase.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
const phrases = PHRASE_KEYS.map((key) => {
  const entry = DICTIONARY[key];
  if (!entry?.yo) throw new Error(`Missing curated Yorùbá phrase for voice lesson: ${key}`);
  return { key, sourceText: titleCase(key), practiceText: entry.yo };
});

const createCourse = (lessonTitle, objective) => Object.freeze(phrases.map((phrase, index) => Object.freeze({
  id: index + 1,
  title: `${lessonTitle} ${phrase.sourceText}`,
  sourceText: phrase.sourceText,
  practiceText: phrase.practiceText,
  objective: objective(phrase),
  phraseKey: phrase.key,
})));

export const VOICE_PRACTICE_TOOL_ORDER = Object.freeze([
  'voice-translation',
  'voice-text-to-speech',
  'voice-speech-to-text',
]);

export const VOICE_PRACTICE_COURSES = Object.freeze({
  'voice-translation': createCourse(
    'Translate:',
    ({ sourceText }) => `Translate “${sourceText}” into your chosen language, then listen to the result.`,
  ),
  'voice-text-to-speech': createCourse(
    'Speak:',
    ({ practiceText }) => `Generate and listen to “${practiceText}” in Yorùbá. Adjust the text or language to explore.`,
  ),
  'voice-speech-to-text': createCourse(
    'Recognize:',
    ({ practiceText }) => `Read “${practiceText}” aloud in Yorùbá, then compare your recording with the transcription.`,
  ),
});

export function getVoicePracticeLesson(tool, lessonNumber = 1) {
  const course = VOICE_PRACTICE_COURSES[tool];
  if (!course) return null;
  const parsedNumber = Number(lessonNumber);
  const index = Number.isInteger(parsedNumber) ? Math.min(50, Math.max(1, parsedNumber)) - 1 : 0;
  return course[index];
}

export function getAdjacentVoicePracticeLesson(tool, lessonNumber, direction) {
  const toolIndex = VOICE_PRACTICE_TOOL_ORDER.indexOf(tool);
  if (toolIndex < 0 || ![-1, 1].includes(direction)) return null;
  const lesson = getVoicePracticeLesson(tool, lessonNumber);
  if (!lesson) return null;
  const absoluteIndex = toolIndex * 50 + lesson.id - 1 + direction;
  if (absoluteIndex < 0 || absoluteIndex >= VOICE_PRACTICE_TOOL_ORDER.length * 50) return null;
  const nextTool = VOICE_PRACTICE_TOOL_ORDER[Math.floor(absoluteIndex / 50)];
  return {
    tool: nextTool,
    lesson: VOICE_PRACTICE_COURSES[nextTool][absoluteIndex % 50],
  };
}
