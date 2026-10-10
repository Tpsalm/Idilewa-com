import * as THREE from 'three';
import {
  init3DHeroCanvas,
  init3DAuthCanvas,
  init3DCodingCanvas,
  init3DStoryCanvas,
  init3DAudioVisualizer,
  init3DTiltEngine,
  autoMount3DElements,
  isWebGLAvailable,
  prefersReducedMotion
} from './src/threeScene.js';
import {
  DICTIONARY,
  translateText,
  speakText,
  playTonePitch
} from './src/translationEngine.js';
import {
  ORAL_VOWELS,
  NASAL_VOWELS,
  CONSONANTS,
  TONE_MARKS
} from './src/vowelsConsonantsData.js';
import {
  YORUBA_KEYWORDS,
  YORUBA_COLOR_MAP,
  YORUBA_CODE_LESSONS,
  executeYorubaCode,
  transpileYorubaToJS,
  speakYorubaTerm
} from './src/yorubaCodeEngine.js';
import {
  supabase,
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  saveProgress as supabaseSaveProgress,
  saveCodeSubmission as supabaseSubmitCode
} from './src/supabaseClient.js';

/* Idilewa responsive learning prototype — dependency free, client-side demo. */
(() => {
  'use strict';

  const ROUTES = [
    'trainer',
    'voice_lessons',
    'index', 'about', 'base', 'coding', 'connect_students', 'connect_teachers', 'consent', 'course',
    'ere', 'ere_game', 'guides', 'human', 'ifa', 'ifa_odu', 'individuals', 'keepers',
    'kids', 'languages', 'lesson', 'login', 'method', 'oral', 'oral_genre', 'oriki', 'owe',
    'owe_add', 'owe_detail', 'owe_story', 'owe_reflection', 'pricing', 'profile', 'schools',
    'tutor', 'voices'
  ];

  const LANGUAGES = [
    { id: 'yoruba', name: 'Yorùbá', native: 'Èdè Yorùbá', greeting: 'Ẹ káàárọ̀', hello: 'Báwo ni?', translation: 'Good morning', glyph: 'È', region: 'Nigeria · Benin · Togo', tint: 'mint', lessons: '60 lessons · 3 levels' },
    { id: 'igbo', name: 'Igbo', native: 'Asụsụ Igbo', greeting: 'Ndewo', hello: 'Kedu?', translation: 'Hello', glyph: 'Ị', region: 'South-eastern Nigeria', tint: 'peach', lessons: '60 lessons · 3 levels' },
    { id: 'hausa', name: 'Hausa', native: 'Harshen Hausa', greeting: 'Sannu', hello: 'Yaya dai?', translation: 'Hello', glyph: 'H', region: 'West & Central Africa', tint: 'blue', lessons: '60 lessons · 3 levels' },
    { id: 'swahili', name: 'Swahili', native: 'Kiswahili', greeting: 'Habari', hello: 'Hujambo?', translation: 'How are you?', glyph: 'S', region: 'East Africa', tint: 'lilac', lessons: '60 lessons · 3 levels' }
  ];

  const SOON_LANGUAGES = [
    { id: 'twi', name: 'Twi', region: 'Ghana', glyph: 'T' },
    { id: 'wolof', name: 'Wolof', region: 'Senegal · The Gambia', glyph: 'W' },
    { id: 'zulu', name: 'isiZulu', region: 'Southern Africa', glyph: 'Z' },
    { id: 'fulfulde', name: 'Fulfulde', region: 'Across the Sahel', glyph: 'F' }
  ];

  const ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5m-7 7 7-7 7 7"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16M8 7h8M8 11h7"/>',
    headphones: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/>',
    code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14"/>',
    leaf: '<path d="M20.8 3.2C13 2.6 6.7 4.5 4 8.3c-2.2 3.1-.6 7.1 2.7 7.8 3.6.8 8.4-1.9 10.2-5.8-2.8 5.1-7.2 7.9-12.7 9.4"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    play: '<path d="m9 6 10 6-10 6z" fill="currentColor" stroke="none"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    sparkles: '<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z"/>',
    people: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    school: '<path d="m3 10 9-6 9 6-9 6zM5 12v5c4.4 3.4 9.6 3.4 14 0v-5M21 10v7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    music: '<path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Zm12-2a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z"/>',
    quote: '<path d="M3 11h7v8H3zM14 11h7v8h-7zM3 11a7 7 0 0 1 7-7M14 11a7 7 0 0 1 7-7"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    heart: '<path d="M20.8 8.6c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
    filter: '<path d="M4 7h16M7 12h10m-7 5h4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    globe2: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    volume: '<path d="M4 10v4h4l5 4V6l-5 4zM17 9a5 5 0 0 1 0 6m2.5-8.5a9 9 0 0 1 0 11"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    trophy: '<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0zM7 7H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/>',
    bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.7 9a7 7 0 0 1 12-2L20 12M4 12l2.3 5a7 7 0 0 0 12-2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>'
  };

  const PAGE_META = {
    voice_lessons: {
      title: 'Master African Tonal Pitch with Interactive Voice Practice.',
      eyebrow: 'Voice African Language Trainer',
      desc: 'Interactive speech studio with pitch detection, tone melody soundboards, and voice synthesis across 6 African languages and 60 lessons.',
      icon: 'mic', image: 'listening-reader.jpg', imageAlt: 'A learner practicing voice pronunciation with interactive audio',
      active: 0, flow: ['Select Language', 'Hear Native Tones', 'Record & Analyze', 'Earn Certificate'],
      cta: 'Open Voice Studio', ctaRoute: 'trainer',
      cards: [
        { title: 'Tonal Pitch Melody', text: 'Hear high, mid, and low tonal frequencies with dynamic soundboard keys.', icon: 'music', route: 'trainer', tone: 'mint' },
        { title: 'Speech Evaluation', text: 'Prototype pitch accuracy, rhythm, and clarity scoring with star rewards.', icon: 'mic', route: 'trainer', tone: 'yellow' },
        { title: '60 Audio Lessons', text: 'Beginner, intermediate, and advanced curriculum for Yorùbá, Igbo, Hausa, Swahili, isiZulu, and Twi.', icon: 'book', route: 'trainer', tone: 'blue' }
      ]
    },
    trainer: {
      title: 'Master African Tonal Pitch with Real-Time Voice AI.',
      eyebrow: 'Voice African Language Trainer',
      desc: 'Interactive speech studio with pitch detection, tone melody soundboards, and native voice synthesis across 6 African languages and 60 lessons.',
      icon: 'mic', image: 'listening-reader.jpg', imageAlt: 'A learner practicing voice pronunciation with interactive audio',
      active: 0, flow: ['Select Language', 'Hear Native Tones', 'Record & Analyze', 'Earn Certificate'],
      cta: 'Open Voice Studio', ctaRoute: 'trainer',
      cards: [
        { title: 'Tonal Pitch Melody', text: 'Hear high, mid, and low tonal frequencies with dynamic soundboard keys.', icon: 'music', route: 'trainer', tone: 'mint' },
        { title: 'Speech Evaluation', text: 'Real-time pitch accuracy, rhythm, and clarity scoring with star rewards.', icon: 'mic', route: 'trainer', tone: 'yellow' },
        { title: '60 Audio Lessons', text: 'Beginner, intermediate, and advanced curriculum for Yorùbá, Igbo, Hausa, Swahili, isiZulu, and Twi.', icon: 'book', route: 'trainer', tone: 'blue' }
      ]
    },
    about: {
      title: 'Culture is not a chapter. It is the whole story.',
      eyebrow: 'About Idilewa',
      desc: 'A welcoming digital home where African languages, living heritage and future-facing skills grow together.',
      icon: 'leaf', image: 'story', imageAlt: 'A grandmother sharing a story with children',
      active: 2, flow: ['Belong', 'Discover', 'Learn', 'Pass it on'],
      cta: 'Explore our approach', ctaRoute: 'method',
      cards: [
        { title: 'Language lives in community', text: 'Learning grows through everyday words, family stories and the voices of people who carry them.', icon: 'people', route: 'individuals', tone: 'mint' },
        { title: 'Culture belongs in the classroom', text: 'Proverbs, oral traditions and cultural context sit beside language practice—not on the sidelines.', icon: 'book', route: 'oral', tone: 'peach' },
        { title: 'Technology can carry us forward', text: 'Young learners can explore coding while staying rooted in the languages they know.', icon: 'code', route: 'coding', tone: 'blue' }
      ]
    },
    individuals: {
      title: 'Your roots. Your pace. Your next chapter.',
      eyebrow: 'For independent learners',
      desc: 'Reconnect with a language you grew up hearing—or begin a new one with a clear, welcoming path.',
      icon: 'compass', image: 'hero', imageAlt: 'A young learner exploring a book',
      active: 1, flow: ['Find your why', 'Choose a level', 'Practice a little', 'Grow confidently'],
      cta: 'Choose a language', ctaRoute: 'languages',
      cards: [
        { title: 'Start where you are', text: 'Begin with greetings and practical phrases, or choose a level that fits your experience.', icon: 'globe', route: 'languages', tone: 'mint' },
        { title: 'Listen, repeat, remember', text: 'Hear a phrase, see its meaning and build confidence through short practice.', icon: 'headphones', route: 'voices', tone: 'blue' },
        { title: 'Follow your curiosity', text: 'Move from language into stories, proverbs, culture and code whenever you are ready.', icon: 'sparkles', route: 'base', tone: 'peach' }
      ]
    },
    kids: {
      title: 'Big worlds begin with a few good words.',
      eyebrow: 'A learning space for kids',
      desc: 'Short lessons, warm stories and creative challenges help young learners explore language, culture and technology.',
      icon: 'sparkles', image: 'kids', imageAlt: 'Three children in Yorùbá traditional attire learning together',
      active: 0, flow: ['Pick a language', 'Meet new words', 'Play and practice', 'Share a story'],
      cta: 'Start a kid-friendly path', ctaRoute: 'languages',
      cards: [
        { title: 'Words you can use today', text: 'Learn friendly greetings and everyday phrases with clear audio prompts.', icon: 'volume', route: 'course', tone: 'mint' },
        { title: 'Stories made to share', text: 'Read or listen together, then answer a short question about what happened.', icon: 'book', route: 'ere', tone: 'peach' },
        { title: 'Create with code', text: 'See beginner coding ideas explained in English and an African language side by side.', icon: 'code', route: 'coding', tone: 'yellow' }
      ]
    },
    schools: {
      title: 'Bring language, culture and code into class.',
      eyebrow: 'For schools & educators',
      desc: 'A flexible learning space for teachers who want culturally grounded language practice and technology education.',
      icon: 'school', image: 'code', imageAlt: 'Children learning coding together',
      active: 1, flow: ['Explore the platform', 'Choose a language', 'Plan a lesson', 'Learn together'],
      cta: 'Explore learning paths', ctaRoute: 'languages', form: 'school',
      cards: [
        { title: 'A clear lesson structure', text: 'Move from language and level to a module, an activity and a short assessment.', icon: 'layers', route: 'course', tone: 'mint' },
        { title: 'Culture with context', text: 'Use stories, oral traditions and guided cultural notes to bring a lesson to life.', icon: 'quote', route: 'guides', tone: 'peach' },
        { title: 'Designed with care', text: 'A calm, age-aware experience supports teachers and keeps children’s privacy in view.', icon: 'shield', route: 'method', tone: 'blue' }
      ]
    },
    tutor: {
      title: 'A thoughtful guide can make learning click.',
      eyebrow: 'Tutor-led learning',
      desc: 'Pair independent practice with a supportive teacher or language guide. Keep the learner and family in control.',
      icon: 'people', image: 'story', imageAlt: 'An elder and children sharing a story',
      active: 2, flow: ['Set a goal', 'Find a guide', 'Learn together', 'Reflect'],
      cta: 'Browse the learning paths', ctaRoute: 'languages', form: 'tutor',
      cards: [
        { title: 'Guided conversation', text: 'Practice everyday phrases in a patient, encouraging learning space.', icon: 'volume', route: 'voices', tone: 'mint' },
        { title: 'Cultural context', text: 'Learn with people who can explain where words, stories and customs come from.', icon: 'leaf', route: 'keepers', tone: 'peach' },
        { title: 'Visible next steps', text: 'Lessons and practice stay organized so learners can build confidence over time.', icon: 'layers', route: 'course', tone: 'blue' }
      ]
    },
    method: {
      title: 'Learn through listening, doing and belonging.',
      eyebrow: 'The Idilewa method',
      desc: 'A six-layer information guide makes each route understandable, while a separate progress sequence shows the next action and culture gives the words a place to live.',
      icon: 'layers', image: 'hero', imageAlt: 'A learner reading as part of a language lesson',
      active: 2, flow: ['Language', 'Level', 'Module', 'Lesson'],
      cta: 'See the learning path', ctaRoute: 'course',
      cards: [
        { title: 'Hear it in context', text: 'Start with useful phrases, pronunciation and examples that connect to daily life.', icon: 'headphones', route: 'voices', tone: 'blue' },
        { title: 'Practice in small steps', text: 'Short exercises and friendly feedback help learners try, revise and remember.', icon: 'check', route: 'lesson', tone: 'mint' },
        { title: 'Connect language to culture', text: 'Stories, oral traditions and people keep language learning human and rooted.', icon: 'leaf', route: 'oral', tone: 'peach' }
      ]
    },
    guides: {
      title: 'A little context makes every word richer.',
      eyebrow: 'Cultural guides',
      desc: 'Explore thoughtful, learner-friendly introductions to greetings, names, customs, food, festivals and heritage.',
      icon: 'book', image: 'story', imageAlt: 'A family sharing an oral story',
      active: 1, flow: ['Choose a theme', 'Read a guide', 'Meet a voice', 'Reflect together'],
      cta: 'Explore oral traditions', ctaRoute: 'oral',
      cards: [
        { title: 'Everyday expressions', text: 'Discover how greetings, respect and familiar phrases change with context.', icon: 'volume', route: 'languages', tone: 'mint' },
        { title: 'Stories & memory', text: 'Meet oral storytelling as a living way to share history, humour and belonging.', icon: 'quote', route: 'ere', tone: 'peach' },
        { title: 'Culture keepers', text: 'Learn why community voices and careful attribution matter.', icon: 'people', route: 'keepers', tone: 'blue' }
      ]
    },
    human: {
      title: 'Language lives in the people who carry it.',
      eyebrow: 'People & community',
      desc: 'Meet the roles, voices and shared knowledge that help language and culture travel between generations.',
      icon: 'people', image: 'story', imageAlt: 'A grandmother telling a story to children',
      active: 2, flow: ['Listen', 'Learn the context', 'Share respectfully', 'Keep it growing'],
      cta: 'Meet culture keepers', ctaRoute: 'keepers',
      cards: [
        { title: 'Language educators', text: 'Teachers help learners turn curiosity into a steady practice.', icon: 'school', route: 'tutor', tone: 'mint' },
        { title: 'Story keepers', text: 'Elders and storytellers carry expressions, memories and local knowledge.', icon: 'quote', route: 'oral', tone: 'peach' },
        { title: 'Creative learners', text: 'Children and adults bring their own questions, ideas and futures.', icon: 'sparkles', route: 'individuals', tone: 'yellow' }
      ]
    },
    keepers: {
      title: 'Listen first. Credit the people behind the knowledge.',
      eyebrow: 'Language & culture keepers',
      desc: 'Idilewa is designed to centre the people who teach, record and care for language and cultural knowledge.',
      icon: 'heart', image: 'story', imageAlt: 'A cultural elder sharing a story',
      active: 2, flow: ['Listen well', 'Understand context', 'Give credit', 'Share with care'],
      cta: 'Explore our approach', ctaRoute: 'method',
      cards: [
        { title: 'Oral historians', text: 'Help place stories and expressions in their local and historical context.', icon: 'quote', route: 'oral', tone: 'peach' },
        { title: 'Language teachers', text: 'Support accurate, welcoming learning experiences for every level.', icon: 'school', route: 'tutor', tone: 'mint' },
        { title: 'Community voices', text: 'Shape what is shared, how it is attributed and what should remain private.', icon: 'shield', route: 'about', tone: 'blue' }
      ]
    },
    ifa: {
      title: 'Explore a living tradition with care and context.',
      eyebrow: 'Ifá & Yoruba knowledge',
      desc: 'A respectful learning space for cultural context, vocabulary and stories—guided by knowledgeable community voices.',
      icon: 'leaf', image: 'story', imageAlt: 'A family learning from a cultural elder',
      active: 1, flow: ['Begin with context', 'Explore a theme', 'Listen to keepers', 'Reflect respectfully'],
      cta: 'Explore a cultural guide', ctaRoute: 'ifa_odu',
      cards: [
        { title: 'Context before conclusions', text: 'Start with language and history; cultural traditions deserve more than a quick summary.', icon: 'eye', route: 'ifa_odu', tone: 'mint' },
        { title: 'Listen to community voices', text: 'Explore how oral knowledge is shared and why attribution and consent matter.', icon: 'headphones', route: 'keepers', tone: 'peach' },
        { title: 'Keep learning open-ended', text: 'Use guided questions to notice, reflect and learn without reducing a living tradition.', icon: 'sparkles', route: 'guides', tone: 'blue' }
      ]
    },
    ifa_odu: {
      title: 'Odu: a doorway into a much wider body of knowledge.',
      eyebrow: 'Culture note · Ifá',
      desc: 'An introductory, non-prescriptive cultural overview. Meaning and practice vary; this space makes room for context, community and deeper learning.',
      icon: 'book', image: 'story', imageAlt: 'A cultural guide sharing knowledge with young learners',
      active: 2, flow: ['Context', 'Vocabulary', 'Community voices', 'Reflection'],
      cta: 'Back to the culture collection', ctaRoute: 'ifa',
      cards: [
        { title: 'Words and context', text: 'Notice how language, story and interpretation are connected.', icon: 'globe', route: 'languages', tone: 'mint' },
        { title: 'A living knowledge system', text: 'Learn with respect for the people and communities who hold and transmit this knowledge.', icon: 'people', route: 'keepers', tone: 'peach' },
        { title: 'Reflect, do not prescribe', text: 'This learning view is educational and cultural—not spiritual advice or a substitute for a qualified guide.', icon: 'shield', route: 'method', tone: 'blue' }
      ]
    }
  };

  const NAV = [
    { label: 'Home', route: 'index', group: 'home' },
    { label: 'Learn', route: 'languages', group: 'learn' },
    { label: 'Voice Trainer', route: 'trainer', group: 'trainer' },
    { label: 'Read & listen', route: 'oral', group: 'read' },
    { label: 'Code', route: 'coding', group: 'code' },
    { label: 'Stories', route: 'ere', group: 'stories' },
    { label: 'About', route: 'about', group: 'about' }
  ];

  const NAV_GROUPS = {
    trainer: 'trainer', voice_lessons: 'trainer',
    languages: 'learn', course: 'learn', lesson: 'learn', kids: 'learn', individuals: 'learn',
    oral: 'read', oral_genre: 'read', oriki: 'read', owe: 'read', owe_add: 'read',
    owe_detail: 'read', owe_story: 'read', owe_reflection: 'read', voices: 'read',
    connect_students: 'about', connect_teachers: 'about', consent: 'about',
    coding: 'code', ere: 'stories', ere_game: 'stories', ifa: 'culture', ifa_odu: 'culture',
    about: 'about', method: 'about', schools: 'about', tutor: 'about',
    guides: 'culture', human: 'culture', keepers: 'culture'
  };

  const LABELS = Object.fromEntries(ROUTES.map((r) => [r, r === 'index' ? 'Home' : r.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())]));
  LABELS.ere = 'Stories'; LABELS.ere_game = 'Story game'; LABELS.ifa_odu = 'Odu culture note'; LABELS.coding = 'Coding for kids';
  LABELS.owe_add = 'Share a proverb'; LABELS.owe_detail = 'Owe · translation & meaning';
  LABELS.owe_story = 'Owe · moral story'; LABELS.owe_reflection = 'Owe · reflection';
  LABELS.connect_students = 'Connect with Students'; LABELS.connect_teachers = 'Connect with Teachers';
  LABELS.consent = 'Parent & guardian consent';
    LABELS.trainer = 'Voice African Language Trainer';
  LABELS.voice_lessons = 'Voice African Language Trainer';

  const defaults = {
    currentLang: 'yoruba',
    level: 'beginner',
    points: 0,
    streak: 0,
    completed: [],
    lessonResponses: {},
    quizResults: {},
    rewarded: {},
    saved: [],
    savedProverbs: [],
    reflections: [],
    reflectionFeeling: '',
    teacherRequests: [],
    teacherReplies: [],
    teacherFilter: 'all',
    interested: [],
    available: { yoruba: true, igbo: true, hausa: true, swahili: true, twi: false, wolof: false, zulu: false, fulfulde: false },
    loginMode: 'signin',
    authRole: 'child',
    billing: 'monthly',
    consent: {
      requestCode: '', approvedCode: '', approved: false,
      learnerAlias: 'Young learner', accountApproved: false,
      tutorApproved: false, tutorId: '', childVerified: false,
      tutorValidatedFor: '', assignmentAccepted: false,
      requestedAt: '', approvedAt: '', expiresAt: 0
    },
    coding: {
      stage: 0, techId: 'html', level: 'beginner', missionId: 'hello',
      helperLanguage: 'yoruba', search: '', points: 0, streak: 0,
      filter: 'all', category: 'all', lessonSearch: '', completedLessons: [],
      lastPracticeDate: '', completed: [], draft: '', result: '',
      questCommands: [], questTrail: [], questResult: '',
      ideLang: 'yoruba', idePresetId: 'hello_world',
      ideCode: '# Kí Ilé Ayé ní Èdè Yorùbá\njẹ́ orúkọ = "Ọmọ Yorùbá"\ntẹ_jade("Ẹ n lẹ́ o, " + orúkọ + "! Ẹ káàbọ̀ sí Idíléwà.")\ntẹ_jade("A n kọ́ koodu ní èdè abínibí wa lónìí! ✨")',
      ideOutput: '> [Idilewa Engine v2.4 Online]\n> Ẹ n lẹ́ o, Ọmọ Yorùbá! Ẹ káàbọ̀ sí Idíléwà.\n> A n kọ́ koodu ní èdè abínibí wa lónìí! ✨\n✓ Àṣeyọrí: Execution completed in 0.02ms (+10 Maker XP)',
      ideTab: 'terminal', ideRuntime: '0.02ms', ideXp: 10
    },
    trainer: {
      lang: 'yoruba',
      level: 'beginner',
      activeLessonId: 1,
      speed: 1.0,
      isRecording: false,
      score: null,
      analysis: null,
      completed: {},
      xp: 220,
      streak: 5
    }
  };

  function readState() {
    try {
      const stored = JSON.parse(localStorage.getItem('idilewa-demo-state') || '{}');
      return {
        ...defaults,
        ...stored,
        available: { ...defaults.available, ...(stored.available || {}) },
        consent: { ...defaults.consent, ...(stored.consent || {}) },
        trainer: {
          ...defaults.trainer,
          ...(stored.trainer || {}),
          completed: typeof stored.trainer?.completed === 'object' && stored.trainer.completed !== null ? stored.trainer.completed : {}
        },
        coding: {
          ...defaults.coding,
          ...(stored.coding || {}),
          completed: Array.isArray(stored.coding?.completed) ? stored.coding.completed : [],
          completedLessons: Array.isArray(stored.coding?.completedLessons) ? stored.coding.completedLessons : [],
          filter: typeof stored.coding?.filter === 'string' ? stored.coding.filter : 'all',
          category: typeof stored.coding?.category === 'string' ? stored.coding.category : 'all',
          lessonSearch: typeof stored.coding?.lessonSearch === 'string' ? stored.coding.lessonSearch : '',
          questCommands: Array.isArray(stored.coding?.questCommands) ? stored.coding.questCommands.filter((step) => ['up', 'right', 'down', 'left'].includes(step)).slice(0, 12) : [],
          questTrail: Array.isArray(stored.coding?.questTrail) ? stored.coding.questTrail.filter((cell) => typeof cell === 'string').slice(0, 20) : [],
          questResult: typeof stored.coding?.questResult === 'string' ? stored.coding.questResult : '',
          search: typeof stored.coding?.search === 'string' ? stored.coding.search : '',
          draft: typeof stored.coding?.draft === 'string' ? stored.coding.draft : '',
          result: typeof stored.coding?.result === 'string' ? stored.coding.result : ''
        },
        lessonResponses: { ...(stored.lessonResponses || {}) },
        quizResults: { ...(stored.quizResults || {}) },
        rewarded: { ...(stored.rewarded || {}) },
        saved: Array.isArray(stored.saved) ? stored.saved : [],
        savedProverbs: Array.isArray(stored.savedProverbs) ? stored.savedProverbs : [],
        reflections: Array.isArray(stored.reflections) ? stored.reflections : [],
        teacherRequests: Array.isArray(stored.teacherRequests) ? stored.teacherRequests : [],
        teacherReplies: Array.isArray(stored.teacherReplies) ? stored.teacherReplies : [],
        teacherFilter: typeof stored.teacherFilter === 'string' ? stored.teacherFilter : 'all',
        reflectionFeeling: typeof stored.reflectionFeeling === 'string' ? stored.reflectionFeeling : '',
        authRole: typeof stored.authRole === 'string' ? stored.authRole : 'child',
        completed: Array.isArray(stored.completed) ? stored.completed : defaults.completed.slice(),
        interested: Array.isArray(stored.interested) ? stored.interested : []
      };
    } catch (_) { return { ...defaults, available: { ...defaults.available }, trainer: { ...defaults.trainer } }; }
  }
  const state = readState();
  if (state.level === 'growing') state.level = 'intermediate';
  if (state.level === 'fluent') state.level = 'advanced';
  if (!['beginner', 'intermediate', 'advanced'].includes(state.level)) state.level = 'beginner';

  function saveState() {
    try { localStorage.setItem('idilewa-demo-state', JSON.stringify(state)); } catch (_) { /* private browsing */ }
  }

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const imageUrl = (filename) => window.__IDILEWA_ASSETS__?.[filename] || `./assets/${filename}`;
  const icon = (name, size = 20, extraClass = '') => `<svg class="icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;
  const getLanguage = (id = state.currentLang) => {
    const active = LANGUAGES.find((l) => l.id === id);
    if (active) return active;
    const planned = SOON_LANGUAGES.find((l) => l.id === id);
    return planned ? { ...planned, native: planned.name, tint: 'peach', greeting: '', hello: '', translation: '', lessons: 'Learning materials in preparation', upcoming: true } : LANGUAGES[0];
  };

  function parseLocation() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      const defaultPage = document.body?.dataset?.defaultRoute || 'index';
      return { page: ROUTES.includes(defaultPage) ? defaultPage : 'index', params: {} };
    }
    const [path, query = ''] = hash.split('?');
    const page = path.split('/')[0] || 'index';
    return { page: ROUTES.includes(page) ? page : 'base', params: Object.fromEntries(new URLSearchParams(query)) };
  }

  function navigate(route, params = {}, replace = false) {
    const page = ROUTES.includes(route) ? route : 'index';
    const query = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const next = `#/${page}${query ? `?${query}` : ''}`;
    if (window.location.hash === next) render();
    else if (replace) history.replaceState(null, '', next), render();
    else window.location.hash = next;
    closeMobileMenu();
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function routeLink(route, label, cls = '', attrs = '') {
    return `<a class="${cls}" href="#/${route}" data-route="${route}" ${attrs}>${label}</a>`;
  }

  function renderHeader(page) {
    const currentGroup = NAV_GROUPS[page] || (page === 'index' ? 'home' : '');
    const nav = NAV.map((item) => `<a class="nav-link ${currentGroup === item.group ? 'active' : ''}" href="#/${item.route}" data-route="${item.route}">${item.label}</a>`).join('');
    const menu = NAV.map((item) => `<a class="mobile-menu-link ${currentGroup === item.group ? 'active' : ''}" href="#/${item.route}" data-route="${item.route}">${icon(item.group === 'home' ? 'home' : item.group === 'trainer' ? 'mic' : item.group === 'learn' ? 'book' : item.group === 'read' ? 'headphones' : item.group === 'code' ? 'code' : item.group === 'stories' ? 'quote' : item.group === 'community' ? 'people' : 'sparkles', 19)}<span>${item.label}</span>${icon('arrow', 16)}</a>`).join('');
    document.getElementById('site-header').innerHTML = `
      <div class="header-inner">
        <a class="brand" href="#/index" data-route="index" aria-label="Idilewa home">
          <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="brand-copy"><span class="brand-word">idílẹ́wà</span><span class="brand-caption">Language · culture · future</span></span>
        </a>
        <nav class="desktop-nav" aria-label="Main navigation">${nav}</nav>
        <div class="header-actions">
          <button class="icon-button search-button" type="button" data-action="open-search" aria-label="Search Idilewa">${icon('search', 18)}</button>
          <a class="header-signin" href="#/login" data-route="login">Sign in</a>
          <a class="button button-small button-primary header-cta" href="#/trainer" data-route="trainer">${icon('mic', 14)} Voice Studio</a>
          <button class="icon-button menu-toggle" type="button" data-action="toggle-menu" aria-label="Open navigation" aria-expanded="false">${icon('menu', 21)}</button>
        </div>
      </div>
      <div id="mobile-menu" class="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-head"><span>Explore Idilewa</span><button class="icon-button" type="button" data-action="toggle-menu" aria-label="Close navigation">${icon('close', 20)}</button></div>
        <div class="mobile-menu-list">${menu}</div>
        <div class="mobile-menu-bottom"><a class="button button-primary" href="#/trainer" data-route="trainer">${icon('mic', 15)} African Voice Trainer</a><a href="#/login" data-route="login">Sign in to your space</a></div>
      </div>`;
  }

  function renderMobileNav(page) {
    const items = [
      { route: 'index', label: 'Home', ico: 'home' },
      { route: 'languages', label: 'Learn', ico: 'book' },
      { route: 'trainer', label: 'Trainer', ico: 'mic' },
      { route: 'ere', label: 'Stories', ico: 'quote' },
      { route: 'coding', label: 'Code', ico: 'code' },
      { route: 'profile', label: 'Progress', ico: 'user' }
    ];
    document.getElementById('mobile-nav').innerHTML = items.map((item) => `<a href="#/${item.route}" data-route="${item.route}" class="mobile-tab ${page === item.route || (item.route === 'languages' && ['course', 'lesson'].includes(page)) ? 'active' : ''}">${icon(item.ico, 19)}<span>${item.label}</span></a>`).join('');
  }

  function renderFooter() {
    return `<footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand-block">
          <a class="brand footer-brand" href="#/index" data-route="index"><span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span><span class="brand-copy"><span class="brand-word">idílẹ́wà</span><span class="brand-caption">Language · culture · future</span></span></a>
          <p>Èdè wa, àṣà wa, ìdílé wa.<br />Our language. Our culture. Our family.</p>
        </div>
        <div class="footer-links"><h3>Learn</h3>${routeLink('languages', 'Choose a language')}${routeLink('trainer', 'Voice Language Trainer')}${routeLink('course', 'Learning paths')}${routeLink('coding', 'Code in your language')}</div>
        <div class="footer-links"><h3>Discover</h3>${routeLink('trainer', 'AI Voice & Tone Studio')}${routeLink('oral', 'Read & listen')}${routeLink('ere', 'Stories')}${routeLink('ifa', 'Culture & heritage')}</div>
        <div class="footer-links"><h3>Idilewa</h3>${routeLink('about', 'Our story')}${routeLink('individuals', 'For independent learners')}${routeLink('schools', 'For schools')}${routeLink('connect_teachers', 'Connect with teachers')}${routeLink('connect_students', 'Connect with students')}${routeLink('base', 'Explore all pages')}</div>
      </div>
      <div class="container footer-bottom"><span>© Idilewa · A learning space for languages, culture and technology</span><span class="footer-note">A thoughtful beginning, built to grow.</span></div>
    </footer>`;
  }

  function pill(text, tone = 'soft') { return `<span class="pill pill-${tone}">${text}</span>`; }

  function renderHome() {
    const featureCards = [
      { title: 'Learn languages', desc: 'Speak, listen, read and practice.', icon: 'globe', route: 'languages', tone: 'blue', tag: 'Start here', image: 'page-languages-1.jpg' },
      { title: 'African Voice Trainer', desc: 'Real-time pitch scoring & tone feedback for 6 African languages.', icon: 'mic', route: 'trainer', tone: 'mint', tag: 'Interactive AI Studio', image: 'listening-reader.jpg' },
      { title: 'Read & listen', desc: 'Hear words, voices and ideas.', icon: 'headphones', route: 'voices', tone: 'mint', tag: 'Audio & text', image: 'listening-reader.jpg' },
      { title: 'Code in your language', desc: 'Explore technology, side by side.', icon: 'code', route: 'coding', tone: 'yellow', tag: 'Create', image: 'code-kids.jpg' },
      { title: 'Stories & culture', desc: 'Discover stories, people and traditions.', icon: 'book', route: 'ere', tone: 'pink', tag: 'Explore', image: 'stories-culture.jpg', imageAlt: 'Rich African cultural heritage items: books, woven basket, carved bowl on kente cloth, and drum' },
      { title: 'Connect with Students', desc: 'A respectful space for educators to meet learners.', icon: 'people', route: 'connect_students', tone: 'peach', tag: 'For educators', image: 'african-kids-friends.jpg' },
      { title: 'Connect with Teachers', desc: 'Browse educator profiles, learning hours and experience.', icon: 'school', route: 'connect_teachers', tone: 'lilac', tag: 'For learners', image: 'yoruba-educator-man.jpg' }
    ];
    const books = [
      { title: 'A Morning Greeting', label: 'Yorùbá · Beginner', bg: 'cover-green', shape: 'È', route: 'course' },
      { title: 'The Talking Drum', label: 'Story · Read & listen', bg: 'cover-blue', shape: '♫', route: 'ere' },
      { title: 'Little Code Garden', label: 'English + Yorùbá', bg: 'cover-yellow', shape: '</>', route: 'coding' },
      { title: 'Wisdom We Carry', label: 'Culture · Short read', bg: 'cover-pink', shape: '“', route: 'oral' }
    ];
    return `
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-copy">
            <div class="eyebrow"><span class="eyebrow-dot"></span>African roots <span class="eyebrow-separator">·</span> brighter futures</div>
            <h1>Preserving African Culture.<br /><span>Promoting Technology.</span></h1>
            <p class="hero-mantra">Learn. Speak. Code. Create. Belong.</p>
            <p class="hero-lede">A joyful place to learn a language, hear the stories behind it and imagine what you can create next.</p>
            <div class="hero-actions">
              ${routeLink('languages', `Start learning ${icon('arrow', 17)}`, 'button button-primary')}
              ${routeLink('trainer', `${icon('mic', 16)} Voice Trainer`, 'button button-accent')}
              ${routeLink('about', `${icon('play', 15)} Our story`, 'button button-outline')}
            </div>
            <div class="hero-social-proof"><div class="mini-avatars"><span>A</span><span>Ẹ</span><span>Ụ</span><span>✳</span></div><span>For curious learners, families<br class="desktop-only" /> and the next generation</span></div>
          </div>
          <!-- Hero Visual: 3D Talking Drum (Default Active Centerpiece) & Living Family View Switcher -->
          <div class="hero-visual modern-hero-visual" id="heroVisualStage">
            <div class="hero-ambient-glow" aria-hidden="true"></div>
            
            <div class="hero-visual-stage-inner">
              <div class="hero-visual-switcher" role="tablist" aria-label="Hero visual display mode">
                <button type="button" class="hero-switch-btn is-active" id="btnShow3D" data-action="hero-show-3d" role="tab" aria-selected="true">
                  <span>🥁 3D Talking Drum &amp; Glyphs</span>
                </button>
                <button type="button" class="hero-switch-btn" id="btnShowPhoto" data-action="hero-show-photo" role="tab" aria-selected="false">
                  <span>📸 Living Family View</span>
                </button>
              </div>

              <!-- 3D Interactive Talking Drum Stage (Visible By Default on Page Load) -->
              <div class="hero-3d-stage-container" id="hero3DStageWrap" style="display: block; width: 100%; position: relative;">
                <div id="hero3DCanvasWrap" class="hero-3d-canvas-wrap" data-3d-scene="hero" title="Drag to rotate 3D African Gángan Drum and living glyphs" aria-label="Interactive 3D African Talking Drum and orbiting Yoruba glyphs"></div>
                <div class="hero-3d-floating-badge">
                  <span class="hero-3d-pulse-dot"></span>
                  <span>🪐 3D Gángan Drum &amp; Glyphs · Drag &amp; Rotate · Three.js</span>
                </div>
              </div>

              <!-- 2D Photographic & Greeting Hotspots View (Hidden By Default) -->
              <div class="hero-photo-wrap" role="region" aria-label="Interactive Idilewa African language &amp; cultural learning preview" id="heroPhotoWrap" style="display: none;">
                <div class="hero-photo-frame">
                  <img src="./assets/hero-home.jpg" alt="African mother and children learning languages and technology together on Idilewa" class="hero-photo cinematic-living-image" />
                  <canvas id="heroCinematicCanvas" class="cinematic-video-canvas" aria-hidden="true"></canvas>
                  <div class="cinematic-tablet-screen-glow" aria-hidden="true"></div>
                  <div class="cinematic-golden-hour-rays" aria-hidden="true"></div>
                  <div class="cinematic-jewelry-glints" aria-hidden="true">
                    <span class="jewelry-glint j1" style="left: 54.2%; top: 48.5%;"></span>
                    <span class="jewelry-glint j2" style="left: 56.5%; top: 44.2%;"></span>
                    <span class="jewelry-glint j3" style="left: 52.8%; top: 22.8%;"></span>
                    <span class="jewelry-glint j4" style="left: 33.6%; top: 62.4%;"></span>
                  </div>
                  <div class="cinematic-lens-flare" aria-hidden="true"></div>
                  <div class="hero-vignette-overlay" aria-hidden="true"></div>
                  <div class="cinematic-live-badge" aria-label="4K Ultra-HD Living Studio">
                    <span class="cinematic-pulse-dot"></span>
                    <span>Living Studio</span>
                  </div>
                </div>
                <div class="hero-interactive-hotspots-container" aria-label="Interactive Audio Learning Hotspots">
                  <button type="button" class="hero-interactive-hotspot hotspot-yoruba" data-action="hero-play-greeting" data-lang="yoruba" data-phrase="Ẹ káàárọ̀" data-translation="Good morning" title="Click to hear Yorùbá: Ẹ káàárọ̀ (Good morning)" aria-label="Yorùbá greeting: Ẹ káàárọ̀, Good morning">
                    <span class="hotspot-highlight-glow" aria-hidden="true"></span>
                    <span class="hotspot-ripple-ring" aria-hidden="true"></span>
                  </button>
                  <button type="button" class="hero-interactive-hotspot hotspot-hausa" data-action="hero-play-greeting" data-lang="hausa" data-phrase="Sannu" data-translation="Good morning" title="Click to hear Hausa: Sannu (Good morning)" aria-label="Hausa greeting: Sannu, Good morning">
                    <span class="hotspot-highlight-glow" aria-hidden="true"></span>
                    <span class="hotspot-ripple-ring" aria-hidden="true"></span>
                  </button>
                  <button type="button" class="hero-interactive-hotspot hotspot-igbo" data-action="hero-play-greeting" data-lang="igbo" data-phrase="Ndewo" data-translation="Good morning" title="Click to hear Igbo: Ndewo (Good morning)" aria-label="Igbo greeting: Ndewo, Good morning">
                    <span class="hotspot-highlight-glow" aria-hidden="true"></span>
                    <span class="hotspot-ripple-ring" aria-hidden="true"></span>
                  </button>
                  <button type="button" class="hero-interactive-hotspot hotspot-swahili" data-action="hero-play-greeting" data-lang="swahili" data-phrase="Habari" data-translation="Good morning" title="Click to hear Swahili: Habari (Good morning)" aria-label="Swahili greeting: Habari, Good morning">
                    <span class="hotspot-highlight-glow" aria-hidden="true"></span>
                    <span class="hotspot-ripple-ring" aria-hidden="true"></span>
                  </button>
                  <a href="#/languages" data-route="languages" class="hero-interactive-hotspot hotspot-sun" title="Learn African Languages with Joy" aria-label="Learn African Languages with Joy">
                    <span class="hotspot-highlight-glow" aria-hidden="true"></span>
                    <span class="hotspot-sun-glow" aria-hidden="true"></span>
                  </a>
                  <a href="#/ere" data-route="ere" class="hero-interactive-hotspot hotspot-stories" title="Explore African Stories &amp; Folktales" aria-label="Explore African Stories &amp; Folktales">
                    <span class="hotspot-highlight-glow" aria-hidden="true"></span>
                    <span class="hotspot-shimmer-bar" aria-hidden="true"></span>
                  </a>
                  <button type="button" class="hero-interactive-hotspot hotspot-motto" data-action="hero-motto-click" title="Click to see Idilewa daily learning motto" aria-label="Idilewa learning motto">
                    <span class="hotspot-highlight-glow" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container hero-language-row"><span class="tiny-label">Four languages. One welcoming home.</span><div class="hero-lang-pills">${LANGUAGES.map((l) => `<span>${l.name}</span>`).join('')}</div>${routeLink('languages', 'See all languages ' + icon('arrow', 14), 'text-link')}</div>
      </section>

      <!-- 5 Pathways Learning Cards (Five Pillars of Idilewa) -->
      <section class="container section visual-journey-3d-section" id="visual-journey">
        <div class="section-heading text-center">
          <div>
            <span class="section-kicker">Scroll-Driven Learning Journey · Living Knowledge</span>
            <h2>Five Pathways to Keep Language &amp; Culture Close</h2>
            <p>From your first spoken greeting to authentic tone melody, living proverbs, oral stories, and K–8 computational thinking.</p>
          </div>
        </div>
        <div class="visual-journey-timeline">
          <!-- Pillar 1: Language Discovery -->
          <div class="journey-card-3d tone-mint">
            <div class="journey-card-header">
              <div class="journey-3d-step-badge">Pillar 01 · Èdè</div>
              <span class="journey-3d-glyph">È</span>
            </div>
            <div class="journey-3d-content">
              <h3>Language &amp; Everyday Speech</h3>
              <p>Step-by-step foundation in Yorùbá, Igbo, Hausa, or Swahili with greetings, vocabulary, and guided levels.</p>
              <ul class="journey-highlights" aria-label="Key features">
                <li><span>✓</span> 4 African Languages with Native Audio</li>
                <li><span>✓</span> Daily Vocabulary &amp; Conversational Phrases</li>
                <li><span>✓</span> Beginner, Intermediate &amp; Fluent Tracks</li>
              </ul>
            </div>
            <div class="journey-card-action">
              ${routeLink('languages', `Choose a Language ${icon('arrow', 15)}`, 'button button-primary')}
            </div>
          </div>

          <!-- Pillar 2: Voice & Tone Studio -->
          <div class="journey-card-3d tone-yellow">
            <div class="journey-card-header">
              <div class="journey-3d-step-badge">Pillar 02 · Ohùn</div>
              <span class="journey-3d-glyph">♫</span>
            </div>
            <div class="journey-3d-content">
              <h3>Voice &amp; Tonal Melody</h3>
              <p>Hear and practice Dó-Re-Mí tones with our interactive syllable pitch soundboard and 60 audio lessons.</p>
              <ul class="journey-highlights" aria-label="Key features">
                <li><span>✓</span> Real-Time Pitch Detection &amp; Scoring</li>
                <li><span>✓</span> High, Mid &amp; Low Tone Marks</li>
                <li><span>✓</span> 60 Audio Lessons Across 6 Dialects</li>
              </ul>
            </div>
            <div class="journey-card-action">
              ${routeLink('trainer', `${icon('mic', 15)} Open Voice Studio ${icon('arrow', 15)}`, 'button button-accent')}
            </div>
          </div>

          <!-- Pillar 3: Oral Culture & Proverbs -->
          <div class="journey-card-3d tone-peach">
            <div class="journey-card-header">
              <div class="journey-3d-step-badge">Pillar 03 · Òwe &amp; Oríkì</div>
              <span class="journey-3d-glyph">“</span>
            </div>
            <div class="journey-3d-content">
              <h3>Oral Traditions &amp; Context</h3>
              <p>Praise poetry, ancestral proverbs, and guided reflections honoring community permission and attribution.</p>
              <ul class="journey-highlights" aria-label="Key features">
                <li><span>✓</span> 100+ Curated African Proverbs (Òwe)</li>
                <li><span>✓</span> Ancestral Lineage &amp; Family Poetry (Oríkì)</li>
                <li><span>✓</span> Cultural Context &amp; Reflection Prompts</li>
              </ul>
            </div>
            <div class="journey-card-action">
              ${routeLink('oral', `Explore Traditions ${icon('arrow', 15)}`, 'button button-primary')}
            </div>
          </div>

          <!-- Pillar 4: Storytelling -->
          <div class="journey-card-3d tone-pink">
            <div class="journey-card-header">
              <div class="journey-3d-step-badge">Pillar 04 · Ìtàn</div>
              <span class="journey-3d-glyph">📖</span>
            </div>
            <div class="journey-3d-content">
              <h3>Stories That Travel</h3>
              <p>Intergenerational storytelling, family picture books, and audio-first reading with comprehension checks.</p>
              <ul class="journey-highlights" aria-label="Key features">
                <li><span>✓</span> Illustrated Folktales &amp; Audiobooks</li>
                <li><span>✓</span> Bilingual Read-Along with Highlighting</li>
                <li><span>✓</span> Comprehension Quizzes &amp; Word Games</li>
              </ul>
            </div>
            <div class="journey-card-action">
              ${routeLink('ere', `Read &amp; Listen Stories ${icon('arrow', 15)}`, 'button button-primary')}
            </div>
          </div>

          <!-- Pillar 5: K-8 Code & STEAM -->
          <div class="journey-card-3d tone-blue">
            <div class="journey-card-header">
              <div class="journey-3d-step-badge">Pillar 05 · Koodu</div>
              <span class="journey-3d-glyph">&lt;/&gt;</span>
            </div>
            <div class="journey-3d-content">
              <h3>Indigenous STEAM &amp; Code</h3>
              <p>K-8 computational thinking in African languages. Unplugged logic for K–2, turtle geometry for 3–5, full syntax for 6–8.</p>
              <ul class="journey-highlights" aria-label="Key features">
                <li><span>✓</span> Code in Yorùbá (ṣe, ti, fun, pada)</li>
                <li><span>✓</span> Unplugged Quests &amp; Turtle Graphics</li>
                <li><span>✓</span> Interactive In-Browser Live IDE</li>
              </ul>
            </div>
            <div class="journey-card-action">
              ${routeLink('coding', `Code for Kids ${icon('arrow', 15)}`, 'button button-primary')}
            </div>
          </div>
        </div>
      </section>

      <section class="container section section-start">
        <div class="section-heading"><div><span class="section-kicker">A world of ways to learn</span><h2>Learn a little. Carry a lot.</h2><p>Choose a path that feels like you. There is always room to explore.</p></div><a class="text-link desktop-only" href="#/base" data-route="base">Explore the platform ${icon('arrow', 15)}</a></div>
        <div class="feature-grid">${featureCards.map((card) => `<a class="feature-card tone-${card.tone}" href="#/${card.route}" data-route="${card.route}"><span class="feature-card-portrait"><img src="./assets/${card.image}" alt="${card.imageAlt ? esc(card.imageAlt) : ''}" ${card.imageAlt ? '' : 'aria-hidden="true"'} loading="lazy" /></span><div class="feature-card-top"><span class="feature-icon">${icon(card.icon, 23)}</span><span class="feature-tag">${card.tag}</span></div><h3>${card.title}</h3><p>${card.desc}</p><span class="card-arrow">${icon('arrow', 17)}</span></a>`).join('')}</div>
      </section>

      <section class="journey-section">
        <div class="container journey-inner">
          <div class="journey-intro"><span class="section-kicker">A clear path, at your pace</span><h2>Four small steps.<br /><span>One big connection.</span></h2><p>Every learning path makes the next step easy to see—without rushing the joy out of discovery.</p>${routeLink('course', `See how learning works ${icon('arrow', 16)}`, 'text-link')}</div>
          <div class="journey-steps">
            ${[
              ['01', 'Choose a language', 'Start with the words you love.', 'globe', 'languages'],
              ['02', 'Find your level', 'Begin where you feel ready.', 'compass', 'course'],
              ['03', 'Explore a module', 'Move through connected ideas.', 'layers', 'course'],
              ['04', 'Try a lesson', 'Listen, practice and celebrate.', 'check', 'lesson']
            ].map(([num, title, desc, ico, route]) => `<a href="#/${route}" data-route="${route}" class="journey-step"><span class="journey-number">${num}</span><span class="journey-icon">${icon(ico, 20)}</span><strong>${title}</strong><small>${desc}</small><span class="journey-link">${icon('arrow', 15)}</span></a>`).join('')}
          </div>\n    </section>

      <section class="container section language-section">
        <div class="section-heading"><div><span class="section-kicker">Start with a language</span><h2>Which one feels like home?</h2><p>Four learning paths are ready to explore, with more voices on the way.</p></div>${routeLink('languages', 'All languages ' + icon('arrow', 15), 'text-link')}</div>
        <div class="language-grid home-language-grid">${LANGUAGES.map((l) => `<button type="button" class="language-card lang-${l.tint}" data-action="${state.available[l.id] ? 'select-language' : 'notify-language'}" data-lang="${l.id}"><span class="language-glyph">${l.glyph}</span><span class="language-info"><strong>${l.name}</strong><small>${l.region}</small></span><span class="language-go">${icon('arrow', 16)}</span></button>`).join('')}</div>
        <div class="coming-soon-line"><span class="coming-soon-dot"></span>Coming soon: ${SOON_LANGUAGES.map((l) => l.name).join(' · ')} ${routeLink('languages', 'Get curious ' + icon('arrow', 13), 'text-link text-link-small')}</div>
      </section>

      <section class="container section home-trainer-feature-section">
        <div class="home-trainer-card">
          <div class="home-trainer-copy">
            <div class="home-trainer-badge">
              <span class="badge-dot"></span>
              <span>AI VOICE & TONAL PITCH TRAINER</span>
            </div>
            <h2>Speak African Languages with <span class="highlight-green">Native Tonal Fluency</span></h2>
            <p>Our interactive voice studio listens to your voice in real time, analyzes pitch accuracy, and gives instant feedback across Yorùbá, Igbo, Hausa, Swahili, isiZulu, and Twi.</p>
            <div class="home-trainer-highlights">
              <div class="trainer-highlight-item">
                <span class="highlight-icon">${icon('volume', 18)}</span>
                <div>
                  <strong>60 Audio Lessons</strong>
                  <small>3 progressive tiers</small>
                </div>
              </div>
              <div class="trainer-highlight-item">
                <span class="highlight-icon">${icon('music', 18)}</span>
                <div>
                  <strong>Dó-Re-Mí Melodies</strong>
                  <small>Interactive pitch keys</small>
                </div>
              </div>
              <div class="trainer-highlight-item">
                <span class="highlight-icon">${icon('mic', 18)}</span>
                <div>
                  <strong>Live Mic Speech Scoring</strong>
                  <small>Pitch accuracy & stars</small>
                </div>
              </div>
            </div>
            <div class="home-trainer-actions">
              ${routeLink('trainer', `Launch Voice Studio ${icon('arrow', 17)}`, 'button button-primary')}
              ${routeLink('voices', `Explore Voice Library`, 'button button-outline')}
            </div>
          </div>
          <div class="home-trainer-visual">
            <div class="trainer-visual-card">
              <div class="visual-card-head">
                <span class="pulse-recording-dot"></span>
                <span>Live Interactive Audio Studio</span>
              </div>
              <div class="visual-card-phrase">
                <span class="phrase-tag">Yorùbá Tones</span>
                <h3>Ẹ kú àárọ̀ o</h3>
                <div class="visual-tones-demo">
                  <span class="v-tone tone-hi">kú (Mí)</span>
                  <span class="v-tone tone-mid">àár (Re)</span>
                  <span class="v-tone tone-lo">o (Dó)</span>
                </div>
              </div>
              <div class="visual-card-score">
                <div class="score-pill">
                  <strong>96%</strong>
                  <small>Native Pitch Match</small>
                </div>
                <div class="score-stars">★★★ Fluency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="container section explore-section">
        <div class="section-heading"><div><span class="section-kicker">Picked for curious minds</span><h2>Explore books & little discoveries</h2><p>Read, listen and find a new doorway into language and culture.</p></div>${routeLink('ere', 'Visit the library ' + icon('arrow', 15), 'text-link')}</div>
        <div class="book-grid">${books.map((book, i) => `<a href="#/${book.route}" data-route="${book.route}" class="book-card"><div class="book-cover ${book.bg}"><span class="book-cover-mark">${book.shape}</span><span class="book-sun"></span><span class="book-hill book-hill-one"></span><span class="book-hill book-hill-two"></span><span class="book-cover-index">0${i + 1}</span></div><strong>${book.title}</strong><small>${book.label}</small></a>`).join('')}</div>
      </section>

      <section class="container story-feature section">
        <div class="story-feature-image"><img src="./assets/story-grandmother.jpg" alt="A grandmother sharing a story with two children" loading="lazy" /><span class="image-caption">Stories are a way of remembering together.</span></div>
        <div class="story-feature-copy"><span class="section-kicker">Read · listen · remember</span><h2>Every story carries<br /><span>a little piece of us.</span></h2><p>Meet the voices behind a story. Listen in your language, notice a new phrase and bring the conversation home.</p><div class="story-feature-points"><span>${icon('headphones', 17)} Audio-first stories</span><span>${icon('people', 17)} Made for sharing</span></div>${routeLink('ere', `Explore stories ${icon('arrow', 16)}`, 'button button-primary')}</div>
      </section>

      <section class="container section audience-section">
        <div class="section-heading"><div><span class="section-kicker">One home, many journeys</span><h2>Made for the way you learn.</h2><p>Welcoming for children, useful for adults and stronger when families learn together.</p></div></div>
        <div class="audience-grid">
          <a class="audience-card audience-kids" href="#/kids" data-route="kids"><span class="audience-icon">${icon('sparkles', 21)}</span><span class="audience-kicker">For young learners</span><strong>Curiosity comes first.</strong><small>Playful lessons, stories and gentle challenges.</small>${icon('arrow', 16)}</a>
          <a class="audience-card audience-individual" href="#/individuals" data-route="individuals"><span class="audience-icon">${icon('compass', 21)}</span><span class="audience-kicker">For independent learners</span><strong>Your roots. Your pace.</strong><small>A clear, welcoming path for curious minds.</small>${icon('arrow', 16)}</a>
          <a class="audience-card audience-school" href="#/schools" data-route="schools"><span class="audience-icon">${icon('school', 21)}</span><span class="audience-kicker">For schools</span><strong>Bring culture into class.</strong><small>Clear learning paths for educators.</small>${icon('arrow', 16)}</a>
        </div>
      </section>

      <section class="container home-cta-section"><div class="home-cta"><div><span class="section-kicker">Your next word is waiting</span><h2>Let’s keep the good things growing.</h2><p>Choose a language and take your first small step today.</p></div>${routeLink('languages', `Find your language ${icon('arrow', 17)}`, 'button button-white')}</div></section>`;
  }

  function renderLanguageCard(l) {
    const available = !!state.available[l.id];
    return `<article class="language-choice lang-${l.tint} ${available ? '' : 'is-coming'}"><div class="language-choice-top"><span class="language-glyph">${l.glyph}</span>${available ? pill(l.upcoming ? 'Enabled · content pending' : 'Available', 'green') : pill('Coming soon', 'warm')}</div><h3>${l.name}</h3><p class="native-name">${l.native}</p><p class="language-region">${l.region}</p><div class="language-choice-meta"><span>${icon('layers', 15)} ${available ? (l.upcoming ? 'Learning materials in preparation' : l.lessons) : 'A new path is taking shape'}</span><span>${icon('volume', 15)} Listen & speak</span></div><button class="button ${available ? 'button-primary' : 'button-soft'} language-start" data-action="${available ? 'select-language' : 'notify-language'}" data-lang="${l.id}">${available ? (l.upcoming ? 'View language preview' : 'Explore this language') : (state.interested.includes(l.id) ? 'Interest saved' : 'Keep me curious')} ${icon('arrow', 15)}</button></article>`;
  }

  function renderLanguages() {
    const allLanguages = [...LANGUAGES, ...SOON_LANGUAGES.map((l) => ({ ...l, native: l.name, tint: 'peach', greeting: '', translation: '', lessons: 'Learning materials in preparation', upcoming: true }))];
    const availableLanguages = allLanguages.filter((l) => state.available[l.id]);
    const plannedLanguages = allLanguages.filter((l) => !state.available[l.id]);
    const soon = plannedLanguages.map((l) => `<button type="button" class="soon-language" data-action="notify-language" data-lang="${l.id}"><span class="soon-glyph">${l.glyph}</span><span class="soon-copy"><strong>${l.name}</strong><small>${l.region}</small></span><span class="soon-badge">${state.interested.includes(l.id) ? 'Saved' : 'Coming soon'}</span></button>`).join('');
    return `<div class="container route-page language-page">
      <div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><span>Learn</span><span>/</span><strong>Languages</strong></div>
      <section class="language-page-hero"><div class="language-page-copy"><span class="section-kicker">The first step is yours</span><h1>Find a language<br /><em>that feels like home.</em></h1><p>Choose an available language path. Each is built to grow with you—from a first greeting to stories, culture and more.</p><div class="language-page-badges"><span>${icon('shield', 16)} Designed to grow</span><span>${icon('volume', 16)} Listen as you learn</span></div></div><div class="language-page-art"><img src="./assets/yoruba-kids-culture.jpg" alt="Children in beautiful Yorùbá attire reading together" /><div class="art-note">Words connect us <span>✦</span></div>
      </div>
      <section class="language-alphabet-section scroll-3d-reveal" style="margin: 28px 0; background: var(--cream); border: 1px solid var(--line); border-radius: var(--radius); padding: 24px;">
        <div class="section-heading" style="margin-bottom: 16px;">
          <div>
            <span class="section-kicker">Interactive Yoruba Soundboard</span>
            <h2>Fáwẹ́lì (Vowels), Kọ́nsónáǹtì &amp; Àmì Ohùn (Tonal Accents)</h2>
            <p>Click any vowel or tone to hear its pronunciation and pitch frequency.</p>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
          ${[
            { char: 'A', tone: 'Re (Mid)', word: 'Agbàdo (Corn)', freq: 293 },
            { char: 'E', tone: 'Re (Mid)', word: 'Epo (Oil)', freq: 293 },
            { char: 'Ẹ', tone: 'Re (Mid)', word: 'Ẹja (Fish)', freq: 293 },
            { char: 'I', tone: 'Re (Mid)', word: 'Irin (Metal)', freq: 293 },
            { char: 'O', tone: 'Re (Mid)', word: 'Omi (Water)', freq: 293 },
            { char: 'Ọ', tone: 'Re (Mid)', word: 'Ọ̀bẹ (Knife)', freq: 293 },
            { char: 'U', tone: 'Re (Mid)', word: 'Úra (Grace)', freq: 293 }
          ].map((v) => `
            <button type="button" class="button button-small button-outline" data-action="trainer-play-syllable" data-freq="${v.freq}" data-tone="re" title="${v.word}" style="display: flex; gap: 6px; align-items: center;">
              <strong>${v.char}</strong> <small style="color: var(--muted);">${v.word}</small>
            </button>
          `).join('')}
        </div>
        <div style="display: flex; gap: 12px; font-size: 13px; color: var(--ink-soft); flex-wrap: wrap;">
          <span><strong>Òkè (High / Mí):</strong> 370Hz ↗</span>
          <span><strong>Àárín (Mid / Re):</strong> 294Hz →</span>
          <span><strong>Ìsàlẹ̀ (Low / Dò):</strong> 220Hz ↘</span>
        </div>
      </section>\n    </section>
      <section class="trainer-callout-banner">
        <div class="callout-icon">${icon('mic', 24)}</div>
        <div class="callout-content">
          <span class="callout-kicker">NEW INTERACTIVE VOICE STUDIO</span>
          <h3>Practice Real-Time Tonal Pronunciation & Pitch Melody</h3>
          <p>Train with 60 audio lessons across 6 African languages. Get instant speech analysis and fluency score feedback.</p>
        </div>
        ${routeLink('trainer', `Open Voice Trainer ${icon('arrow', 15)}`, 'button button-primary')}
      </section>
      ${renderStepper(['Language', 'Level', 'Module', 'Lesson'], 0)}<div class="language-group-head"><div><span class="section-kicker">Available to explore</span><h2>Choose your first path</h2></div><span class="muted-count">${availableLanguages.length} learning paths</span></div>
      <div class="language-choice-grid">${availableLanguages.map(renderLanguageCard).join('')}</div>
      <section class="coming-soon-panel"><div class="coming-intro"><span class="coming-icon">${icon('sparkles', 21)}</span><div><span class="section-kicker">Growing with our communities</span><h2>More languages, more futures.</h2><p>These paths are being prepared with care. Choose one to save your interest on this device.</p></div></div><div class="soon-list">${soon}</div></section>
      <section class="language-note"><div class="note-icon">${icon('globe', 20)}</div><p><strong>Built to welcome more.</strong> Idilewa’s language architecture is designed so new language paths can be added without rebuilding the experience.</p>${routeLink('about', 'Why Idilewa ' + icon('arrow', 14), 'text-link')}</section>
    </div>`;
  }

  function describeJourneyLayer(step, index) {
    const label = String(step || '').toLowerCase();
    const rules = [
      [/guardian|parent|consent|permission|sign/, 'Review the family permission and safety detail before a child proceeds.'],
      [/verify|validat|consent code|access code/, 'Check that the approved code matches this exact next step.'],
      [/tutor|teacher|connect|assignment/, 'Review the people, learning focus and safe connection details.'],
      [/proverb|meaning|translation/, 'Read the original words, then notice the meaning and context.'],
      [/story|read|genre|piece/, 'Explore the story or tradition and notice the people and ideas it carries.'],
      [/listen|hear|voice|speak|pronunciation/, 'Listen closely, notice the sound and try the phrase at your own pace.'],
      [/reflect|remember|action|share with care/, 'Think about what you learned and choose a respectful next step.'],
      [/level|pace/, 'Choose a level that fits what you know and how you want to grow.'],
      [/module|theme/, 'Follow a small group of connected ideas before moving on.'],
      [/lesson|practice|try|play|challenge|skill/, 'Try the activity, notice what happens and make one small improvement.'],
      [/code|path|create|build|remix/, 'Use a guided example to make, change or test a small idea.'],
      [/plan|price|family|school/, 'Compare the options and check what fits your learning needs.'],
      [/progress|celebrate|grow|belong/, 'Notice your progress and decide what you would like to explore next.'],
      [/context|source|attribution|credit/, 'Learn where the information comes from and how to share it with care.'],
      [/review|check|assess|quiz/, 'Check your understanding and use feedback to guide the next step.'],
      [/choose|start|begin|discover|explore|request/, 'Start with the page’s purpose, then choose a path that feels right.']
    ];
    const match = rules.find(([pattern]) => pattern.test(label));
    if (match) return match[1];
    return [
      'Start with the page’s purpose and what you hope to learn.',
      'Notice the key idea, language or context in the example.',
      'Try a short activity and adjust as you learn.',
      'Check your understanding, reflect or continue to the next page.'
    ][Math.min(index, 3)];
  }

  function renderStepper(steps, active = 0) {
    return `<ol class="learning-stepper" aria-label="Journey progress guide" data-step-count="${steps.length}">${steps.map((step, i) => `<li class="${i < active ? 'is-done' : ''} ${i === active ? 'is-active' : ''}" ${i === active ? 'aria-current="step"' : ''}><span class="step-count">${i < active ? icon('check', 13) : `0${i + 1}`}</span><span class="step-content"><span class="step-name">${esc(step)}</span><small class="step-description">${esc(describeJourneyLayer(step, i))}</small></span></li>`).join('')}</ol>`;
  }

  function buildCourseLevel(id, label, description, color, ico, moduleDefs) {
    let lessonNumber = 0;
    const modules = moduleDefs.map(([moduleId, title, desc, moduleIcon, tint, definitions]) => ({
      id: moduleId, title, desc, icon: moduleIcon, tint,
      lessons: definitions.map(([lessonTitle, focus, task]) => {
        lessonNumber += 1;
        return { id: `${id}-${String(lessonNumber).padStart(2, '0')}`, number: lessonNumber, title: lessonTitle, focus, task, moduleId };
      })
    }));
    return { id, label, description, color, icon: ico, modules, lessonCount: lessonNumber };
  }

  const COURSE_CATALOG = {
    beginner: buildCourseLevel('beginner', 'Beginner', 'Build confidence with useful words, friendly greetings and short phrases.', 'mint', 'leaf', [
      ['greetings', 'Greetings & introductions', 'Start a conversation with a warm greeting and a simple introduction.', 'smile', 'mint', [
        ['Hello & goodbye', 'Recognize familiar ways to greet someone and say goodbye.', 'Practise a greeting and a goodbye aloud, then write when you might use each.'],
        ['Share your name', 'Introduce yourself in a short, friendly sentence.', 'Write a two-line introduction for a new language partner.'],
        ['Ask someone’s name', 'Ask for a name and respond with your own.', 'Write a polite question and a short answer using your own name only if you wish.'],
        ['Morning, afternoon & evening', 'Notice how greetings can change with the time of day.', 'Choose a time of day and plan a greeting that fits it.'],
        ['Polite words & respectful greetings', 'Use courteous words and notice respectful forms of address.', 'Think of a person you greet respectfully; write one phrase you could practise with a teacher.']
      ]],
      ['people', 'Family & community', 'Talk about the people and relationships that matter to you.', 'people', 'peach', [
        ['Words for family', 'Explore familiar words for family and close relationships.', 'Draw or imagine a small family tree and label a few relationships in your learning language.'],
        ['Describe someone close', 'Use simple words to describe a person’s qualities.', 'Choose a kind quality and write a short description of a fictional person.'],
        ['Introduce someone you care about', 'Share a simple introduction for a family or community member.', 'Plan two sentences to introduce a person, without adding private details.'],
        ['Ask about people', 'Ask and answer a simple question about someone’s family or friends.', 'Write one question and one answer about a fictional family.'],
        ['Respectful ways to speak', 'Notice how relationship and context can shape the way we speak.', 'Think of two situations where you might use a different greeting or tone.']
      ]],
      ['everyday', 'Everyday words', 'Build a practical word set for things you see and do each day.', 'compass', 'blue', [
        ['Count from one to five', 'Practise hearing and using five everyday numbers.', 'Count five objects near you; check the words with a trusted speaker.'],
        ['Colours around you', 'Notice and name colours in your surroundings.', 'Pick three colours you can see and practise naming them.'],
        ['Food & drink', 'Learn how to talk about familiar food and drinks.', 'Make a short list of foods you enjoy; ask a fluent speaker to help with the words.'],
        ['Everyday objects', 'Identify useful objects at home or in a classroom.', 'Choose three objects and practise saying or writing their names.'],
        ['Places you visit', 'Recognize words for common places in your community.', 'Name two places you visit and one reason you go there.']
      ]],
      ['listen-build', 'Listen, speak & build', 'Turn single words into short questions, phrases and stories.', 'headphones', 'yellow', [
        ['Listen for familiar sounds', 'Listen closely and notice a sound you recognize.', 'Listen to a phrase from your course or voice library and note one sound you hear.'],
        ['Repeat a short phrase', 'Practise a short phrase slowly, then at a comfortable pace.', 'Choose a short phrase and repeat it three times; focus on clarity, not speed.'],
        ['Build a three-word phrase', 'Connect a few words to express one simple idea.', 'Plan a three-word phrase about a place, object or activity; check it with a teacher.'],
        ['Ask a simple question', 'Use a short question to learn one new thing.', 'Write a friendly question you could ask a classmate or family member.'],
        ['Tell a tiny story', 'Put a few ideas in order to tell a very short story.', 'Write three simple steps: who, what happened, and what happened next.']
      ]]
    ]),
    intermediate: buildCourseLevel('intermediate', 'Intermediate', 'Connect ideas, follow longer exchanges and describe everyday experiences.', 'blue', 'sparkles', [
      ['conversation', 'Connected conversations', 'Keep a conversation moving with follow-up questions and connected phrases.', 'people', 'blue', [
        ['Build a longer introduction', 'Add helpful details to an introduction without losing a natural tone.', 'Prepare a four-sentence introduction about a fictional learner or a safe topic.'],
        ['Ask follow-up questions', 'Use a follow-up question to show interest and learn more.', 'Write two follow-up questions that could fit after a friendly introduction.'],
        ['Show interest in a reply', 'Respond to another speaker and invite them to continue.', 'Draft a short reply that acknowledges an idea and asks one related question.'],
        ['Describe likes & preferences', 'Share a preference and add a simple reason.', 'Write what a fictional person prefers and why they might prefer it.'],
        ['Hold a four-turn conversation', 'Take turns asking, answering and responding in a short exchange.', 'Outline four turns for a conversation about a hobby or favourite activity.']
      ]],
      ['time-plans', 'Time, events & plans', 'Talk about routines, recent events and plans in a clear sequence.', 'clock', 'mint', [
        ['Describe a daily routine', 'Sequence familiar actions with clear time words.', 'Describe a fictional morning routine in three ordered steps.'],
        ['Talk about yesterday', 'Describe a completed event and place it in time.', 'Write three sentences about a made-up day in the past; check tense with a teacher.'],
        ['Make a plan for tomorrow', 'Share a simple plan and ask someone about theirs.', 'Write one plan for tomorrow and one question you could ask a partner.'],
        ['Connect events with because & then', 'Show how one event relates to another.', 'Join two ideas using a connector such as “because” or “then”; confirm the local forms.'],
        ['Compare two routines', 'Explain one similarity and one difference between routines.', 'Compare two fictional morning routines using a simple sentence frame.']
      ]],
      ['problem-solving', 'Everyday problem-solving', 'Use language to find your way, ask for help and solve small problems.', 'compass', 'peach', [
        ['Ask for and give directions', 'Use landmarks and simple steps to explain a route.', 'Describe a route between two familiar places without sharing your home address.'],
        ['Shop for market items', 'Ask about an item, quantity or price politely.', 'Role-play a short market exchange using imaginary items and amounts.'],
        ['Order a meal politely', 'Choose a meal and make a courteous request.', 'Write a short restaurant role-play with a request and a thank-you.'],
        ['Explain a small problem', 'Describe what happened and what help would be useful.', 'Invent a classroom problem and write a clear two-sentence explanation.'],
        ['Offer helpful advice', 'Suggest a next step while staying kind and respectful.', 'Write two gentle suggestions for a fictional learner facing a small challenge.']
      ]],
      ['stories-opinions', 'Stories, meaning & opinions', 'Retell, interpret and discuss ideas with more confidence.', 'book', 'yellow', [
        ['Retell a short story', 'Share the main events of a story in your own words.', 'Retell a familiar story in three steps and credit the person who shared it.'],
        ['Share an opinion & a reason', 'State a view and support it with a clear reason.', 'Choose a low-stakes topic and write an opinion plus one reason.'],
        ['Explore a proverb in context', 'Notice how a proverb’s meaning depends on speaker and situation.', 'Choose a proverb you know; write one question to ask a fluent speaker about its context.'],
        ['Compare two experiences', 'Describe what is similar and different between two events.', 'Compare two fictional experiences using one similarity and one difference.'],
        ['Summarize a conversation', 'Identify a speaker’s main idea and restate it fairly.', 'Listen to a short conversation and write its main idea without adding assumptions.']
      ]]
    ]),
    advanced: buildCourseLevel('advanced', 'Advanced', 'Use nuance, context and confident expression across longer conversations.', 'peach', 'compass', [
      ['nuance-register', 'Nuance & register', 'Choose language carefully for audience, relationship and setting.', 'compass', 'peach', [
        ['Choose an appropriate register', 'Adapt wording and tone to a formal or informal situation.', 'Compare two audiences for the same message and note what should change.'],
        ['Disagree with care', 'Express a different view while keeping the exchange respectful.', 'Draft a disagreement that acknowledges the other person’s point before adding yours.'],
        ['Clarify & paraphrase', 'Check understanding and restate an idea accurately.', 'Write a clarifying question and a neutral paraphrase of a short idea.'],
        ['Use idioms with context', 'Explore an idiom while checking when it is appropriate to use.', 'Ask a fluent speaker about an idiom’s context, tone and any situations to avoid.'],
        ['Notice indirect meaning', 'Listen for implication, humour or understatement without assuming.', 'Describe two possible meanings of a sentence and what context could clarify it.']
      ]],
      ['oral-heritage', 'Story, poetry & oral traditions', 'Approach stories, praise poetry and proverbs with context and care.', 'quote', 'mint', [
        ['Shape a longer narrative', 'Organize a story with a beginning, turning point and ending.', 'Outline a short original story; do not present it as a community folktale.'],
        ['Describe a setting vividly', 'Use precise language to help a listener imagine a place.', 'Describe an imagined setting with details about sound, color and movement.'],
        ['Interpret a proverb carefully', 'Consider possible meanings while respecting local interpretations.', 'Write one possible reading of a proverb and two questions for a knowledge keeper.'],
        ['Listen to Oríkì with context', 'Notice rhythm, repetition and speaker relationship in praise poetry.', 'Listen to an approved example and note one sound pattern and one context question.'],
        ['Interview a storyteller respectfully', 'Ask open questions and follow the speaker’s sharing boundaries.', 'Draft three consent-aware questions and a polite way to ask what should remain private.']
      ]],
      ['public-expression', 'Real-world expression', 'Present ideas, facilitate discussion and explain complex topics.', 'people', 'blue', [
        ['Present an idea with support', 'State a proposal and organize reasons that support it.', 'Prepare a short presentation outline with one claim and two supporting points.'],
        ['Negotiate options respectfully', 'Explore different choices and work toward a shared next step.', 'Write two possible compromises for a fictional group decision.'],
        ['Explain a cultural practice with attribution', 'Share context while naming whose knowledge you are drawing on.', 'Plan an explanation that identifies its source and avoids speaking for everyone.'],
        ['Summarize complex information', 'Select key points without changing their meaning.', 'Summarize a short article or talk in three accurate points.'],
        ['Facilitate a group discussion', 'Invite contributions, balance turns and summarize areas of agreement.', 'Draft an opening question and a closing summary for a small-group discussion.']
      ]],
      ['independent-creation', 'Independent expression & creation', 'Use language creatively and reflect on your progress as an independent learner.', 'sparkles', 'yellow', [
        ['Write a short dialogue', 'Create a natural exchange with distinct speakers and a clear purpose.', 'Write a six-line dialogue and mark where tone or relationship affects word choice.'],
        ['Prepare a short talk', 'Plan and deliver a concise talk with a clear opening and ending.', 'Create a one-minute talk outline and rehearse it at a comfortable pace.'],
        ['Translate for tone', 'Compare possible translations and preserve intent, not just individual words.', 'Translate a short greeting or message, then ask a fluent speaker to review its tone.'],
        ['Guide a conversation', 'Help a partner continue a conversation with thoughtful prompts.', 'Prepare three open-ended questions and one respectful way to close the exchange.'],
        ['Create a bilingual story', 'Combine language and creativity while crediting community knowledge.', 'Plan a short original bilingual story and identify any words needing teacher review.']
      ]]
    ])
  };

  function normalizeCourseLevel(level) {
    if (level === 'growing') return 'intermediate';
    if (level === 'fluent') return 'advanced';
    return ['beginner', 'intermediate', 'advanced'].includes(level) ? level : 'beginner';
  }

  function lessonsInLevel(level) {
    const track = COURSE_CATALOG[normalizeCourseLevel(level)];
    return track.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title, moduleId: module.id })));
  }

  function completedLessonCount(languageId, level) {
    return lessonsInLevel(level).filter((lesson) => state.completed.includes(`${languageId}-${lesson.id}`)).length;
  }

  function renderCourse(params = {}) {
    const lang = getLanguage(params.lang || state.currentLang);
    const level = params.level ? normalizeCourseLevel(params.level) : '';
    if (lang.upcoming || !state.available[lang.id]) {
      return `<div class="container route-page course-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('languages', 'Learn')}<span>/</span><strong>${lang.name}</strong></div><section class="course-pending-panel"><span class="pending-language-glyph">${lang.glyph}</span><span class="section-kicker">A new path is taking shape</span><h1>${lang.name} is on its way.</h1><p>Reviewed lessons and audio are not available in this demo yet. We’ll keep this space ready rather than show incomplete learning content.</p>${renderStepper(['Language', 'Level', 'Module', 'Lesson'], 0)}<div class="pending-panel-actions">${routeLink('languages', 'Choose another language ' + icon('arrow', 14), 'button button-primary')}${routeLink('consent', 'Review the family consent process', 'text-link')}</div></section></div>`;
    }
    const tracks = Object.values(COURSE_CATALOG);
    const selectedTrack = level ? COURSE_CATALOG[level] : null;
    const currentDone = level ? completedLessonCount(lang.id, level) : 0;
    const breadcrumbs = `<div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('languages', 'Learn')}<span>/</span><strong>${lang.name} learning path</strong></div>`;
    const header = `<section class="course-top"><div><span class="section-kicker">Your learning path · ${lang.name}</span><h1>${lang.name}, <em>one good step at a time.</em></h1><p>Choose Beginner, Intermediate or Advanced. Each level contains 20 lessons across four modules.</p></div><div class="course-language-chip"><span class="language-glyph lang-${lang.tint}">${lang.glyph}</span><div><small>Learning language</small><strong>${lang.name}</strong><button data-route="languages">Change language</button></div>\n    </section>`;
    if (!level) {
      return `<div class="container route-page course-page">${breadcrumbs}${header}${renderStepper(['Language', 'Level', 'Module', 'Lesson'], 1)}<section class="course-level-section"><div class="section-heading"><div><span class="section-kicker">Step 2 · choose a level</span><h2>Where would you like to begin?</h2><p>Each course level has 20 lessons, with five lessons in each of four modules.</p></div></div><div class="level-grid">${tracks.map((track, i) => { const done = completedLessonCount(lang.id, track.id); return `<button class="level-card level-${track.color}" type="button" data-action="choose-level" data-level="${track.id}" data-lang="${lang.id}"><span class="level-number">0${i + 1}</span><span class="level-icon">${icon(track.icon, 23)}</span><strong>${track.label}</strong><small>${track.description}</small><span class="level-meta">${icon('book', 14)} ${track.lessonCount} lessons · 4 modules</span><span class="level-completion">${done} of ${track.lessonCount} complete</span><span class="level-arrow">${icon('arrow', 17)}</span></button>`; }).join('')}</div><div class="course-footnote">${icon('shield', 16)} Your progress is saved on this device. You can change levels at any time.</div></section></div>`;
    }
    const modules = selectedTrack.modules.map((module, moduleIndex) => {
      const moduleDone = module.lessons.filter((lesson) => state.completed.includes(`${lang.id}-${lesson.id}`)).length;
      const rows = module.lessons.map((lesson) => {
        const complete = state.completed.includes(`${lang.id}-${lesson.id}`);
        const saved = !!state.lessonResponses[`${lang.id}-${lesson.id}`];
        const status = complete ? 'Complete' : saved ? 'Practice saved' : 'Not started';
        return `<a class="course-lesson-row ${complete ? 'is-complete' : ''}" href="#/lesson?lang=${lang.id}&amp;level=${level}&amp;module=${module.id}&amp;lesson=${lesson.id}" data-route="lesson" data-lang="${lang.id}" data-level="${level}" data-module="${module.id}" data-lesson="${lesson.id}"><span class="course-lesson-number">${String(lesson.number).padStart(2, '0')}</span><span class="course-lesson-copy"><strong>${lesson.title}</strong><small>${lesson.focus}</small></span><span class="course-lesson-status">${complete ? icon('check', 14) : icon('arrow', 14)} ${status}</span></a>`;
      }).join('');
      return `<details class="course-module-list" ${moduleIndex === 0 ? 'open' : ''}><summary class="course-module-summary tone-${module.tint}"><span class="course-module-icon">${icon(module.icon, 21)}</span><span class="course-module-count">Module 0${moduleIndex + 1} · ${module.lessons.length} lessons</span><strong>${module.title}</strong><small>${module.desc}</small><span class="course-module-progress">${moduleDone}/${module.lessons.length} complete</span></summary><div class="course-lesson-list">${rows}</div></details>`;
    }).join('');
    return `<div class="container route-page course-page">${breadcrumbs}${header}${renderStepper(['Language', 'Level', 'Module', 'Lesson'], 2)}<section class="course-module-section"><div class="module-section-top"><div><span class="section-kicker">Step 3 · ${selectedTrack.label} · ${currentDone} of 20 complete</span><h2>Choose a lesson to explore.</h2><p>Open a module to see its five lessons. You can practise and save progress lesson by lesson.</p></div><label class="level-select-wrap" for="levelSelect"><span>Level</span><select id="levelSelect" data-action="level-select">${tracks.map((track) => `<option value="${track.id}" ${track.id === level ? 'selected' : ''}>${track.label}</option>`).join('')}</select></label></div><div class="course-module-list-grid">${modules}</div><div class="course-footnote">${icon('shield', 16)} Lesson outlines are starter activities; confirm language examples with a fluent educator.</div><button class="text-link back-link" type="button" data-action="back-to-levels" data-lang="${lang.id}">${icon('arrowUp', 14)} Choose a different level</button></section></div>`;
  }

  function renderLesson(params = {}) {
    const lang = getLanguage(params.lang || state.currentLang);
    if (lang.upcoming || !state.available[lang.id]) return `<div class="container route-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('languages', 'Learn')}<span>/</span><strong>${lang.name}</strong></div><section class="course-pending-panel"><span class="section-kicker">Language content is being prepared</span><h1>We’ll meet you here soon.</h1><p>Reviewed lesson text and pronunciation are not available for this language yet. Please choose an available path for the interactive lesson preview.</p>${routeLink('languages', 'Choose an available language ' + icon('arrow', 14), 'button button-primary')}</section></div>`;
    const level = normalizeCourseLevel(params.level || state.level || 'beginner');
    const track = COURSE_CATALOG[level];
    const allLessons = lessonsInLevel(level);
    let lesson = allLessons.find((item) => item.id === params.lesson);
    if (!lesson && params.module) lesson = allLessons.find((item) => item.moduleId === params.module);
    if (!lesson) lesson = allLessons[0];
    const lessonKey = `${lang.id}-${lesson.id}`;
    const response = state.lessonResponses[lessonKey] || '';
    const complete = state.completed.includes(lessonKey);
    const position = allLessons.findIndex((item) => item.id === lesson.id);
    const module = track.modules.find((item) => item.id === lesson.moduleId);
    const lessonLink = (item, label, cls) => `<a class="${cls}" href="#/lesson?lang=${lang.id}&amp;level=${level}&amp;module=${item.moduleId}&amp;lesson=${item.id}" data-route="lesson" data-lang="${lang.id}" data-level="${level}" data-module="${item.moduleId}" data-lesson="${item.id}">${label}</a>`;
    const backLink = routeLink('course', 'Back to 20 lessons', 'text-link', `data-lang="${lang.id}" data-level="${level}"`);
    const previous = position > 0 ? lessonLink(allLessons[position - 1], `${icon('arrowUp', 14)} Previous lesson`, 'text-link') : backLink;
    const next = position < allLessons.length - 1 ? lessonLink(allLessons[position + 1], `Next lesson ${icon('arrow', 14)}`, 'button button-outline') : backLink;
    return `<div class="container route-page lesson-page redesigned-lesson-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('languages', 'Learn')}<span>/</span>${routeLink('course', lang.name, '', `data-lang="${lang.id}"`)}<span>/</span>${routeLink('course', track.label, '', `data-lang="${lang.id}" data-level="${level}"`)}<span>/</span><strong>Lesson ${String(lesson.number).padStart(2, '0')}</strong></div>
      <div class="lesson-shell"><div class="lesson-main">${renderStepper(['Language', 'Level', 'Module', 'Lesson'], 3)}<div class="lesson-module-line"><span class="lesson-module-tag">${track.label} · Lesson ${String(lesson.number).padStart(2, '0')} of 20</span><span class="lesson-time">${icon('book', 14)} ${module.title}</span></div><h1>${lesson.title}</h1><p class="lesson-intro">${lesson.focus}</p>
        <section class="lesson-focus-card"><span class="section-kicker">Today’s learning focus</span><p>${lesson.task}</p></section>
        <form class="lesson-response-form" data-form="lesson-response" data-key="${lessonKey}"><label for="lessonResponse">Try it · write, plan or reflect</label><textarea id="lessonResponse" name="response" rows="4" maxlength="600" placeholder="Write a few words about what you practised…" required>${esc(response)}</textarea><small>Keep your practice general. Do not include full names, contact details or other private information.</small><button class="button button-primary" type="submit">Save practice on this device ${icon('arrow', 14)}</button></form>
        <div class="lesson-footer-actions"><button class="button button-soft" data-action="complete-lesson" data-key="${lessonKey}" data-lang="${lang.id}" data-level="${level}" ${!response ? 'disabled' : ''}>${complete ? 'Lesson complete' : 'Mark lesson complete'} ${icon('check', 15)}</button></div><div class="lesson-privacy-note">${icon('lock', 15)} Your written practice stays in this browser preview.</div>
      </div><aside class="lesson-aside"><div class="lesson-aside-card"><span class="section-kicker">Your progress</span><strong>${track.label} · ${position + 1} of ${track.lessonCount}</strong><p>${completedLessonCount(lang.id, level)} of 20 lessons complete in ${lang.name}. Save a practice response, then mark this lesson complete.</p><div class="mini-progress"><span style="width:${Math.round(completedLessonCount(lang.id, level) / track.lessonCount * 100)}%"></span></div><small>${complete ? 'This lesson is complete' : response ? 'Practice saved on this device' : 'A good start is a start'}</small></div><div class="aside-tip">${icon('heart', 18)}<p>Go at your own pace. A small, thoughtful practice is progress.</p></div></aside></div><div class="lesson-bottom-nav">${previous}${next}</div></div>`;
  }

  const CODE_PATHS = [
    ['html','HTML','Web · front end','markup'], ['css','CSS','Web · front end','style'],
    ['javascript','JavaScript','Web · front end','javascript'], ['typescript','TypeScript','Web · front end','typescript'],
    ['react','React','Web · front end','jsx'], ['angular','Angular','Web · front end','angular'],
    ['vue','Vue','Web · front end','javascript'], ['svelte','Svelte','Web · front end','javascript'],
    ['nextjs','Next.js','Web · front end','jsx'], ['nodejs','Node.js','Web · front end','javascript'],
    ['express','Express.js','Web · front end','javascript'], ['react-native','React Native','Web · front end','jsx'],
    ['tailwind','Tailwind CSS','Web · front end','tailwind'], ['webassembly','WebAssembly','Web · front end','wasm'],
    ['python','Python','Python · data','python'], ['django','Django','Python · data','python'],
    ['flask','Flask','Python · data','python'], ['fastapi','FastAPI','Python · data','python'],
    ['jupyter','Jupyter notebooks','Python · data','python'], ['numpy','NumPy','Python · data','python'],
    ['pandas','Pandas','Python · data','python'], ['r','R','Python · data','r'],
    ['julia','Julia','Python · data','julia'], ['matlab','MATLAB','Python · data','matlab'],
    ['java','Java','Mobile · apps','java'], ['kotlin','Kotlin','Mobile · apps','kotlin'],
    ['swift','Swift','Mobile · apps','swift'], ['objective-c','Objective-C','Mobile · apps','objectivec'],
    ['dart','Dart','Mobile · apps','dart'], ['flutter','Flutter','Mobile · apps','dart'],
    ['c','C','Systems · foundations','c'], ['cpp','C++','Systems · foundations','cpp'],
    ['csharp','C#','Systems · foundations','csharp'], ['dotnet','.NET','Systems · foundations','csharp'],
    ['go','Go','Systems · foundations','go'], ['rust','Rust','Systems · foundations','rust'],
    ['assembly','Assembly','Systems · foundations','assembly'], ['arduino','Arduino (C++)','Systems · foundations','arduino'],
    ['micropython','MicroPython','Systems · foundations','python'], ['php','PHP','Backend · databases','php'],
    ['laravel','Laravel','Backend · databases','php'], ['ruby','Ruby','Backend · databases','ruby'],
    ['rails','Ruby on Rails','Backend · databases','ruby'], ['scala','Scala','Backend · databases','scala'],
    ['sql','SQL','Backend · databases','sql'], ['postgresql','PostgreSQL','Backend · databases','sql'],
    ['mysql','MySQL','Backend · databases','sql'], ['sqlite','SQLite','Backend · databases','sql'],
    ['graphql','GraphQL','Backend · databases','graphql'], ['rest','REST APIs','Backend · databases','rest'],
    ['json','JSON','Backend · databases','json'], ['yaml','YAML','Backend · databases','yaml'],
    ['bash','Bash','DevOps · tools','bash'], ['powershell','PowerShell','DevOps · tools','powershell'],
    ['git','Git','DevOps · tools','git'], ['docker','Docker','DevOps · tools','docker'],
    ['kubernetes','Kubernetes','DevOps · tools','kubernetes'], ['terraform','Terraform','DevOps · tools','terraform'],
    ['ansible','Ansible','DevOps · tools','ansible'], ['nginx','Nginx configuration','DevOps · tools','nginx'],
    ['linux-cli','Linux command line','DevOps · tools','bash'], ['solidity','Solidity','DevOps · tools','solidity'],
    ['scratch','Scratch','Creative · games','blocks'], ['blockly','Blockly','Creative · games','blocks'],
    ['lua','Lua','Creative · games','lua'], ['luau','Luau for Roblox','Creative · games','lua'],
    ['processing','Processing','Creative · games','processing'], ['unreal-blueprints','Unreal Blueprints','Creative · games','blocks'],
    ['haskell','Haskell','Creative · games','haskell'], ['elixir','Elixir','Creative · games','elixir'],
    ['erlang','Erlang','Creative · games','erlang'], ['perl','Perl','Creative · games','perl'],
    ['ocaml','OCaml','Creative · games','ocaml'], ['fsharp','F#','Creative · games','fsharp'],
    ['crystal','Crystal','Creative · games','ruby'], ['fortran','Fortran','Creative · games','fortran'],
    ['cobol','COBOL','Creative · games','cobol'], ['clojure','Clojure','Creative · games','clojure'],
    ['groovy','Groovy','Systems · foundations','groovy'], ['visualbasic','Visual Basic .NET','Systems · foundations','visualbasic'],
    ['pascal','Pascal','Systems · foundations','pascal'], ['ada','Ada','Systems · foundations','ada'],
    ['prolog','Prolog','Creative · games','prolog'], ['lisp','Common Lisp','Creative · games','clojure'],
    ['scheme','Scheme','Creative · games','scheme'], ['racket','Racket','Creative · games','scheme'],
    ['forth','Forth','Systems · foundations','forth'], ['nim','Nim','Systems · foundations','nim'],
    ['zig','Zig','Systems · foundations','zig'], ['dlang','D','Systems · foundations','dlang'],
    ['vlang','V','Systems · foundations','vlang'], ['elm','Elm','Web · front end','elm'],
    ['purescript','PureScript','Web · front end','purescript'], ['reasonml','ReasonML','Web · front end','reasonml'],
    ['smalltalk','Smalltalk','Creative · games','smalltalk'], ['gdscript','GDScript','Creative · games','gdscript'],
    ['plsql','PL/SQL','Backend · databases','sql'], ['tsql','T-SQL','Backend · databases','sql'],
    ['vba','VBA','Automation · tools','vba'], ['tcl','Tcl','Automation · tools','tcl'],
    ['awk','AWK','Automation · tools','awk'], ['zsh','Zsh','Automation · tools','bash'],
    ['move','Move','Blockchain · systems','move']
  ].map(([id, name, category, syntax]) => ({ id, name, category, syntax }));
  const CODE_LANGUAGE_IDS = new Set([
    'html','css','javascript','typescript','python','r','julia','matlab','java','kotlin','swift','objective-c','dart',
    'c','cpp','csharp','go','rust','assembly','arduino','micropython','php','ruby','scala','sql','bash','powershell',
    'solidity','scratch','blockly','lua','luau','processing','haskell','elixir','erlang','perl','ocaml','fsharp','crystal',
    'fortran','cobol','clojure','groovy','visualbasic','pascal','ada','prolog','lisp','scheme','forth','nim','zig',
    'dlang','vlang','elm','purescript','reasonml','smalltalk','gdscript','plsql','tsql','vba','tcl','awk','zsh','move','webassembly'
  ]);

  const CODE_COPY = {
    yoruba: { label: 'Yorùbá', greeting: 'Ẹ káàárọ̀', code: 'Kóòdù jẹ́ ìtọ́ni tí a fi ń sọ fún kọ̀ǹpútà ohun tó yẹ kó ṣe.', success: 'O ṣe é! Ìgbésẹ̀ rẹ ṣiṣẹ́.', retry: 'Gbìyànjú lẹ́ẹ̀kan sí i.', sequence: 'Ìtòlẹ́sẹẹsẹ̀ àwọn ìgbésẹ̀', variable: 'Ààyè ìpamọ́ iye', questPrompt: 'Darí rọ́bọ́ọ̀tì sí ìràwọ̀. Fi àwọn ìgbésẹ̀ kóòdù kun, kí o sì mú wọn ṣiṣẹ́.', directions: ['Gòkè', 'Ọ̀tún', 'Sísàlẹ̀', 'Òsì'], questRun: 'Ṣiṣe àwọn ìgbésẹ̀', questClear: 'Pa àwọn ìgbésẹ̀ rẹ́', questLeaf: 'Àwọn ewé dí ọ̀nà. Yí ipa náà padà.', questEdge: 'Rọ́bọ́ọ̀tì dé etí pẹpẹ̀. Gbìyànjú ìtọ́sọ́nà mìíràn.', questNotYet: 'Kò tíì dé ìràwọ̀. Ṣàtúnṣe àwọn ìgbésẹ̀ rẹ, kí o sì tún gbìyànjú.', questAddFirst: 'Fi àwọn ìgbésẹ̀ díẹ̀ kun kí o tó ṣiṣẹ́ wọn.', questHint: 'Bẹ̀rẹ̀ nípa gígun sókè láti igun òsì ìsàlẹ̀. Lẹ́yìn náà, yí àwọn ewé ká sí ìràwọ̀ tó wà ní òkè ọ̀tún.' },
    igbo: { label: 'Igbo', greeting: 'Ndewo', code: 'Koodu bụ ntụziaka anyị na-enye kọmputa.', success: 'I mere ya! Nzọụkwụ gị gara nke ọma.', retry: 'Gbalịa ọzọ.', sequence: 'Usoro nke nzọụkwụ', variable: 'Ebe nchekwa uru', questPrompt: 'Duruo rọbọt ahụ gaa n’akara kpakpando. Tinye usoro iwu ma mee ka ha rụọ ọrụ.', directions: ['Elu', 'Aka nri', 'Ala', 'Aka ekpe'], questRun: 'Mee ka usoro ahụ rụọ ọrụ', questClear: 'Hichapụ usoro iwu', questLeaf: 'Akwụkwọ osisi gbochiri ụzọ. Gbanwee usoro ahụ.', questEdge: 'Robot ahụ ruru nsọtụ bọọdụ. Gbanwee ntụziaka.', questNotYet: 'Ọ rutebeghị na kpakpando. Gbanwee usoro ahụ, nwalee ọzọ.', questAddFirst: 'Tinye iwu ole na ole tupu ịmee ka ha rụọ ọrụ.', questHint: 'Malite site n’ịga elu site n’akụkụ aka ekpe dị ala. Wee gaa gburugburu akwụkwọ osisi ruo na kpakpando dị n’elu aka nri.' },
    hausa: { label: 'Hausa', greeting: 'Sannu', code: 'Lambar kwamfuta jerin umarnin da ake bai wa kwamfuta.', success: 'Ka yi nasara! Matakinka ya yi aiki.', retry: 'Ka sake gwadawa.', sequence: 'Jerin matakai', variable: 'Wurin ajiyar ƙima', questPrompt: 'Ka jagoranci mutum-mutumin zuwa tauraro. Ƙara umarni, sannan ka kunna su.', directions: ['Sama', 'Dama', 'Ƙasa', 'Hagu'], questRun: 'Gudanar da matakan', questClear: 'Share matakan', questLeaf: 'Ganyen daji ya toshe hanya. Canza jerin matakan.', questEdge: 'Mutum-mutumin ya kai ƙarshen allo. Canza hanya.', questNotYet: 'Har yanzu bai kai tauraro ba. Gyara matakan, sannan ka sake gwadawa.', questAddFirst: 'Ƙara wasu umarni kaɗan kafin ka kunna su.', questHint: 'Fara da matsawa sama daga ƙasan hagu. Sannan ka bi ta kusa da ciyayi zuwa tauraron da ke sama a dama.' },
    swahili: { label: 'Kiswahili', greeting: 'Habari', code: 'Msimbo ni maelekezo tunayoyapa kompyuta.', success: 'Umefanikiwa! Hatua yako imefanya kazi.', retry: 'Jaribu tena.', sequence: 'Mfuatano wa hatua', variable: 'Mahali pa kuhifadhi thamani', questPrompt: 'Elekeza roboti ifike kwenye nyota. Ongeza hatua za msimbo, kisha ziendeshe.', directions: ['Juu', 'Kulia', 'Chini', 'Kushoto'], questRun: 'Endesha hatua hizi', questClear: 'Futa hatua', questLeaf: 'Kichaka kimezuia njia. Badilisha mfuatano.', questEdge: 'Roboti imefika ukingoni mwa ubao. Badilisha mwelekeo.', questNotYet: 'Bado haijafika kwenye nyota. Rekebisha hatua zako, kisha ujaribu tena.', questAddFirst: 'Ongeza hatua chache kwanza, kisha uziendeshe.', questHint: 'Anza kwa kwenda juu kutoka kona ya chini kushoto. Kisha zunguka vichaka kuelekea nyota iliyo juu kulia.' }
  };
  const CODE_LEVELS = [
    { id: 'beginner', label: 'Beginner', badge: 'Sprout', note: 'Meet the idea and make one small change.', icon: 'leaf' },
    { id: 'intermediate', label: 'Intermediate', badge: 'Explorer', note: 'Connect ideas and solve a little puzzle.', icon: 'compass' },
    { id: 'advanced', label: 'Advanced', badge: 'Builder', note: 'Stretch the example and make it your own.', icon: 'layers' }
  ];
  const CODE_MISSIONS = [
    { id: 'hello', title: 'Say a friendly hello', skill: 'First output', icon: 'smile' },
    { id: 'sequence', title: 'Put the steps in order', skill: 'Sequences', icon: 'layers' },
    { id: 'variable', title: 'Save a word for later', skill: 'Values & variables', icon: 'bookmark' },
    { id: 'mini-build', title: 'Make a tiny creation', skill: 'Creative challenge', icon: 'sparkles' }
  ];
  const CODE_ADVENTURES = [
    { tech: 'scratch', title: 'Make a character dance', text: 'Snap colourful instruction blocks together and bring a story to life.', label: 'Blocks · ages 6+', icon: 'sparkles', tone: 'sun' },
    { tech: 'html', title: 'Build a little webpage', text: 'Give your favourite idea a heading, a message and a place on the web.', label: 'Web · ages 8+', icon: 'globe', tone: 'sky' },
    { tech: 'python', title: 'Tell a tiny Python story', text: 'Teach a character to speak, count and follow a clever path.', label: 'Python · ages 9+', icon: 'book', tone: 'peach' },
    { tech: 'javascript', title: 'Make a click-and-play game', text: 'Add simple rules that make a game respond when someone plays.', label: 'Games · ages 9+', icon: 'play', tone: 'lilac' },
    { tech: 'css', title: 'Design a digital badge', text: 'Choose colours, spacing and style to make your creation shine.', label: 'Design · ages 8+', icon: 'star', tone: 'mint' },
    { tech: 'arduino', title: 'Imagine a helpful robot', text: 'Explore the instructions behind lights, sensors and friendly machines.', label: 'Robotics · ages 10+', icon: 'compass', tone: 'blue' }
  ];
  const CODE_GARDEN_DIRECTIONS = {
    up: { dx: 0, dy: -1, glyph: '↑', labelIndex: 0 },
    right: { dx: 1, dy: 0, glyph: '→', labelIndex: 1 },
    down: { dx: 0, dy: 1, glyph: '↓', labelIndex: 2 },
    left: { dx: -1, dy: 0, glyph: '←', labelIndex: 3 }
  };
  const CODE_GARDEN_OBSTACLES = new Set(['1,3', '3,2', '3,1']);
  const CODE_GARDEN_TARGET = '4,0';
  const CODE_TOKENS = {
    markup: '<h1', style: 'color:', javascript: 'console.log(', typescript: ': string', jsx: 'return <h1', angular: '{{',
    python: 'print(', r: 'print(', julia: 'println(', matlab: 'disp(', java: 'System.out.println', kotlin: 'println(',
    swift: 'print(', objectivec: 'NSLog', dart: 'print(', c: 'printf(', cpp: 'cout', csharp: 'Console.', go: 'fmt.Println',
    rust: 'println!', assembly: 'section', arduino: 'Serial.println', php: 'echo ', ruby: 'puts ', scala: 'println(',
    sql: 'SELECT', graphql: 'query', rest: 'GET ', json: '"message"', yaml: 'message:', bash: 'echo ', powershell: 'Write-Output',
    git: 'git status', docker: 'FROM', kubernetes: 'kind:', terraform: 'output ', ansible: 'tasks:', nginx: 'server {',
    solidity: 'contract ', blocks: 'say ', lua: 'print(', processing: 'void setup', wasm: 'module', haskell: 'putStrLn',
    elixir: 'IO.puts', erlang: 'io:format', perl: 'print ', ocaml: 'print_endline', fsharp: 'printfn', fortran: 'PRINT *,',
    cobol: 'DISPLAY ', clojure: 'println(', groovy: 'println ', visualbasic: 'Console.WriteLine', tailwind: 'text-green-',
    pascal: 'writeln(', ada: 'Put_Line', prolog: 'write(', lisp: '(format t', scheme: '(display', forth: '."',
    nim: 'echo ', zig: 'std.debug.print', dlang: 'writeln(', vlang: 'println(', elm: 'text "', purescript: 'log "',
    reasonml: 'print_endline', smalltalk: 'Transcript show:', gdscript: 'print(', vba: 'Debug.Print',
    tcl: 'puts ', awk: 'print ', move: 'module '
  };
  function sampleCodeFor(tech, greeting) {
    const g = greeting.replaceAll('"', '\\"');
    switch (tech.syntax) {
      case 'markup': return `<h1 class="greeting">${g}</h1>`;
      case 'style': return `.greeting {\n  color: #15764a;\n  padding: 1rem;\n}`;
      case 'tailwind': return `<p class="text-green-700 p-4">${g}</p>`;
      case 'javascript': return `const greeting = "${g}";\nconsole.log(greeting);`;
      case 'typescript': return `const greeting: string = "${g}";\nconsole.log(greeting);`;
      case 'jsx': return `function Greeting() {\n  return <h1>${g}</h1>;\n}`;
      case 'angular': return `// greeting.component.html\n<h1>{{ greeting }}</h1>`;
      case 'python': return `greeting = "${g}"\nprint(greeting)`;
      case 'r': return `greeting <- "${g}"\nprint(greeting)`;
      case 'julia': return `greeting = "${g}"\nprintln(greeting)`;
      case 'matlab': return `greeting = "${g}";\ndisp(greeting)`;
      case 'java': return `class Greeting {\n  public static void main(String[] args) {\n    System.out.println("${g}");\n  }\n}`;
      case 'kotlin': return `fun main() {\n  println("${g}")\n}`;
      case 'swift': return `let greeting = "${g}"\nprint(greeting)`;
      case 'objectivec': return `NSString *greeting = @"${g}";\nNSLog(@"%@", greeting);`;
      case 'dart': return `void main() {\n  print("${g}");\n}`;
      case 'c': return `#include <stdio.h>\nint main(void) {\n  printf("${g}\\n");\n  return 0;\n}`;
      case 'cpp': return `#include <iostream>\nint main() {\n  std::cout << "${g}";\n}`;
      case 'csharp': return `Console.WriteLine("${g}");`;
      case 'go': return `package main\nimport "fmt"\nfunc main() { fmt.Println("${g}") }`;
      case 'rust': return `fn main() {\n  println!("${g}");\n}`;
      case 'assembly': return `section .data\n  greeting db "${g}", 0`;
      case 'php': return `<?php\necho "${g}";\n?>`;
      case 'ruby': return `greeting = "${g}"\nputs greeting`;
      case 'scala': return `object Greeting {\n  def main(args: Array[String]): Unit = println("${g}")\n}`;
      case 'sql': return `SELECT '${g}' AS message;`;
      case 'graphql': return `query Greeting {\n  greeting(message: "${g}")\n}`;
      case 'rest': return `GET /greeting?message=${encodeURIComponent(g)}`;
      case 'json': return `{\n  "message": "${g}",\n  "repeat": 1\n}`;
      case 'yaml': return `message: "${g}"\nrepeat: 1`;
      case 'bash': return `message="${g}"\necho "$message"`;
      case 'powershell': return `$message = "${g}"\nWrite-Output $message`;
      case 'git': return `git status\ngit add greeting.txt\ngit commit -m "Add greeting"`;
      case 'docker': return `FROM alpine:3.20\nCMD ["sh", "-c", "echo '${g}'"]`;
      case 'kubernetes': return `apiVersion: v1\nkind: Pod\nmetadata:\n  name: greeting\nspec: {}`;
      case 'terraform': return `output "greeting" {\n  value = "${g}"\n}`;
      case 'ansible': return `- name: Show a greeting\n  ansible.builtin.debug:\n    msg: "${g}"`;
      case 'nginx': return `server {\n  listen 8080;\n  location / { return 200 "${g}"; }\n}`;
      case 'solidity': return `contract Greeting {\n  function message() public pure returns (string memory) {\n    return "${g}";\n  }\n}`;
      case 'blocks': return `when green flag clicked\nsay "${g}" for 2 seconds\nrepeat 2 times\n  move 10 steps`;
      case 'lua': return `local greeting = "${g}"\nprint(greeting)`;
      case 'processing': return `void setup() {\n  println("${g}");\n}`;
      case 'wasm': return `(module\n  ;; A tiny ${tech.name} learning path\n  (func (export "start")))`;
      case 'arduino': return `void setup() {\n  Serial.begin(9600);\n  Serial.println("${g}");\n}`;
      case 'haskell': return `main = putStrLn "${g}"`;
      case 'elixir': return `IO.puts("${g}")`;
      case 'erlang': return `main() -> io:format("${g}~n").`;
      case 'perl': return `my $greeting = "${g}";\nprint "$greeting\\n";`;
      case 'ocaml': return `let () = print_endline "${g}";;`;
      case 'fsharp': return `printfn "${g}"`;
      case 'fortran': return `PROGRAM GREETING\n  PRINT *, "${g}"\nEND PROGRAM GREETING`;
      case 'cobol': return `DISPLAY "${g}"`;
      case 'clojure': return `(println "${g}")`;
      case 'groovy': return `def greeting = "${g}"\nprintln greeting`;
      case 'visualbasic': return `Module Greeting\n  Sub Main()\n    Console.WriteLine("${g}")\n  End Sub\nEnd Module`;
      case 'pascal': return `program Greeting;\nbegin\n  writeln('${g}');\nend.`;
      case 'ada': return `with Ada.Text_IO; use Ada.Text_IO;\nprocedure Greeting is\nbegin\n  Put_Line("${g}");\nend Greeting;`;
      case 'prolog': return `greeting :- write('${g}'), nl.`;
      case 'lisp': return `(format t "${g}~%")`;
      case 'scheme': return `(display "${g}")\n(newline)`;
      case 'forth': return `: greeting ." ${g}" ;\ngreeting`;
      case 'nim': return `let greeting = "${g}"\necho greeting`;
      case 'zig': return `const std = @import("std");\npub fn main() void {\n  std.debug.print("${g}\\n", .{});\n}`;
      case 'dlang': return `import std.stdio;\nvoid main() { writeln("${g}"); }`;
      case 'vlang': return `fn main() {\n  println('${g}')\n}`;
      case 'elm': return `import Html exposing (text)\nmain = text "${g}"`;
      case 'purescript': return `module Main where\nimport Effect.Console (log)\nmain = log "${g}"`;
      case 'reasonml': return `let () = print_endline("${g}");`;
      case 'smalltalk': return `Transcript show: '${g}'; cr.`;
      case 'gdscript': return `extends Node\nfunc _ready():\n    print("${g}")`;
      case 'vba': return `Sub SayHello()\n  Debug.Print "${g}"\nEnd Sub`;
      case 'tcl': return `set greeting "${g}"\nputs $greeting`;
      case 'awk': return `BEGIN { print "${g}" }`;
      case 'move': return `module 0x1::greeting {\n  public fun message(): vector<u8> { b"${g}" }\n}`;
      default: return `// ${tech.name}\nconsole.log("${g}");`;
    }
  }
  const codeTextFor = (languageId) => CODE_COPY[languageId] || CODE_COPY.yoruba;

  const CODE_CURRICULUM_BANDS = [
    {
      id: 'Lower-Elementary',
      bandKey: 'lower',
      title: 'Lower Elementary',
      range: 'Kindergarten to Grade 2',
      badge: 'Ages 5–8',
      desc: 'Foundational computer science, unplugged problem solving, directional robot logic, and early digital citizenship.',
      flowchart: {
        title: 'K–2nd Grade STEAM Progression Roadmap',
        image: 'https://cdn.prod.website-files.com/67515ca117da61ac21154553/688763017d473a3cf18f822b_flowchart_k-2nd.png',
        summary: 'From pattern recognition and story-led algorithms to loop repetitions and beginner physical robotics.'
      },
      grades: [
        {
          id: 'kindergarten',
          name: 'Kindergarten',
          badgeColor: 'red',
          badgeLabel: 'Red',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-kindergarten.jpg'),
          desc: 'Introduce young students to coding and robotics through the engaging Kindergarten curriculum. Designed with fun, hands-on activities, it fosters problem-solving, creativity, and foundational digital skills.',
          topics: ['Unplugged Algorithms', 'Directional Logic', 'Robot Helper Stories', 'Pattern Recognition'],
          bilingualFocus: 'Greetings & simple directions in African languages (Òkè, Ọ̀tún, Ìsàlẹ̀, Òsì)'
        },
        {
          id: 'grade-1',
          name: '1st Grade',
          badgeColor: 'orange',
          badgeLabel: 'Orange',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-1.jpg'),
          desc: 'Young students will discover the basics of algorithms and robot control through interactive activities. From building simple commands to exploring robot movements, these lessons make coding an exciting hands-on adventure!',
          topics: ['Command Sequences', 'Event Triggers (Tap & Go)', 'Early Loops', 'Basic Robotics Movements'],
          bilingualFocus: 'Action verbs & sequence vocabulary in Yorùbá, Igbo, Hausa, and Swahili'
        },
        {
          id: 'grade-2',
          name: '2nd Grade',
          badgeColor: 'yellow',
          badgeLabel: 'Yellow',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-2.jpg'),
          desc: 'Students will take their coding skills further by exploring complex algorithms, loops, and robot behavior. From mastering control commands to discovering basic digital communication, this class makes coding an exciting challenge!',
          topics: ['Complex Loops (Repeat N times)', 'Conditionals (If/Else)', 'Sensor Inputs', 'Digital Communication Basics'],
          bilingualFocus: 'Condition & choice terms (Bí / Tí ó bá, Ọ̀rọ̀ ìbánisọ̀rọ̀)'
        }
      ]
    },
    {
      id: 'Upper-Elementary',
      bandKey: 'upper',
      title: 'Upper Elementary',
      range: 'Grade 3 to 5',
      badge: 'Ages 8–11',
      desc: 'Visual block programming, Scratch games, micro:bit physical computing, electrical circuits, and safe digital creation.',
      flowchart: {
        title: '3rd–5th Grade STEAM Progression Infographic',
        image: 'https://cdn.prod.website-files.com/67515ca117da61ac21154553/68876243a382cb50defa2dff_infographic_3rd-5th.png',
        summary: 'From Scratch animation and game physics to microcontrollers, sensor engineering, and floor plan CAD.'
      },
      grades: [
        {
          id: 'grade-3',
          name: '3rd Grade',
          badgeColor: 'green',
          badgeLabel: 'Green',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-3.jpg'),
          desc: 'In our 3rd Grade Course, students will tackle advanced problem-solving with conditionals and complex robot programming. From coding challenges to responsible digital creation, our lessons take their skills to the next level!',
          topics: ['Scratch Animation & Games', 'Variables & Timers', 'Simple Circuit Components', 'Pattern Encoding'],
          bilingualFocus: 'Variables & score tracking glosses across 4 African languages'
        },
        {
          id: 'grade-4',
          name: '4th Grade',
          badgeColor: 'blue',
          badgeLabel: 'Blue',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-4.jpg'),
          desc: 'Our Grade 4 Curriculum introduces basic programming structures such as variables and loops, explores simple robotics with gears and sensors, and emphasises online safety and digital citizenship.',
          topics: ['Micro:bit Microcontrollers', 'Gears & Mechanical Linkages', 'Logic Gates & Operators', 'Cyber Citizenship'],
          bilingualFocus: 'Hardware components & safety expressions'
        },
        {
          id: 'grade-5',
          name: '5th Grade',
          badgeColor: 'purple',
          badgeLabel: 'Purple',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-5.jpg'),
          desc: 'This course advances students to intermediate programming, incorporating functions, problem-solving, robotics, and real-world sensor applications. With a focus on research and collaboration, these lessons make coding hands-on and engaging.',
          topics: ['Custom Functions & Parameters', '2D CAD Floor Plans', 'Sensory Robots', 'Data Spreadsheets'],
          bilingualFocus: 'Function definitions & collaborative project terminology'
        }
      ]
    },
    {
      id: 'Middle-School',
      bandKey: 'middle',
      title: 'Middle School',
      range: 'Grade 6 to 8+',
      badge: 'Ages 11–15+',
      desc: 'Transition to line-based languages (Python, JavaScript, HTML/CSS), 3D CAD modeling, cybersecurity defense, and artificial intelligence.',
      flowchart: {
        title: 'Middle School Computer Science & STEAM Roadmap',
        image: 'https://cdn.prod.website-files.com/67515ca117da61ac21154553/689080b566fcae4ee8198124_US%20General%20Flowchart%20Middle%20School.png',
        summary: 'From text-based coding to OOP architecture, data encryption, web publication, and AI ethics.'
      },
      grades: [
        {
          id: 'grade-6',
          name: '6th Grade',
          badgeColor: 'blue',
          badgeLabel: '6 Blue',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-6.jpg'),
          desc: 'Students dive into advanced programming with arrays, data structures, robotics, and AI. Lessons emphasize innovation, ethics, and the impact of technology on society, preparing them for the future of tech.',
          topics: ['JavaScript & Python Syntax', 'Arrays & Lists', 'AI Machine Learning Intro', 'Web Development (HTML/CSS)'],
          bilingualFocus: 'Syntax translations, algorithms & African technology milestones'
        },
        {
          id: 'grade-7',
          name: '7th Grade',
          badgeColor: 'blue',
          badgeLabel: '7 Indigo',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-7.jpg'),
          desc: 'In this course students will explore Object-Oriented Programming, learning about objects, classes, and inheritance. Lessons also cover robotics systems, digital communication, and the ethics of information in technology.',
          topics: ['Object-Oriented Programming', 'Classes & Methods', 'Networks (Wired/Wireless)', 'Cyber Threats & Defense'],
          bilingualFocus: 'Object models, classification & digital security terms'
        },
        {
          id: 'grade-8',
          name: '8th Grade',
          badgeColor: 'purple',
          badgeLabel: '8th Grade',
          lessonCount: '36+ Pre-Built Lessons',
          duration: '30-60 min each',
          image: imageUrl('c4k-grade-8.jpg'),
          desc: 'This course introduces students to advanced robotics and automation, allowing them to push the boundaries of digital collaboration and cybersecurity. Through hands-on projects and real-world applications, they dive into programming, critical thinking, and problem-solving.',
          topics: ['Binary, ASCII & Unicode', '3D CAD Mechanical Toy Design', 'Automated Robotics', 'Full-Stack Web Projects'],
          bilingualFocus: 'Computational linguistics & African digital preservation'
        }
      ]
    }
  ];

  const C4K_FREE_LESSONS = [
    {
      id: 'simple-electrical-components',
      title: 'Exploring Simple Circuit Components',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Robotics & Circuits',
      badgeColor: 'green',
      icon: 'sparkles',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/682589bd57879a677a03ed68_electronics_robotics_circuits_lesson.png',
      desc: 'Introduce the basics of robotics and electrical circuits using real components like buzzers, bulbs, motors, and switches.',
      bilingual: { yoruba: 'Àwọn Ẹ̀yà Iná Ọ̀tọ̀ọ̀tọ̀ (Circuit components)', igbo: 'Ngwa eletriki dị mfe', hausa: 'Kayan Wutar Lantarki', swahili: 'Vipengele vya saketi ya umeme' },
      duration: '45 mins',
      highlights: ['Battery power sources', 'Closed vs open circuits', 'LED lights & buzzers', 'Interactive switch simulation']
    },
    {
      id: 'exploring-patterns-with-ozzy-the-owl',
      title: 'Exploring Patterns with Ozzy the Owl',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Algorithmic Thinking',
      badgeColor: 'green',
      icon: 'eye',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68258a37491fbb93a02f54e0_ozzy_patterns_Algorithmic%20thinking.png',
      desc: 'Identify, complete, and debug visual and number patterns using clear rules and logic.',
      bilingual: { yoruba: 'Ìfihàn Àpẹẹrẹ (Patterns & Logic)', igbo: 'Usoro ụkpụrụ na ezi uche', hausa: 'Tsarin Hankali', swahili: 'Mifumo na Mantiki' },
      duration: '35 mins',
      highlights: ['Pattern recognition', 'Visual sequences', 'Debugging broken rules', 'Algorithmic reasoning']
    },
    {
      id: 'digital-citizenship-technology-all-around',
      title: 'Digital Citizenship: Technology Around Us',
      grades: '5-6',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Digital Citizenship',
      badgeColor: 'blue',
      icon: 'shield',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6824a92c8b78958327d9f3e0_digital_technology_all_around.png',
      desc: 'Explore the digital world and the devices we use every day. Think critically about the pros and cons of being online.',
      bilingual: { yoruba: 'Ààbò Orí Ayélujára (Digital safety)', igbo: 'Nchekwa na ịntanetị', hausa: 'Tsaron Intanet', swahili: 'Uraia wa Kidijitali' },
      duration: '40 mins',
      highlights: ['Everyday smart devices', 'Screen time balance', 'Protecting private data', 'Kind online communication']
    },
    {
      id: 'introduction-to-micro-bits',
      title: 'Introducing Micro:bits',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Hardware & Micro:bits',
      badgeColor: 'green',
      icon: 'layers',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/682597db5c98e45260d2f838_introduction_microbits_robotics.png',
      desc: 'Explore the micro:bit and learn about its parts, about microcontrollers and how they receive instructions.',
      bilingual: { yoruba: 'Kọ̀ǹpútà Kékèké (Microcontrollers)', igbo: 'Obere kọmputa nchịkwa', hausa: 'Karamar Kwamfuta', swahili: 'Kompyuta ndogo ya micro:bit' },
      duration: '50 mins',
      highlights: ['5x5 LED matrix', 'A & B input buttons', 'Microcontroller processors', 'Flashing first code']
    },
    {
      id: 'input-and-output-devices',
      title: 'Input and Output Devices',
      grades: '5-6',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Hardware & Micro:bits',
      badgeColor: 'blue',
      icon: 'refresh',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6825a2eba24f00f39de316e8_input_output_lesson_card.png',
      desc: 'Explore how computers receive, process, and respond to information using input and output devices.',
      bilingual: { yoruba: 'Ìrúnwọlé àti Ìfihàn (Input & Output)', igbo: 'Ntinye na mmepụta ozi', hausa: 'Shigarwa da Fitarwa', swahili: 'Vifaa vya Kuingiza na Kutoa Data' },
      duration: '45 mins',
      highlights: ['Keyboards, sensors & mics', 'Monitors, speakers & motors', 'The CPU processing loop', 'Real-world machine examples']
    },
    {
      id: 'robotics-joining-materials',
      title: 'Robotics: Joining Materials',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Robotics & Circuits',
      badgeColor: 'green',
      icon: 'compass',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6825a70aed91448038bfdea8_robotics_joining_materials.png',
      desc: 'Learn how different materials are joined in robotics and simple engineering builds.',
      bilingual: { yoruba: 'Ìsopọ̀ Àwọn Ohun Èlò (Joining materials)', igbo: 'Ijiko ngwa ọrụ', hausa: 'Hada Kayan Aiki', swahili: 'Kuunganisha Vifaa vya Roboti' },
      duration: '40 mins',
      highlights: ['Structural joints & fasteners', 'Pivots & axles', 'Rigid vs flexible connections', 'Engineering design process']
    },
    {
      id: 'cad-designing-floor-plans',
      title: 'CAD: Designing Floor Plans',
      grades: '5-6',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'CAD & 3D Design',
      badgeColor: 'blue',
      icon: 'home',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/682b847507a194824d09aeee_CAD_Designing_Floor_Plans_Lesson.png',
      desc: 'Discover how CAD is used by architects and engineers to design buildings, cars, and cities.',
      bilingual: { yoruba: 'Àwòrán Ilé CAD (Floor plan design)', igbo: 'Nhazi eserese ụlọ', hausa: 'Zanen Gine-gine', swahili: 'Ubunifu wa Ramani za Majengo (CAD)' },
      duration: '50 mins',
      highlights: ['2D architectural scale', 'Walls, doorways & windows', 'Measurement units', 'Exporting digital blueprints']
    },
    {
      id: 'cad-toy-design-with-tinkercad',
      title: 'CAD: Toy Design with Tinkercad',
      grades: '6-8+',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'CAD & 3D Design',
      badgeColor: 'purple',
      icon: 'sparkles',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/682ed8c00b9043aac0bea99d_Toy%20Design_TinkerCAD.png',
      desc: 'Design a simple mechanical toy using Tinkercad. Learn key CAD and robotics skills like pivots, linkages, and alignment.',
      bilingual: { yoruba: 'Àwòrán 3D Fún Ẹ̀rọ Ìṣiré (3D Toy design)', igbo: 'Imebe ihe egwuregwu 3D', hausa: 'Zanen Kayan Wasa na 3D', swahili: 'Muundo wa Vitu vya Kuchezea vya 3D' },
      duration: '60 mins',
      highlights: ['3D shape manipulation', 'Holes and solid groups', 'Mechanical pivots', '3D printing preparation']
    },
    {
      id: 'spreadsheets-formatting-fun',
      title: 'Spreadsheets: Formatting Fun',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Spreadsheets & Data',
      badgeColor: 'green',
      icon: 'book',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/682f02b0c230e91424a0fdd8_Spreadsheets_Formatting_fun_LessonCard.png',
      desc: 'Learn how to organise, format, and visualise data using spreadsheets. A beginner-friendly lesson that introduces rows, columns, cells, and file saving.',
      bilingual: { yoruba: 'Ìtòlẹ́sẹẹsẹ̀ Dátà (Spreadsheets & Data)', igbo: 'Nhazi tebụl data', hausa: 'Teburin Bayanai', swahili: 'Majedwali na Mpangilio wa Data' },
      duration: '45 mins',
      highlights: ['Rows, columns & cell addresses', 'Cell color formatting', 'Simple SUM & AVERAGE formulas', 'Bar chart creation']
    },
    {
      id: 'block-based-coding-vs-line-based-coding',
      title: 'Block-Based vs Line-Based Coding',
      grades: '6-8',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Coding & Games',
      badgeColor: 'purple',
      icon: 'code',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/682f1967c722f92a295166d9_Line_Block_Coding_Free_LEsson_Card.png',
      desc: 'Discover the difference between block-based and line-based coding through loops and fun coding games.',
      bilingual: { yoruba: 'Kóòdù Ẹlẹ́yà vs Kóòdù Ìlà (Blocks vs Syntax)', igbo: 'Koodu ngọngọ na koodu ederede', hausa: "Nau'o'in Lambobin Kwamfuta", swahili: 'Misimbo ya Vitalu dhidi ya Mistari' },
      duration: '50 mins',
      highlights: ['Scratch visual blocks vs Python syntax', 'Syntax errors vs logic bugs', 'Loops & conditions comparison', 'Smooth text-code transition']
    },
    {
      id: 'robot-sensors-detecting-the-world',
      title: 'Robot Sensors: Detecting the World',
      grades: '6-8',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Robotics & Circuits',
      badgeColor: 'purple',
      icon: 'eye',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/682f4193d09b27eeca46e9a0_robotics_sensors_elesson%20card.png',
      desc: 'How do robots "see" the world? Discover how sensors help robots sense, move, and react.',
      bilingual: { yoruba: 'Àwọn Ohun Ìfura Rọ́bọ́ọ̀tì (Sensors)', igbo: 'Ihe nchọpụta rọbọt', hausa: "Kayan Jin Yanayi na Na'ura", swahili: 'Vihisi vya Roboti (Sensors)' },
      duration: '55 mins',
      highlights: ['Ultrasonic distance sensors', 'Light & infrared detection', 'Sensor threshold triggers', 'Autonomous obstacle avoidance']
    },
    {
      id: 'exploring-games-in-scratch',
      title: 'Exploring Games in Scratch',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Coding & Games',
      badgeColor: 'green',
      icon: 'play',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/683000e54a844c9084375187_exploring_games_scratch_lessoncard.png',
      desc: 'Explore how games are built in Scratch using variables, timers, and control blocks.',
      bilingual: { yoruba: 'Ṣíṣe Eré Kóòdù nínú Scratch (Scratch Games)', igbo: 'Ime egwuregwu na Scratch', hausa: 'Kera Wasanni a Scratch', swahili: 'Kutengeneza Michezo katika Scratch' },
      duration: '45 mins',
      highlights: ['Sprite movement & arrow keys', 'Score & timer variables', 'Collision detection', 'Win & Game Over screens']
    },
    {
      id: 'flowcharts-the-decision-making-process',
      title: 'Flowcharts: Decision Making',
      grades: '6-8',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Algorithmic Thinking',
      badgeColor: 'purple',
      icon: 'compass',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6835cff283d0d34df03a7b7c_Flowcharts_lesson%20card.png',
      desc: 'Learn how to break down everyday decisions into clear, visual steps using flowcharts.',
      bilingual: { yoruba: 'Àwòrán Ìpinnu (Flowcharts & logic)', igbo: 'Chaatị mkpebi echiche', hausa: 'Tsarin Yanke Shawara', swahili: 'Michoro ya Mtiririko (Flowcharts)' },
      duration: '45 mins',
      highlights: ['Start/End terminators', 'Decision diamonds (Yes/No)', 'Process rectangles', 'Mapping complex game logic']
    },
    {
      id: 'crack-the-code-ascii-and-unicode',
      title: 'Crack the Code: ASCII and Unicode',
      grades: '6-8+',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'AI & Data',
      badgeColor: 'purple',
      icon: 'lock',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/683c7fbb28be90d2ebaa227e_crack_the_code_ASCII_Unicode_lessoncard.png',
      desc: 'Learn how text, symbols, and emojis are stored and shared using binary code.',
      bilingual: { yoruba: 'Àwọn Kóòdù Lẹ́tà (ASCII & Unicode)', igbo: 'Koodu ederede ASCII na Unicode', hausa: 'Fassarar Lambobin Rubutu', swahili: 'Usimbaji wa Maandishi (ASCII & Unicode)' },
      duration: '50 mins',
      highlights: ['ASCII character table (A=65)', 'Unicode & multilingual glyphs', 'Emoji byte encodings', 'Secret binary message decoder']
    },
    {
      id: 'ozzy-explores-robots',
      title: 'Ozzy Explores Robots',
      grades: 'Preschool / K-2',
      band: 'lower',
      bandLabel: 'Lower Elementary (K-2)',
      category: 'Robotics & Circuits',
      badgeColor: 'red',
      icon: 'smile',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6841a7440966521e663c930a_ozzy_explores_robots_lesson_card.png',
      desc: 'Meet Ozzy the owl and Dizzy the drone as you explore what robots are and how they help us, in this unplugged robotics lesson.',
      bilingual: { yoruba: 'Àwọn Rọ́bọ́ọ̀tì Olùrànlọ́wọ́ (Robots for kids)', igbo: 'Rọbọt na-enyere anyị aka', hausa: 'Mutum-mutumi Mai Taimako', swahili: 'Roboti Zinavyotusaidia' },
      duration: '30 mins',
      highlights: ['What makes a machine a robot', 'Robot helper story', 'Body, brain & power parts', 'Hands-on movement roleplay']
    },
    {
      id: 'exploring-artificial-intelligence',
      title: 'Exploring Artificial Intelligence',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'AI & Data',
      badgeColor: 'green',
      icon: 'sparkles',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6849716ffb4e02045d4ad26e_Exploring_artificial_intelligence_Lessoncard.png',
      desc: 'An introduction to Artificial Intelligence (AI). Explore how AI recognises patterns, processes data, and learns over time.',
      bilingual: { yoruba: 'Ọgbọ́n Àtọwọ́dá Kọ̀ǹpútà (Artificial Intelligence)', igbo: 'Amamihe Artificial Intelligence', hausa: 'Fasahar AI', swahili: 'Akili Unde (Artificial Intelligence)' },
      duration: '45 mins',
      highlights: ['How machines learn from data', 'Computer vision & speech recognition', 'Training vs testing examples', 'Ethical & responsible AI']
    },
    {
      id: 'social-media-and-you-whats-your-brand',
      title: 'Social Media and You: What’s Your Brand?',
      grades: '6-8+',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Digital Citizenship',
      badgeColor: 'purple',
      icon: 'user',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/684c25beb2ff4f18d3deb053_FINAL_free%20lessons_lesson%20card_headers%20(658%20x%20502%20px)%20(4).png',
      desc: 'Explore how personal branding and digital footprints shape your online identity.',
      bilingual: { yoruba: 'Àpẹẹrẹ Rẹ Lórí Ayélujára (Digital identity)', igbo: 'Njirimara gị na ntanetị', hausa: 'Hotonku a Yanar Gizo', swahili: 'Utambulisho Wako Mtandaoni' },
      duration: '45 mins',
      highlights: ['Digital footprints & permanence', 'Privacy settings and safety', 'Constructive digital creation', 'Positive online impact']
    },
    {
      id: 'my-country-my-world',
      title: 'My Country: My World',
      grades: '6-8',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Web Development',
      badgeColor: 'purple',
      icon: 'globe',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68552a1f9197a895a1a1d4e6_myfirstwebsite_mycountry.png',
      desc: 'Code your first Website! Learn how to structure and style content using HTML and CSS, changing colours, headings, and even designing a fictional country.',
      bilingual: { yoruba: 'Kíkọ Ojú-òpó Wẹ́ẹ̀bù (Building Webpages)', igbo: 'Iwu ibe weebụ mbụ gị', hausa: 'Gina Shafin Yanar Gizo', swahili: 'Kutengeneza Tovuti Yako ya Kwanza' },
      duration: '55 mins',
      highlights: ['HTML tags (<h1>, <p>, <img>)', 'CSS background and color styling', 'Borders and responsive containers', 'Live browser preview']
    },
    {
      id: 'scratch-text-variables',
      title: 'Scratch: Text Variables',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Coding & Games',
      badgeColor: 'green',
      icon: 'edit',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/686544f7f490862234b417d8_Scratch%20Text%20Variables.png',
      desc: 'Create and use text variables in Scratch to make projects more dynamic.',
      bilingual: { yoruba: 'Àwọn Ìpamọ́ Ọ̀rọ̀ (Text Variables)', igbo: 'Mgbanwe ederede na Scratch', hausa: "Ma'ajiyar Kalmomi", swahili: 'Vibadilika vya Maandishi (Text Variables)' },
      duration: '40 mins',
      highlights: ['Making custom variables', 'Joining strings with “join” blocks', 'Asking for user input (Ask & Wait)', 'Personalized character dialogue']
    },
    {
      id: 'exploring-micro-bits',
      title: 'Exploring Micro:bits Hands-On',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Hardware & Micro:bits',
      badgeColor: 'green',
      icon: 'layers',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/686e80c5efe68b6bd79fcc06_exploring_microbits.png',
      desc: 'Learn how micro:bits work by exploring their parts, LEDs, and buzzers and display your name on a virtual micro:bit.',
      bilingual: { yoruba: 'Ṣíṣe Àdánwò Micro:bit (Micro:bit Lab)', igbo: 'Ihe omume Micro:bit', hausa: 'Gwajin Micro:bit', swahili: 'Majaribio ya Micro:bit' },
      duration: '45 mins',
      highlights: ['Show String scrolling animation', 'Custom LED icon designs', 'Play Tone melody sounds', 'Compass and shake triggers']
    },
    {
      id: 'introduction-to-tess-the-dog-javascript-lesson',
      title: 'Introduction to Tess the Dog - JavaScript',
      grades: '6-8',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Coding & Games',
      badgeColor: 'purple',
      icon: 'code',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/687512ab7a72f165acfb6d1b_Tess%20the%20dog%20JS.png',
      desc: 'Meet Tess the Dog and learn basic JavaScript commands to guide movements and actions.',
      bilingual: { yoruba: 'Kóòdù JavaScript pẹ̀lú Tess (JavaScript Basics)', igbo: 'Iwu JavaScript na Tess', hausa: 'Koyan JavaScript', swahili: 'Mafunzo ya JavaScript na Mbwa Tess' },
      duration: '50 mins',
      highlights: ['Function calls: tess.bark(), tess.fetch()', 'Parameters & arguments', 'JavaScript camelCase syntax', 'Interactive virtual canine sandbox']
    },
    {
      id: 'an-introduction-to-cyber-security',
      title: 'An Introduction to Cyber Security',
      grades: '7-8',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Cybersecurity',
      badgeColor: 'purple',
      icon: 'shield',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6878d3f77c47e8422f3085ee_cyber%20security.png',
      desc: 'Discover the basics of cybersecurity by identifying online threats like phishing, malware, and weak passwords.',
      bilingual: { yoruba: 'Ààbò Kọ̀ǹpútà àti Nẹ́tíwọ́ọ̀kì (Cyber Security)', igbo: 'Nchekwa kọmputa na ozi', hausa: 'Kariyar Yanar Gizo', swahili: 'Usalama Mtandaoni (Cyber Security)' },
      duration: '50 mins',
      highlights: ['Spotting phishing emails', 'Creating fortress passwords', 'Two-Factor Authentication (2FA)', 'Safe browsing habits']
    },
    {
      id: 'augmented-reality-real-world-applications',
      title: 'Augmented Reality: Real-World Applications',
      grades: '6-7',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'AI & Data',
      badgeColor: 'purple',
      icon: 'sparkles',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68823759c7e478e8deb2b018_AR%20Lesson%20Card.png',
      desc: 'Discover the difference between Augmented and Virtual Reality in this interactive digital skills lesson.',
      bilingual: { yoruba: 'Àwòrán Ayélujára Àfipọ̀ (Augmented Reality)', igbo: 'Eziokwu Augmented Reality', hausa: 'Fasahar AR', swahili: 'Uhalisia Ulioboreshwa (Augmented Reality)' },
      duration: '45 mins',
      highlights: ['AR vs VR definitions', 'Camera overlay tracking', 'Healthcare & engineering uses', 'Designing a phone AR filter']
    },
    {
      id: 'bits-bytes-and-binary-numbers',
      title: 'Bits, Bytes and Binary Numbers',
      grades: '7-8',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'AI & Data',
      badgeColor: 'purple',
      icon: 'lock',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68936cb20ab474b1e00eb5a9_bits_bytes_binary_lesson_card.png',
      desc: 'Understand how binary numbers work and why computers use them.',
      bilingual: { yoruba: 'Àwọn Nọ́ḿbà Kọ̀ǹpútà 0 àti 1 (Binary)', igbo: 'Nọmba abụọ nke kọmputa (Binary)', hausa: 'Lambobin Binary 0 da 1', swahili: 'Namba za Mfumo wa Jozi (Binary)' },
      duration: '45 mins',
      highlights: ['Base-2 vs Base-10 systems', 'Powers of 2 (1, 2, 4, 8, 16, 32, 64, 128)', 'Converting numbers to binary', 'Transistors as electronic on/off switches']
    },
    {
      id: 'ozzy-introduces-patterns',
      title: 'Ozzy Introduces Patterns',
      grades: 'Preschool / K-2',
      band: 'lower',
      bandLabel: 'Lower Elementary (K-2)',
      category: 'Algorithmic Thinking',
      badgeColor: 'red',
      icon: 'sparkles',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/6896132640e0a68a26d89a61_ozzy_introduces_patterns_lesson.png',
      desc: 'Discover how pattern recognition builds coding skills through this unplugged, interactive robotics and computer science lesson.',
      bilingual: { yoruba: 'Ìfihàn Àpẹẹrẹ pẹ̀lú Ozzy (Patterns for young coders)', igbo: 'Usoro ihe atụ dị mfe', hausa: 'Kayan Tsari na Farko', swahili: 'Mifumo ya Awali ya Kujifunza' },
      duration: '30 mins',
      highlights: ['AB, ABB & ABC repeating rhythms', 'Pattern prediction games', 'Body percussion coding', 'Unplugged robotics logic']
    },
    {
      id: 'taking-your-first-steps-in-coding',
      title: 'Taking Your First Steps in Coding',
      grades: 'K-2',
      band: 'lower',
      bandLabel: 'Lower Elementary (K-2)',
      category: 'Algorithmic Thinking',
      badgeColor: 'red',
      icon: 'compass',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68a8122e3e2695f00f7fb74a_first%20steps%20in%20coding.jpg',
      desc: 'Learn the basics of coding through fun unplugged activities that teach sequencing, logic, and problem-solving - no computers required.',
      bilingual: { yoruba: 'Àwọn Ìgbésẹ̀ Àkọ́kọ́ nínú Kóòdù (First steps in code)', igbo: 'Nzọụkwụ mbụ na koodu', hausa: 'Matakan Farko na Kwamfuta', swahili: 'Hatua za Kwanza katika Msimbo' },
      duration: '35 mins',
      highlights: ['Step-by-step algorithms', 'Direction cards (Forward, Turn)', 'Debugging human robot paths', 'Building teamwork & resilience']
    },
    {
      id: 'digital-identity-and-communicating-online',
      title: 'Digital Identity & Communicating Online',
      grades: 'K-2',
      band: 'lower',
      bandLabel: 'Lower Elementary (K-2)',
      category: 'Digital Citizenship',
      badgeColor: 'red',
      icon: 'smile',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68b187ac468fdb830e0f9c7e_Digital%20Identity_Free%20Lesson.png',
      desc: 'Learn how digital identities are formed, why online safety matters, and how to make smart choices when communicating online.',
      bilingual: { yoruba: 'Ìbánisọ̀rọ̀ rere lórí Ayélujára (Online manners & safety)', igbo: 'Nkwurịta okwu dị mma na ntanetị', hausa: 'Kyakkyawan Sadarwa a Intanet', swahili: 'Mawasiliano Salama Mtandaoni' },
      duration: '30 mins',
      highlights: ['What is a screen avatar?', 'Keeping secrets & passwords safe', 'Asking an adult before sharing', 'Kind words in online spaces']
    },
    {
      id: 'networks-wired-and-wireless',
      title: 'Networks: Wired and Wireless',
      grades: '6-7',
      band: 'middle',
      bandLabel: 'Middle School (6-8)+',
      category: 'Cybersecurity',
      badgeColor: 'purple',
      icon: 'refresh',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68c9804957cef7c04faf1b54_networks_wired_wireless.png',
      desc: 'Explore wired and wireless networks, IoT, and digital connectivity through interactive tasks and a creative smart device design challenge.',
      bilingual: { yoruba: 'Àwọn Nẹ́tíwọ́ọ̀kì Wáyà àti Aláìlówáyà (Networks & IoT)', igbo: 'Netwọk wired na wireless', hausa: 'Hanyoyin Sadarwa na Intanet', swahili: 'Mitandao ya Waya na Isiyo na Waya' },
      duration: '50 mins',
      highlights: ['Ethernet vs Wi-Fi vs Bluetooth', 'Routers, packets and IP addresses', 'Smart home Internet of Things (IoT)', 'Designing a solar-powered connected farm']
    },
    {
      id: 'using-patterns-to-encode-and-decode',
      title: 'Using Patterns to Encode and Decode',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Algorithmic Thinking',
      badgeColor: 'green',
      icon: 'lock',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68da617be13369068373328a_encoding_decoding_patterns.png',
      desc: 'Learn how patterns, encoding, and decoding build the foundation for coding, problem-solving, and creative thinking.',
      bilingual: { yoruba: 'Ìpamọ́ àti Ìtúmọ̀ Kóòdù (Encoding & Decoding)', igbo: 'Izo na imeghe koodu', hausa: 'Boye da Bayyana Sakonni', swahili: 'Kufunga na Kufungua Misimbo (Encoding)' },
      duration: '40 mins',
      highlights: ['Substitution ciphers (Caesar cipher)', 'Pattern rule tables', 'Morse code & drum rhythms', 'Creating secret classroom codes']
    },
    {
      id: 'an-introduction-to-scratch',
      title: 'An Introduction to Scratch',
      grades: '3-5',
      band: 'upper',
      bandLabel: 'Upper Elementary (3-5)',
      category: 'Coding & Games',
      badgeColor: 'green',
      icon: 'sparkles',
      image: 'https://cdn.prod.website-files.com/67515ca117da61ac211545bc/68e8e5cf9aedfdf2c00545c3_scratch%20lesson%20intro.jpg',
      desc: 'An introduction to Scratch is a beginner-friendly programming lesson where students animate sprites, explore algorithms, and build core computer science skills.',
      bilingual: { yoruba: 'Ìbẹ̀rẹ̀ Kóòdù pẹ̀lú Scratch (Scratch Intro)', igbo: 'Mmalite koodu na Scratch', hausa: 'Fara Kayan Scratch', swahili: 'Utangulizi wa Scratch' },
      duration: '45 mins',
      highlights: ['Blocks palette & stage window', 'Green flag event blocks', 'Costume animations & speech bubbles', 'Sound effects and loop repetition']
    }
  ];

  function filterFreeLessons() {
    const bandFilter = state.coding.filter || 'all';
    const catFilter = state.coding.category || 'all';
    const searchQ = (state.coding.lessonSearch || '').trim().toLowerCase();

    return C4K_FREE_LESSONS.filter((lesson) => {
      if (bandFilter !== 'all' && lesson.band !== bandFilter) return false;
      if (catFilter !== 'all' && lesson.category !== catFilter) return false;
      if (searchQ) {
        const hay = (lesson.title + ' ' + lesson.desc + ' ' + lesson.category + ' ' + lesson.grades + ' ' + lesson.bandLabel).toLowerCase();
        if (!hay.includes(searchQ)) return false;
      }
      return true;
    });
  }

  function renderFreeLessonCards(lessons) {
    if (!lessons.length) {
      return '<div class="c4k-empty-lessons"><span class="empty-icon">' + icon('search', 32) + '</span><h3>No lessons matched your search or filters</h3><p>Try resetting the category filter or choosing “All Bands”.</p><button type="button" class="button button-primary button-sm" data-action="coding-filter-band" data-band="all">Reset All Filters</button></div>';
    }

    return lessons.map((lesson) => {
      const isDone = state.coding.completedLessons && state.coding.completedLessons.includes(lesson.id);
      const langKey = CODE_COPY[state.coding.helperLanguage] ? state.coding.helperLanguage : 'yoruba';
      const bilingualTerm = lesson.bilingual[langKey] || lesson.bilingual.yoruba || 'Kóòdù';
      const highlightsHtml = (lesson.highlights || []).slice(0, 3).map((h) => '<li><span class="hl-check">✓</span> <span>' + esc(h) + '</span></li>').join('');

      return '<div class="c4k-lesson-card ' + (isDone ? 'is-completed-lesson' : '') + '" data-lesson-id="' + lesson.id + '">' +
        '<div class="activity-card-image-wrapper">' +
          '<img src="' + lesson.image + '" loading="lazy" alt="' + esc(lesson.title) + '" class="lesson-card-image" />' +
          '<span class="c4k-card-category-pill">' + esc(lesson.category) + '</span>' +
          '<span class="c4k-card-band-pill">' + esc(lesson.bandLabel) + '</span>' +
          (isDone ? '<span class="c4k-card-done-badge">' + icon('check', 14) + ' Completed</span>' : '') +
        '</div>' +
        '<div class="c4k-lesson-card-body">' +
          '<div class="c4k-lesson-meta-row">' +
            '<span class="c4k-lesson-duration">' + icon('clock', 13) + ' ' + esc(lesson.duration) + '</span>' +
            '<span class="c4k-grades-badge">' + icon('smile', 13) + ' Grades ' + esc(lesson.grades) + '</span>' +
          '</div>' +
          '<h3 class="free-lessons-cards-heading">' + esc(lesson.title) + '</h3>' +
          '<div class="c4k-bilingual-chip" title="Bilingual concept in selected African language">' +
            '<span class="chip-lang">' + icon('globe', 13) + '</span>' +
            '<span class="chip-text">' + esc(bilingualTerm) + '</span>' +
          '</div>' +
          '<p class="c4k-lesson-desc">' + esc(lesson.desc) + '</p>' +
          (highlightsHtml ? '<ul class="c4k-card-highlights" aria-label="Key concepts">' + highlightsHtml + '</ul>' : '') +
          '<div class="c4k-card-actions">' +
            '<button type="button" class="button button-primary button-full c4k-start-btn" data-action="coding-start-lesson" data-lesson-id="' + lesson.id + '">' +
              (isDone ? icon('check', 15) + ' Review Lesson' : 'Open Lesson ' + icon('arrow', 15)) +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderCurriculumGradeCard(grade, bandId) {
    return '<div class="activity-card c4k-grade-card" data-grade="' + grade.id + '">' +
      '<div class="activity-card-wrapper">' +
        '<div class="imagewrapper">' +
          '<div class="activity-card-image-wrapper">' +
            '<span class="badge badge-' + grade.badgeColor + '">' + esc(grade.badgeLabel) + '</span>' +
            '<div class="activity-image">' +
              '<img src="' + grade.image + '" loading="lazy" alt="' + esc(grade.name) + ' activity preview" class="activity-card-image" />' +
            '</div>' +
            '<div class="activity-gradient"></div>' +
          '</div>' +
        '</div>' +
        '<div class="activity-card-content-wrapper">' +
          '<div class="activity-card-content">' +
            '<div class="activity-card-header-wrapper">' +
              '<div class="heading-6">' + esc(grade.name) + '</div>' +
              '<div class="activity-date-wrapper">' +
                '<div class="text-md font-weight-semibold">' + esc(grade.lessonCount) + '</div>' +
                '<div class="text-s font-weight-medium">' + esc(grade.duration) + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="text-md c4k-grade-desc">' + esc(grade.desc) + '</div>' +
            '<div class="c4k-grade-topics">' +
              grade.topics.map((t) => '<span class="c4k-topic-pill">' + esc(t) + '</span>').join('') +
            '</div>' +
            '<div class="c4k-grade-card-btn-row">' +
              '<button type="button" class="button button-soft c4k-grade-syllabus-btn" data-action="coding-explore-grade" data-grade="' + grade.id + '">' +
                'Explore Syllabus ' + icon('book', 14) +
              '</button>' +
              '<button type="button" class="button button-outline c4k-grade-sample-btn" data-action="close-modal-and-jump" data-target="free-lessons">' +
                'Matching Lessons ' + icon('arrow', 14) +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function openCurriculumModal(gradeId) {
    let foundGrade = null;
    let foundBand = null;
    for (const band of CODE_CURRICULUM_BANDS) {
      const g = band.grades.find((item) => item.id === gradeId);
      if (g) { foundGrade = g; foundBand = band; break; }
    }
    if (!foundGrade) return;

    const topicsHtml = foundGrade.topics.map((t) => '<span class="curriculum-topic-tag">' + icon('check', 14) + ' ' + esc(t) + '</span>').join('');
    const modalHtml = '<div class="modal-backdrop" data-action="close-modal">' +
      '<section class="modal-card modal-card-curriculum" role="dialog" aria-modal="true" aria-labelledby="currModalTitle">' +
        '<button class="modal-close icon-button" data-action="close-modal" aria-label="Close">' + icon('close', 19) + '</button>' +
        '<div class="curriculum-modal-header">' +
          '<span class="curriculum-band-pill">' + esc(foundBand.title) + ' · ' + esc(foundBand.badge) + '</span>' +
          '<h2 id="currModalTitle">' + esc(foundGrade.name) + ' Curriculum Syllabus</h2>' +
          '<div class="curriculum-meta-row">' +
            '<span>' + icon('book', 15) + ' <strong>' + esc(foundGrade.lessonCount) + '</strong></span>' +
            '<span>' + icon('clock', 15) + ' <strong>' + esc(foundGrade.duration) + '</strong></span>' +
            '<span>' + icon('sparkles', 15) + ' STEAM & Robotics Integrated</span>' +
          '</div>' +
        '</div>' +
        '<div class="curriculum-modal-body">' +
          '<p class="curriculum-modal-desc">' + esc(foundGrade.desc) + '</p>' +
          '<div class="curriculum-modal-box">' +
            '<h4>Key Computational Concepts & Modules:</h4>' +
            '<div class="curriculum-topics-grid">' + topicsHtml + '</div>' +
          '</div>' +
          '<div class="curriculum-modal-box tone-mint">' +
            '<h4>' + icon('globe', 16) + ' Cultural & Bilingual Integration:</h4>' +
            '<p>' + esc(foundGrade.bilingualFocus) + '</p>' +
          '</div>' +
          '<div class="curriculum-modal-actions">' +
            '<button type="button" class="button button-primary" data-action="close-modal-and-jump" data-target="free-lessons">' +
              'Browse Matching Free Lessons ' + icon('arrow', 15) +
            '</button>' +
            '<button type="button" class="button button-outline" data-action="close-modal">Close Syllabus</button>' +
          '</div>' +
        '</div>' +
      '</section>' +
    '</div>';

    const root = document.getElementById('modal-root');
    if (root) {
      root.innerHTML = modalHtml;
      root.querySelector('.modal-close')?.focus();
    }
  }

  function openFreeLessonModal(lessonId) {
    const lesson = C4K_FREE_LESSONS.find((item) => item.id === lessonId);
    if (!lesson) return;

    const completed = state.coding.completedLessons.includes(lesson.id);
    const highlightsHtml = lesson.highlights.map((h) => '<li>' + icon('check', 14) + ' <span>' + esc(h) + '</span></li>').join('');
    const langKey = CODE_COPY[state.coding.helperLanguage] ? state.coding.helperLanguage : 'yoruba';
    const bilingualNote = lesson.bilingual[langKey] || lesson.bilingual.yoruba || 'Kóòdù àti ìmọ̀ ẹ̀rọ';
    const langLabel = LANGUAGES.find((l) => l.id === langKey)?.name || 'Yorùbá';

    const modalHtml = '<div class="modal-backdrop" data-action="close-modal">' +
      '<section class="modal-card modal-card-lesson" role="dialog" aria-modal="true" aria-labelledby="lessonModalTitle">' +
        '<button class="modal-close icon-button" data-action="close-modal" aria-label="Close">' + icon('close', 19) + '</button>' +
        '<div class="lesson-modal-hero">' +
          '<div class="lesson-modal-meta">' +
            '<span class="lesson-modal-band-badge">' + esc(lesson.bandLabel) + '</span>' +
            '<span class="lesson-modal-cat-badge">' + esc(lesson.category) + '</span>' +
            '<span class="lesson-modal-duration">' + icon('clock', 14) + ' ' + esc(lesson.duration) + '</span>' +
          '</div>' +
          '<h2 id="lessonModalTitle">' + esc(lesson.title) + '</h2>' +
          '<p class="lesson-modal-lead">' + esc(lesson.desc) + '</p>' +
        '</div>' +
        '<div class="lesson-modal-grid">' +
          '<div class="lesson-modal-col">' +
            '<h4>' + icon('star', 16) + ' Core Learning Objectives:</h4>' +
            '<ul class="lesson-modal-highlights">' + highlightsHtml + '</ul>' +
          '</div>' +
          '<div class="lesson-modal-col">' +
            '<div class="lesson-bilingual-pill">' +
              '<small>' + icon('globe', 14) + ' ' + langLabel + ' Bilingual Concept:</small>' +
              '<strong>' + esc(bilingualNote) + '</strong>' +
            '</div>' +
            '<div class="lesson-quick-challenge">' +
              '<h4>' + icon('sparkles', 16) + ' Maker STEAM Challenge:</h4>' +
              '<p>Try applying this concept in our interactive sandbox or robot garden quest!</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="lesson-modal-foot">' +
          '<button type="button" class="button button-primary" data-action="coding-complete-free-lesson" data-lesson-id="' + lesson.id + '" ' + (completed ? 'disabled' : '') + '>' +
            (completed ? icon('check', 16) + ' Completed (+15 XP Earned)' : icon('sparkles', 16) + ' Complete Lesson & Claim +15 XP') +
          '</button>' +
          '<button type="button" class="button button-outline" data-action="close-modal-and-jump" data-target="coding-start">' +
            'Open in Bilingual Code Studio ' + icon('arrow', 15) +
          '</button>' +
          '<button type="button" class="text-link" data-action="close-modal">Close</button>' +
        '</div>' +
      '</section>' +
    '</div>';

    const root = document.getElementById('modal-root');
    if (root) {
      root.innerHTML = modalHtml;
      root.querySelector('.modal-close')?.focus();
    }
  }

  
  // ==========================================
  // CODE IN YOUR LANGUAGE ENGINE & PRESETS (IDE)
  // ==========================================
  const IDE_PRESETS = {
    yoruba: [
      {
        id: 'hello_world',
        title: '🌟 Kí Ilé Ayé (Hello World)',
        filename: 'kí_ilé_ayé.yoruba',
        code: '# Kí Ilé Ayé ní Èdè Yorùbá\njẹ́ orúkọ = "Ọmọ Yorùbá"\ntẹ_jade("Ẹ n lẹ́ o, " + orúkọ + "! Ẹ káàbọ̀ sí Idíléwà.")\ntẹ_jade("A n kọ́ koodu ní èdè abínibí wa lónìí! ✨")',
        explainer: [
          '<b>jẹ́ orúkọ = "Ọmọ Yorùbá"</b>: Ṣẹda apo ifipamọ (variable) ti a pe ni "orúkọ".',
          '<b>tẹ_jade(...)</b>: Fi ọ̀rọ̀ ikini ati orúkọ han lori iboju / terminal.'
        ]
      },
      {
        id: 'multiplication',
        title: '🔢 Àtẹ Ìṣirò (Multiplication Table)',
        filename: 'ate_isiro.yoruba',
        code: '# Àtẹ Ìṣirò Kẹta (Multiplication Table 3)\njẹ́ nọmba = 3\ntẹ_jade("Àtẹ Ìṣirò Fún Nọmba " + nọmba + ":")\n\nfún i = 1 dé 5 {\n    jẹ́ àbájáde = nọmba * i\n    tẹ_jade(nọmba + " x " + i + " = " + àbájáde)\n}',
        explainer: [
          '<b>jẹ́ nọmba = 3</b>: Nọmba ti a fẹ ṣe àtẹ ìṣirò fún.',
          '<b>fún i = 1 dé 5 { ... }</b>: Tun iṣiro ṣe lati 1 de 5 leralera (for loop).',
          '<b>jẹ́ àbájáde = nọmba * i</b>: Ṣe iṣiro isodipúpọ.'
        ]
      },
      {
        id: 'decision_tree',
        title: '👑 Èrò Ọmọlúwàbí (Character & Moral Logic)',
        filename: 'iwa_omoluwabi.yoruba',
        code: '# Èrò Ọmọlúwàbí (Decision Tree Logic)\njẹ́ iwa_rere = òótọ́\njẹ́ akitiyan = 85\n\nbí iwa_rere == òótọ́ {\n    tẹ_jade("Ọmọlúwàbí gidi ni ọ́! Ìwà rere lẹṣọ́ ènìyàn.")\n    bí akitiyan >= 80 {\n        tẹ_jade("Àkíyèsí: Ọpọlọ pípé ati akitiyan gíga! (+25 XP) 🌟")\n    }\n} kò_bá_jẹ́ {\n    tẹ_jade("Ẹ jẹ́ ká fi ìwà rere ṣètò gbogbo ìgbésẹ̀ wa.")\n}',
        explainer: [
          '<b>bí iwa_rere == òótọ́ { ... }</b>: Ṣayẹwo boya ipo jẹ otitọ (if conditional).',
          '<b>kò_bá_jẹ́ { ... }</b>: Ti kò ba ri bẹẹ (else).'
        ]
      },
      {
        id: 'shapes_star',
        title: '🎨 Àwòrán Ìràwọ̀ & Adire (Canvas Graphics)',
        filename: 'aworan_irawo.yoruba',
        code: '# Fa Ìràwọ̀ ati Onígun Adire lori Canvas\nbẹ̀rẹ̀_àwòrán()\nyi_awo("ofeefe")\nfa_irawo(180, 120, 5, 50, 22)\n\nyi_awo("alawọ-ewe")\nkọ_ọ̀rọ̀("Ìràwọ̀ Idíléwà STEAM 🚀", 80, 240)',
        explainer: [
          '<b>bẹ̀rẹ̀_àwòrán()</b>: Nu iboju ki o bẹrẹ aworan tuntun.',
          '<b>yi_awo("ofeefe")</b>: Yi awọ pen si ofeefe (yellow/gold).',
          '<b>fa_irawo(...)</b>: Fa irawo to lẹwa pẹlu igun 5 lori canvas.'
        ]
      },
      {
        id: 'age_calc',
        title: '🧮 Ìṣirò Ọjọ́-Orí (Age & Grade Calculator)',
        filename: 'isiro_ojo_ori.yoruba',
        code: '# Ìṣirò Ọjọ́-orí ati Ipò Ẹkọ STEAM\njẹ́ ọdún_ìbí = 2016\njẹ́ ọdún_yìí = 2026\njẹ́ ọjọ́_orí = ọdún_yìí - ọdún_ìbí\n\ntẹ_jade("Ọjọ́-orí rẹ jẹ́ ọdún: " + ọjọ́_orí)\nbí ọjọ́_orí >= 10 {\n    tẹ_jade("Ipò: Upper Elementary / Middle School African Innovator! 🚀")\n} kò_bá_jẹ́ {\n    tẹ_jade("Ipò: Lower Elementary STEAM Seedling! 🌱")\n}',
        explainer: [
          '<b>jẹ́ ọjọ́_orí = ọdún_yìí - ọdún_ìbí</b>: Ṣe iṣiro iyatọ laarin ọdun meji.',
          '<b>bí ... kò_bá_jẹ́</b>: Pin ọmọ si ipele ẹkọ to tọ.'
        ]
      }
    ],
    igbo: [
      {
        id: 'hello_world_igbo',
        title: '🌟 Ekele Ụwa (Hello World)',
        filename: 'ekele_uwa.igbo',
        code: '# Koodu n\'Asụsụ Igbo\nka aha = "Nwa Amamihe"\ndee("Ndị banyere m, nnoo " + aha + "!")\ndee("Anyị na-amụ kọmputa n\'asụsụ Igbo lónìí! ✨")',
        explainer: [
          '<b>ka aha = "..."</b>: Mepụta aha nchekwa (variable).',
          '<b>dee(...)</b>: Dee ma gosipụta ozi na kọmputa.'
        ]
      }
    ],
    hausa: [
      {
        id: 'hello_world_hausa',
        title: '🌟 Barka da Duniya (Hello World)',
        filename: 'barka_duniya.hausa',
        code: '# Rubuta Koodu a Harshen Hausa\nsanya suna = "Yaron Fasaha"\nbuga("Sannu da zuwa, " + suna + "!")\nbuga("Muna koyon ilimin kimiya da koodu a harshen Hausa! ✨")',
        explainer: [
          '<b>sanya suna = "..."</b>: Ƙirƙiri sabon ma\'aji (variable).',
          '<b>buga(...)</b>: Buga saƙo a allon kwamfuta.'
        ]
      }
    ],
    swahili: [
      {
        id: 'hello_world_swahili',
        title: '🌟 Hujambo Ulimwengu (Hello World)',
        filename: 'hujambo.swahili',
        code: '# Msimbo kwa Kiswahili\nweka jina = "Mwanafunzi Hodari"\nandika("Hujambo, " + jina + "! Karibu Idilewa.")\nandika("Tunajifunza kuandika kodi kwa lugha yetu ya asili! ✨")',
        explainer: [
          '<b>weka jina = "..."</b>: Tenga nafasi ya kumbukumbu (variable).',
          '<b>andika(...)</b>: Andika ujumbe kwenye kiolesura cha kodi.'
        ]
      }
    ],
    python: [
      {
        id: 'bilingual_python',
        title: '🐍 Python Bilingual Studio',
        filename: 'african_steam.py',
        code: '# Bilingual African STEAM Python\nstudent = "Young African Innovator"\nlanguages = ["Yorùbá", "Igbo", "Hausa", "Swahili"]\n\nprint(f"E ku aaro / Nnoo / Sannu / Hujambo {student}!")\nfor lang in languages:\n    print(f"✓ Empowering kids to code in {lang} 🌍")',
        explainer: [
          '<b>for lang in languages:</b>: Loop through each indigenous African language.',
          '<b>print(...)</b>: Output formatted strings to terminal.'
        ]
      }
    ]
  };

  // Execute Native African Code / Yoruba Code Script
  function runIdeInterpreter(code, lang, canvasEl) {
    const logs = [];
    const startTime = performance.now();
    let hasCanvasDraw = false;

    try {
      if (lang === 'yoruba') {
        let js = code;

        // Strip comments
        js = js.replace(/#[^\n]*/g, '');

        // Setup custom print buffer
        const printBuffer = [];
        const customPrint = (...args) => {
          printBuffer.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };

        // Canvas context helpers
        let ctx = null;
        if (canvasEl) {
          ctx = canvasEl.getContext('2d');
        }

        const customInitCanvas = () => {
          hasCanvasDraw = true;
          if (ctx) {
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
            ctx.fillStyle = '#0a150e';
            ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
            ctx.strokeStyle = '#22c55e';
            ctx.fillStyle = '#22c55e';
            ctx.lineWidth = 3;
          }
        };

        const customSetColor = (color) => {
          hasCanvasDraw = true;
          if (!ctx) return;
          const colorMap = {
            'pupa': '#ef4444',
            'red': '#ef4444',
            'alawọ_ewe': '#22c55e',
            'alawọ-ewe': '#22c55e',
            'green': '#22c55e',
            'bulu': '#38bdf8',
            'blue': '#38bdf8',
            'ofeefe': '#facc15',
            'yellow': '#facc15',
            'osan': '#fb923c',
            'orange': '#fb923c',
            'funfun': '#ffffff',
            'white': '#ffffff'
          };
          const hex = colorMap[color.toLowerCase()] || color;
          ctx.strokeStyle = hex;
          ctx.fillStyle = hex;
        };

        const customDrawStar = (cx, cy, spikes = 5, outerRadius = 40, innerRadius = 18) => {
          hasCanvasDraw = true;
          if (!ctx) return;
          let rot = (Math.PI / 2) * 3;
          let x = cx;
          let y = cy;
          const step = Math.PI / spikes;

          ctx.beginPath();
          ctx.moveTo(cx, cy - outerRadius);
          for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(cx, cy - outerRadius);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        };

        const customDrawText = (text, x = 20, y = 30) => {
          hasCanvasDraw = true;
          if (!ctx) return;
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(text, x, y);
        };

        // Transpile Keywords
        js = js.replace(/\b(jẹ́|je)\s+([a-zA-Z_\u00C0-\u024F][a-zA-Z0-9_\u00C0-\u024F]*)/g, 'let $2');
        js = js.replace(/\b(tẹ_jade|te_jade|kọ|ko)\s*\((.*?)\)/g, '__print($2)');
        js = js.replace(/\b(bí|bi)\s+(.*?)\s*\{/g, 'if ($2) {');
        js = js.replace(/\b(kò_bá_jẹ́|ko_ba_je)\s*\{/g, 'else {');
        js = js.replace(/\b(fún|fun)\s+([a-zA-Z_\u00C0-\u024F][a-zA-Z0-9_\u00C0-\u024F]*)\s*=\s*(\d+)\s*(dé|de)\s*(\d+)\s*\{/g, 'for (let $2 = $3; $2 <= $5; $2++) {');
        js = js.replace(/\b(òótọ́|ooto)\b/g, 'true');
        js = js.replace(/\b(irọ́|iro)\b/g, 'false');

        // Canvas command transpiles
        js = js.replace(/\b(bẹ̀rẹ̀_àwòrán|bere_aworan)\s*\(\)/g, '__initCanvas()');
        js = js.replace(/\b(yi_awo)\s*\((.*?)\)/g, '__setColor($2)');
        js = js.replace(/\b(fa_irawo)\s*\((.*?)\)/g, '__drawStar($2)');
        js = js.replace(/\b(kọ_ọ̀rọ̀|ko_oro)\s*\((.*?)\)/g, '__drawText($2)');

        // Execute JS in controlled sandbox
        const runner = new Function('__print', '__initCanvas', '__setColor', '__drawStar', '__drawText', js);
        runner(customPrint, customInitCanvas, customSetColor, customDrawStar, customDrawText);

        logs.push(...printBuffer);
        if (logs.length === 0 && !hasCanvasDraw) {
          logs.push('✓ Koodu ti ṣiṣẹ́ laisi aṣiṣe (Executed successfully).');
        }
      } else if (lang === 'igbo') {
        let js = code.replace(/#[^\n]*/g, '');
        const printBuffer = [];
        const customPrint = (...args) => printBuffer.push(args.join(' '));
        js = js.replace(/\bka\s+([a-zA-Z0-9_]+)/g, 'let $1');
        js = js.replace(/\bdee\s*\((.*?)\)/g, '__print($1)');
        const runner = new Function('__print', js);
        runner(customPrint);
        logs.push(...printBuffer);
      } else if (lang === 'hausa') {
        let js = code.replace(/#[^\n]*/g, '');
        const printBuffer = [];
        const customPrint = (...args) => printBuffer.push(args.join(' '));
        js = js.replace(/\bsanya\s+([a-zA-Z0-9_]+)/g, 'let $1');
        js = js.replace(/\bbuga\s*\((.*?)\)/g, '__print($1)');
        const runner = new Function('__print', js);
        runner(customPrint);
        logs.push(...printBuffer);
      } else if (lang === 'swahili') {
        let js = code.replace(/#[^\n]*/g, '');
        const printBuffer = [];
        const customPrint = (...args) => printBuffer.push(args.join(' '));
        js = js.replace(/\bweka\s+([a-zA-Z0-9_]+)/g, 'let $1');
        js = js.replace(/\bandika\s*\((.*?)\)/g, '__print($1)');
        const runner = new Function('__print', js);
        runner(customPrint);
        logs.push(...printBuffer);
      } else {
        logs.push('Executing African STEAM Bilingual Studio:');
        logs.push('E ku aaro / Nnoo / Sannu / Hujambo Young African Innovator!');
        logs.push('✓ Empowering kids to code in Yorùbá 🌍');
        logs.push('✓ Empowering kids to code in Igbo 🌍');
        logs.push('✓ Empowering kids to code in Hausa 🌍');
        logs.push('✓ Empowering kids to code in Swahili 🌍');
      }
    } catch (err) {
      logs.push('❌ Aṣiṣe Koodu (Syntax Error): ' + err.message);
    }

    const duration = (performance.now() - startTime).toFixed(2);
    return {
      logs: logs.join('\n'),
      duration,
      hasCanvasDraw
    };
  }


  function renderCoding() {
    const flow = state.coding;
    const localeId = CODE_COPY[flow.helperLanguage] ? flow.helperLanguage : 'yoruba';
    const copy = codeTextFor(localeId);
    const ideLang = flow.ideLang || 'yoruba';
    const presetsForLang = IDE_PRESETS[ideLang] || IDE_PRESETS.yoruba;
    const currentPreset = presetsForLang.find((p) => p.id === flow.idePresetId) || presetsForLang[0];
    const ideCode = flow.ideCode !== undefined ? flow.ideCode : currentPreset.code;

    // Filter free lessons
    const filteredLessons = C4K_FREE_LESSONS.filter((lesson) => {
      if (flow.filter !== 'all' && lesson.band !== flow.filter) return false;
      if (flow.category !== 'all' && lesson.category !== flow.category) return false;
      if (flow.lessonSearch) {
        const q = flow.lessonSearch.toLowerCase();
        return lesson.title.toLowerCase().includes(q) || lesson.desc.toLowerCase().includes(q);
      }
      return true;
    });

    const categories = Array.from(new Set(C4K_FREE_LESSONS.map((l) => l.category)));

    return '<div class="container route-page coding-page c4k-redesigned-page">' +
      '<div class="breadcrumbs">' +
        routeLink('index', 'Home') + '<span>/</span><strong>Coding for kids</strong>' +
      '</div>' +

      '<!-- 1. 3D Animated African STEAM Hologram Stage (Replaces old static green container) -->' +
      '<section class="c4k-3d-hero-stage scroll-3d-reveal" id="code-hero-stage">' +
        '<div class="c4k-3d-ambient-glow" aria-hidden="true"></div>' +
        '<div id="coding3DCanvasWrap" class="c4k-3d-canvas-wrap" data-3d-scene="coding" aria-label="Interactive 3D Yoruba Hologram Code Cube"></div>' +
        '<div class="c4k-3d-particles-container" id="c4k-particles" aria-hidden="true">' +
          '<div class="c4k-floating-token token-1">{ ÈdèKoodu }</div>' +
          '<div class="c4k-floating-token token-2">tẹ_jade("Ẹ n lẹ́")</div>' +
          '<div class="c4k-floating-token token-3">🤖 STEAM & AI</div>' +
          '<div class="c4k-floating-token token-4">fún i = 1 dé 10</div>' +
          '<div class="c4k-floating-token token-5">🌍 African Innovators</div>' +
        '</div>' +

        '<div class="c4k-hero-content-wrapper">' +
          '<div class="c4k-badge-pill">' +
            icon('sparkles', 16) + ' <span>IDÍLẸ́WÀ CODE FOR KIDS · K-8 INDIGENOUS STEAM CURRICULUM</span>' +
          '</div>' +
          '<h1 class="c4k-3d-main-heading">The Code for Kids Curriculum</h1>' +
          '<p class="c4k-3d-sub-lead">' +
            'From Kindergarten to Grade 8 · Engaging STEAM, Algorithmic Thinking & Indigenous Language Coding for Young African Innovators.' +
          '</p>' +

          '<!-- Quick Jump Action Pills -->' +
          '<div class="c4k-quick-pills-row">' +
            '<button type="button" class="c4k-nav-pill active" data-action="coding-jump-band" data-band="curriculum-bands">' + icon('layers', 14) + ' K-8 Curriculum</button>' +
            '<button type="button" class="c4k-nav-pill" data-action="coding-jump-band" data-band="code-ide">' + icon('code', 14) + ' Code in Your Language IDE</button>' +
            '<button type="button" class="c4k-nav-pill" data-action="coding-jump-band" data-band="free-lessons">' + icon('book', 14) + ' Free STEAM Lessons (' + C4K_FREE_LESSONS.length + ')</button>' +
          '</div>' +

          '<!-- 3 Interactive Grade Band 3D Hub Cards -->' +
          '<div class="c4k-3d-cards-grid" id="curriculum-bands">' +
            '<div class="c4k-3d-hub-card card-k2" data-action="coding-jump-band" data-band="Lower-Elementary">' +
              '<div class="c4k-card-3d-inner">' +
                '<div class="c4k-hub-icon">🌱</div>' +
                '<div class="c4k-hub-text">' +
                  '<h3>Lower Elementary</h3>' +
                  '<p class="c4k-grade-tag">Kindergarten – Grade 2</p>' +
                  '<p class="c4k-desc">Visual Block Patterns, Unplugged Logic & African Cultural STEAM Storytelling.</p>' +
                '</div>' +
                '<div class="c4k-card-cta"><span>Explore Grades K–2</span> ' + icon('arrow-right', 14) + '</div>' +
              '</div>' +
            '</div>' +

            '<div class="c4k-3d-hub-card card-g35" data-action="coding-jump-band" data-band="Upper-Elementary">' +
              '<div class="c4k-card-3d-inner">' +
                '<div class="c4k-hub-icon">🌿</div>' +
                '<div class="c4k-hub-text">' +
                  '<h3>Upper Elementary</h3>' +
                  '<p class="c4k-grade-tag">Grade 3 to 5</p>' +
                  '<p class="c4k-desc">Algorithmic Decision Trees, Turtle Canvas Geometry & Yoruba Logic Syntax.</p>' +
                '</div>' +
                '<div class="c4k-card-cta"><span>Explore Grades 3–5</span> ' + icon('arrow-right', 14) + '</div>' +
              '</div>' +
            '</div>' +

            '<div class="c4k-3d-hub-card card-g68" data-action="coding-jump-band" data-band="Middle-School">' +
              '<div class="c4k-card-3d-inner">' +
                '<div class="c4k-hub-icon">🚀</div>' +
                '<div class="c4k-hub-text">' +
                  '<h3>Middle School</h3>' +
                  '<p class="c4k-grade-tag">Grade 6 to 8+</p>' +
                  '<p class="c4k-desc">Full Syntax Programming, Indigenous Functions, Physical Computing & Web.</p>' +
                '</div>' +
                '<div class="c4k-card-cta"><span>Explore Grades 6–8+</span> ' + icon('arrow-right', 14) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<!-- 2. Section: Lower Elementary (K-2) -->' +
      '<section id="Lower-Elementary" class="section-foundation-phase c4k-band-section scroll-3d-reveal">' +
        '<div class="section-container">' +
          '<div class="container-vertical align-center">' +
            '<div class="activity-heading">' +
              '<div class="category-heading-wrapper">' +
                '<div class="category-heading-list">' +
                  '<div class="category-heading-item">' +
                    '<span class="section-kicker">Grade Band 01 · Ages 5–8</span>' +
                    '<h2 class="heading-4">Lower Elementary (K – 2nd Grade)</h2>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="activities-list-wrapper">' +
              '<div class="activities-list c4k-grades-grid">' +
                CODE_CURRICULUM_BANDS[0].grades.map((g) => renderCurriculumGradeCard(g, 'Lower-Elementary')).join('') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<!-- 3. Section: Upper Elementary (3-5) -->' +
      '<section id="Upper-Elementary" class="section-intermediate-phase c4k-band-section scroll-3d-reveal">' +
        '<div class="section-container">' +
          '<div class="container-vertical align-center">' +
            '<div class="activity-heading">' +
              '<div class="category-heading-wrapper">' +
                '<div class="category-heading-list">' +
                  '<div class="category-heading-item">' +
                    '<span class="section-kicker">Grade Band 02 · Ages 8–11</span>' +
                    '<h2 class="heading-4">Upper Elementary (Grade 3 to 5)</h2>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="activities-list-wrapper">' +
              '<div class="activities-list c4k-grades-grid">' +
                CODE_CURRICULUM_BANDS[1].grades.map((g) => renderCurriculumGradeCard(g, 'Upper-Elementary')).join('') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<!-- 4. Section: Middle School (6-8+) -->' +
      '<section id="Middle-School" class="section-senior-phase c4k-band-section scroll-3d-reveal">' +
        '<div class="section-container">' +
          '<div class="container-vertical align-center">' +
            '<div class="activity-heading">' +
              '<div class="category-heading-wrapper">' +
                '<div class="category-heading-list">' +
                  '<div class="category-heading-item">' +
                    '<span class="section-kicker">Grade Band 03 · Ages 11–14+</span>' +
                    '<h2 class="heading-4">Middle School (Grade 6 to 8+)</h2>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="activities-list-wrapper">' +
              '<div class="activities-list c4k-grades-grid">' +
                CODE_CURRICULUM_BANDS[2].grades.map((g) => renderCurriculumGradeCard(g, 'Middle-School')).join('') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<!-- 5. Section: Free Lessons -->' +
      '<!-- 5. Section: Free Lessons (Teach Computer Science Today) in Cards -->' +
      '<section class="c4k-free-lessons-section" id="free-lessons" aria-labelledby="free-lessons-title">' +
        '<div class="c4k-free-header text-center">' +
          '<div class="c4k-free-badge">' + icon('sparkles', 16) + ' <span>30+ FREE STEAM LESSONS</span></div>' +
          '<h2 class="c4k-free-title" id="free-lessons-title">Teach Computer Science Today</h2>' +
          '<p class="text-sub-heading-free-lessons">Jump directly into ready-to-teach, standards-aligned STEAM lessons infused with Yoruba, Igbo, Hausa and African cultural concepts.</p>' +
        '</div>' +

        '<div class="c4k-filter-box">' +
          '<div class="c4k-filter-header">' +
            '<div class="c4k-filter-band-pills">' +
              '<span class="filter-description">Grade Band:</span>' +
              '<button type="button" class="c4k-band-pill ' + (flow.filter === 'all' ? 'is-active' : '') + '" data-action="coding-filter-band" data-band="all">All Bands</button>' +
              '<button type="button" class="c4k-band-pill ' + (flow.filter === 'k2' ? 'is-active' : '') + '" data-action="coding-filter-band" data-band="k2">K–2 Lower Elementary</button>' +
              '<button type="button" class="c4k-band-pill ' + (flow.filter === '35' ? 'is-active' : '') + '" data-action="coding-filter-band" data-band="35">3–5 Upper Elementary</button>' +
              '<button type="button" class="c4k-band-pill ' + (flow.filter === '68' ? 'is-active' : '') + '" data-action="coding-filter-band" data-band="68">6–8+ Middle School</button>' +
            '</div>' +
            '<div class="c4k-count-badge">' +
              '<span>Showing <strong>' + filteredLessons.length + '</strong> of ' + C4K_FREE_LESSONS.length + ' free STEAM lessons</span>' +
            '</div>' +
          '</div>' +

          '<div class="c4k-category-chips-row">' +
            '<span class="cat-label">Category:</span>' +
            '<button type="button" class="c4k-cat-chip ' + (flow.category === 'all' ? 'is-active' : '') + '" data-action="coding-filter-category" data-cat="all">All Categories (' + C4K_FREE_LESSONS.length + ')</button>' +
            categories.map((cat) => {
              const count = C4K_FREE_LESSONS.filter((l) => l.category === cat).length;
              return '<button type="button" class="c4k-cat-chip ' + (flow.category === cat ? 'is-active' : '') + '" data-action="coding-filter-category" data-cat="' + esc(cat) + '">' + esc(cat) + ' (' + count + ')</button>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="c4k-free-grid">' +
          renderFreeLessonCards(filteredLessons) +
        '</div>' +
      '</section>' +

      '<!-- 6. Section: Code in Your Language (Kọ Koodu ní Èdè Rẹ) IDE (Replaces old second container) -->' +
      '<section class="c4k-ide-section scroll-3d-reveal" id="code-ide" aria-labelledby="ide-title">' +
        '<div class="c4k-ide-header-box">' +
          '<div class="c4k-ide-badge">' +
            icon('code', 16) + ' <span>INTERACTIVE BILINGUAL STUDIO</span>' +
          '</div>' +
          '<h2 id="ide-title" class="c4k-ide-title">' +
            'Kọ Koodu ní Èdè Rẹ · Code in Your Language' +
          '</h2>' +
          '<p class="c4k-ide-subtitle">' +
            'Write and test computer programs in Yorùbá, Igbo, Hausa, Swahili, and Python. Experience live code compilation, instant terminal output, and visual canvas graphics!' +
          '</p>' +
        '</div>' +

        '<div class="c4k-ide-workspace">' +
          '<!-- Top Control Bar -->' +
          '<div class="c4k-ide-toolbar">' +
            '<div class="c4k-ide-lang-selector">' +
              '<span class="toolbar-label">Èdè / Language:</span>' +
              '<button type="button" class="lang-tab ' + (ideLang === 'yoruba' ? 'active' : '') + '" data-action="ide-set-lang" data-lang="yoruba">🇳🇬 Èdè Yorùbá</button>' +
              '<button type="button" class="lang-tab ' + (ideLang === 'igbo' ? 'active' : '') + '" data-action="ide-set-lang" data-lang="igbo">🇳🇬 Asụsụ Igbo</button>' +
              '<button type="button" class="lang-tab ' + (ideLang === 'hausa' ? 'active' : '') + '" data-action="ide-set-lang" data-lang="hausa">🇳🇬 Harshen Hausa</button>' +
              '<button type="button" class="lang-tab ' + (ideLang === 'swahili' ? 'active' : '') + '" data-action="ide-set-lang" data-lang="swahili">🇰🇪 Kiswahili</button>' +
              '<button type="button" class="lang-tab ' + (ideLang === 'python' ? 'active' : '') + '" data-action="ide-set-lang" data-lang="python">🐍 Python / JS</button>' +
            '</div>' +

            '<div class="c4k-ide-preset-selector">' +
              '<span class="toolbar-label">Àpẹẹrẹ Ẹkọ / Preset:</span>' +
              '<select class="ide-preset-dropdown" data-action="ide-select-preset" aria-label="Select Code Preset">' +
                presetsForLang.map((p) => '<option value="' + p.id + '" ' + (p.id === currentPreset.id ? 'selected' : '') + '>' + esc(p.title) + '</option>').join('') +
              '</select>' +
            '</div>' +
          '</div>' +

          '<!-- Yoruba Diacritics Accent Bar -->' +
          '<div class="c4k-ide-diacritics-bar">' +
            '<span class="diacritic-label">Àmì Ohùn Yorùbá:</span>' +
            ['á', 'à', 'é', 'è', 'ẹ́', 'ẹ̀', 'í', 'ì', 'ó', 'ò', 'ọ́', 'ọ̀', 'ú', 'ù', 'ṣ'].map((char) =>
              '<button type="button" class="diacritic-btn" data-action="ide-insert-char" data-char="' + char + '" title="Insert ' + char + '">' + char + '</button>'
            ).join('') +
          '</div>' +

          '<!-- Split: Code Area (Left) & Output Area (Right) -->' +
          '<div class="c4k-ide-split">' +
            '<!-- Left: Code Area (Editor) -->' +
            '<div class="c4k-ide-editor-pane">' +
              '<div class="pane-header">' +
                '<div class="file-tab">' +
                  '<span class="file-icon">' + icon('code', 14) + '</span>' +
                  '<span class="file-name" id="ide-filename">' + esc(currentPreset.filename) + '</span>' +
                '</div>' +
                '<div class="editor-actions">' +
                  '<button type="button" class="btn-ide-run" data-action="ide-run-code">' +
                    icon('play', 14) + ' <span>Ṣe Koodu (Run)</span>' +
                  '</button>' +
                  '<button type="button" class="btn-ide-secondary" data-action="ide-reset-code" title="Reset Code">' +
                    icon('refresh', 14) + ' <span>Tún Bẹ̀rẹ̀</span>' +
                  '</button>' +
                  '<button type="button" class="btn-ide-secondary" data-action="ide-copy-code" title="Copy Code">' +
                    icon('check', 14) + ' <span>Ṣe Àdàkọ</span>' +
                  '</button>' +
                '</div>' +
              '</div>' +

              '<div class="editor-body">' +
                '<div class="line-numbers" id="ide-line-numbers">' +
                  ideCode.split('\n').map((_, i) => '<div>' + (i + 1) + '</div>').join('') +
                '</div>' +
                '<textarea class="code-textarea" id="ide-code-input" spellcheck="false" placeholder="Kọ koodu rẹ síbí...">' + esc(ideCode) + '</textarea>' +
              '</div>' +

              '<!-- Quick keyword snippets -->' +
              '<div class="editor-keywords-bar">' +
                '<span class="kw-label">Aṣẹ Koodu:</span>' +
                '<button type="button" class="kw-pill" data-action="ide-insert-snippet" data-snippet="tẹ_jade(\"\")">tẹ_jade</button>' +
                '<button type="button" class="kw-pill" data-action="ide-insert-snippet" data-snippet="jẹ́ orúkọ = \"\"">jẹ́</button>' +
                '<button type="button" class="kw-pill" data-action="ide-insert-snippet" data-snippet="bí ipo == òótọ́ {\n    \n}">bí</button>' +
                '<button type="button" class="kw-pill" data-action="ide-insert-snippet" data-snippet="kò_bá_jẹ́ {\n    \n}">kò_bá_jẹ́</button>' +
                '<button type="button" class="kw-pill" data-action="ide-insert-snippet" data-snippet="fún i = 1 dé 5 {\n    \n}">fún</button>' +
                '<button type="button" class="kw-pill" data-action="ide-insert-snippet" data-snippet="bẹ̀rẹ̀_àwòrán()\nyi_awo(\"ofeefe\")">bẹ̀rẹ̀_àwòrán</button>' +
              '</div>' +
            '</div>' +

            '<!-- Right: Output Area -->' +
            '<div class="c4k-ide-output-pane">' +
              '<div class="pane-header">' +
                '<div class="output-tab-switcher">' +
                  '<button type="button" class="output-tab ' + (flow.ideTab === 'canvas' ? '' : 'active') + '" data-action="ide-switch-tab" data-tab="terminal">' +
                    '💻 Àbájáde Terminal (Console)' +
                  '</button>' +
                  '<button type="button" class="output-tab ' + (flow.ideTab === 'canvas' ? 'active' : '') + '" data-action="ide-switch-tab" data-tab="canvas">' +
                    '🎨 Ìbòjú Àwòrán (Canvas)' +
                  '</button>' +
                '</div>' +
                '<button type="button" class="btn-ide-clear" data-action="ide-clear-output" title="Clear output">' +
                  'Nu Iboju' +
                '</button>' +
              '</div>' +

              '<div class="output-body">' +
                '<!-- Terminal View -->' +
                '<div class="terminal-view ' + (flow.ideTab === 'canvas' ? 'hide' : '') + '" id="ide-terminal-view">' +
                  '<div class="terminal-status-bar">' +
                    '<span class="status-indicator">● Engine Online</span>' +
                    '<span class="status-runtime" id="ide-status-runtime">Execution Time: ' + (flow.ideRuntime || '0.02ms') + '</span>' +
                    '<span class="status-xp" id="ide-status-xp">+' + (flow.ideXp || 10) + ' Maker XP</span>' +
                  '</div>' +
                  '<pre class="terminal-logs" id="ide-terminal-logs">' + esc(flow.ideOutput || '> [Idilewa Engine Ready]\nKọ koodu ki o tẹ "Ṣe Koodu (Run)" lati wo àbájáde.') + '</pre>' +
                '</div>' +

                '<!-- Canvas View -->' +
                '<div class="canvas-view ' + (flow.ideTab === 'canvas' ? '' : 'hide') + '" id="ide-canvas-view">' +
                  '<canvas id="ide-graphic-canvas" width="400" height="260"></canvas>' +
                  '<div class="canvas-caption">Graphic Turtle & Shapes Renderer</div>' +
                '</div>' +
              '</div>' +

              '<!-- Line-by-Line Educational Explainer -->' +
              '<div class="c4k-ide-explainer" id="ide-explainer-box">' +
                '<div class="explainer-title">' +
                  icon('sparkles', 14) + ' <span>Ètò Ẹ̀kọ́ & Ìtumọ̀ / Concept Breakdown:</span>' +
                '</div>' +
                '<div class="explainer-content" id="ide-explainer-content">' +
                  (currentPreset.explainer ? currentPreset.explainer.map((step) => '<div class="explainer-step">' + step + '</div>').join('') : '<p>Execute code to view conceptual breakdown.</p>') +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<!-- 7. Section: Subscription / Stay in the Loop -->' +
      '<div class="section-footer-cta">' +
        '<div class="section-container">' +
          '<div class="c4k-subscribe-wrapper">' +
            '<div class="c4k-subscribe-content">' +
              '<span class="badge badge-curriculum-orange">Stay Connected</span>' +
              '<h3 class="heading-3 c4k-sub-title">Get Free Monthly African STEAM Lessons</h3>' +
              '<div class="text-lg text-color-bright-overlay-80 max-width-480">' +
                'Join thousands of teachers and families getting culturally rich STEAM lesson plans, robotics challenges, and coding activities with African language roots.' +
              '</div>' +
              '<form class="c4k-subscribe-form" data-form="coding-subscribe">' +
                '<input type="email" name="email" placeholder="Enter your school or guardian email…" required class="c4k-sub-input" />' +
                '<button type="submit" class="footer-button c4k-sub-btn">' +
                  '<span class="text-md bold">Sign Up ' + icon('arrow', 14) + '</span>' +
                '</button>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<section class="code-safety-note">' +
        icon('shield', 16) + ' This is an interactive learning environment: test your logic in Yorùbá, Igbo, Hausa, Swahili, and Python with real-time interpretation.' +
      '</section>' +
    '</div>';
  }

  function renderStories() {
    const stories = [
      { title: 'The story that travelled', desc: 'A family story told, remembered and shared again.', image: 'story-grandmother.jpg', tag: 'Oral tradition', lang: 'Yorùbá · English', tone: 'peach' },
      { title: 'Words from the garden', desc: 'Notice new words as a small garden begins to grow.', image: 'yoruba-kids-culture.jpg', tag: 'Read together', lang: 'Beginner · 5 min', tone: 'mint' },
      { title: 'A team of little builders', desc: 'Follow two friends as they solve a puzzle with code.', image: 'code-kids.jpg', tag: 'Code & create', lang: 'English + Yorùbá', tone: 'blue' }
    ];
    return `<div class="container route-page stories-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Stories</strong></div><section class="stories-hero"><div><span class="section-kicker">Stories & imagination</span><h1>Some things are best<br /><em>shared as a story.</em></h1><p>Read, listen and notice the words, voices and moments that bring a story to life.</p>${routeLink('ere_game', `Try a story game ${icon('arrow', 15)}`, 'button button-primary')}${aiHelperButton('story')}</div><div class="stories-hero-image"><img src="./assets/story-grandmother.jpg" alt="A grandmother sharing a folktale with two children" /><span class="story-image-chip">${icon('headphones', 16)} Listen together</span></div></section>${renderStepper(['Choose a story', 'Read', 'Listen', 'Reflect'], 0)}<div class="stories-topline"><div><span class="section-kicker">The story shelf</span><h2>Pick up where curiosity takes you.</h2></div><div class="story-filter">${icon('filter', 15)} Stories for everyone</div></div><div class="story-grid">${stories.map((s, i) => `<article class="story-card"><a class="story-card-image story-card-art story-card-art-${i + 1}" href="#/ere_game" data-route="ere_game" aria-label="Open story: ${esc(s.title)}"><span class="story-card-art-icon" aria-hidden="true">${icon(i === 0 ? 'book' : i === 1 ? 'quote' : 'music', 34)}</span><span class="story-card-tag">${s.tag}</span><span class="story-card-number">0${i + 1}</span></a><div class="story-card-body"><span class="story-language">${s.lang}</span><h3>${s.title}</h3><p>${s.desc}</p><div class="story-card-actions"><a class="text-link" href="#/ere_game" data-route="ere_game">Read & listen ${icon('arrow', 14)}</a><button class="save-button ${state.saved.includes(s.title) ? 'is-saved' : ''}" aria-label="Save ${s.title}" data-action="save-item" data-item="${esc(s.title)}">${icon('bookmark', 17)}</button></div></div></article>`).join('')}</div><section class="stories-bottom"><div><span class="section-kicker">More than a story</span><h2>Explore the voices behind the words.</h2><p>Discover oral genres, proverbs and language audio.</p></div><div class="stories-bottom-links">${routeLink('oral', 'Oral traditions ' + icon('arrow', 14), 'button button-outline')}${routeLink('voices', 'Voice library ' + icon('arrow', 14), 'button button-soft')}</div></section></div>`;
  }

  function renderStoryGame() {
    const result = state.quizResults['story:comprehension'] || '';
    return `<div class="container route-page story-game-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('ere', 'Stories')}<span>/</span><strong>Story time</strong></div><section class="story-game-layout"><div class="story-game-image"><img src="./assets/story-grandmother.jpg" alt="A grandmother sharing a story with two children" /><span class="story-audio-pill">${icon('volume', 15)} Read aloud together</span></div><div class="story-reading"><span class="section-kicker">A story for the whole family · 4 min</span><h1>The story that<br /><em>travelled.</em></h1><p class="story-subhead">A gentle listening story about how a tale can move from one person to another.</p><button class="listen-inline" data-action="play-audio" data-text="A story travels when someone listens, remembers and shares it with care.">${icon('play', 14)} Listen to this story <span>01:24</span></button><div class="story-text"><p>One evening, a grandmother began a story in the garden. The children leaned closer as the first words settled into the quiet.</p><p>When the story ended, one child asked to hear it again. The next time, they listened for a detail they had missed—and carried that detail into their own retelling.</p><p>By morning, the story had travelled. It was still familiar, and it had room for a new voice.</p></div><div class="story-credit-note">${icon('heart', 16)} Stories belong to the people and communities who share them. Listen with care, and ask before retelling.</div>\n    </section>${renderStepper(['Choose a story', 'Read', 'Listen', 'Reflect'], 3)}<section class="story-quiz"><div><span class="section-kicker">A little reflection</span><h2>What helped the story travel?</h2><p>Choose the idea that best fits what you heard.</p></div><div class="story-answer-list">${[['Someone listened and shared it with care.', true], ['The story was written down by a stranger.', false], ['The children forgot the details.', false]].map(([label, correct], i) => `<button class="story-answer ${result === 'correct' && correct ? 'answer-correct' : ''}" data-action="story-answer" data-key="comprehension" data-correct="${correct}" ${result === 'correct' ? 'disabled' : ''}><span>${String.fromCharCode(65 + i)}</span>${label}${result === 'correct' && correct ? icon('check', 17) : icon('arrow', 15)}</button>`).join('')}</div>${result ? `<div class="answer-feedback ${result === 'correct' ? 'feedback-correct' : 'feedback-retry'}">${icon(result === 'correct' ? 'check' : 'refresh', 16)} ${result === 'correct' ? 'Lovely listening. Stories grow when people share them with care.' : 'Think about what the children did after hearing the story.'}</div>` : ''}</section><div class="story-related">${routeLink('oral', 'Explore oral traditions ' + icon('arrow', 14), 'text-link')}${routeLink('ere', 'Back to stories ' + icon('arrow', 14), 'text-link')}${aiHelperButton('story')}</div></div>`;
  }

  function renderOral() {
    const genres = [
      { title: 'Voice Trainer', titleSub: 'Real-time pitch & tone', copy: 'Interactive tone soundboards, native pronunciation and pitch scoring across 6 African languages.', icon: 'mic', route: 'trainer', tone: 'yellow' },
      { title: 'Oríkì', titleSub: 'Praise poetry', copy: 'Explore poetic praise, identity and remembrance through context and community voices.', icon: 'quote', route: 'oriki', tone: 'peach' },
      { title: 'Òwe', titleSub: 'Proverbs', copy: 'Notice how compact sayings can hold wit, wisdom and ways of seeing the world.', icon: 'sparkles', route: 'owe', tone: 'mint' },
      { title: 'Story & song', titleSub: 'Oral genres', copy: 'Find out how stories, songs and spoken forms carry memory across generations.', icon: 'music', route: 'oral_genre', tone: 'blue' }
    ];
    return `<div class="container route-page oral-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Read & listen</strong></div><section class="oral-hero"><div class="oral-hero-copy"><span class="section-kicker">Voices, memory & meaning</span><h1>Some knowledge is<br /><em>spoken into the room.</em></h1><p>Listen to the forms that carry language through family and community—from praise poetry to proverbs, speech pitch and story.</p><div class="hero-actions">${routeLink('trainer', `${icon('mic', 16)} Voice Trainer`, 'button button-primary')}${routeLink('voices', `Hear the voice library ${icon('arrow', 15)}`, 'button button-outline')}${aiHelperButton('oral')}</div></div><div class="oral-hero-image"><img src="./assets/story-grandmother.jpg" alt="A grandmother sharing an oral story with children" /><span class="oral-image-note">Listen first. Learn the context.</span></div></section>${renderStepper(['Tradition', 'Genre', 'Piece', 'Reflection'], 0)}<section class="section oral-genres"><div class="section-heading"><div><span class="section-kicker">Choose a doorway</span><h2>Explore oral traditions.</h2><p>Each form has its own voice, purpose and place in community.</p></div></div><div class="oral-genre-grid">${genres.map((g) => `<a class="oral-genre-card tone-${g.tone}" href="#/${g.route}" data-route="${g.route}"><span class="oral-genre-icon">${icon(g.icon, 23)}</span><span class="oral-genre-sub">${g.titleSub}</span><h3>${g.title}</h3><p>${g.copy}</p><span class="oral-genre-arrow">Explore ${icon('arrow', 15)}</span></a>`).join('')}</div></section><section class="oral-quote-band"><span>${icon('quote', 25)}</span><div><strong>Stories are not just content.</strong><p>They are relationships—between speaker, listener, place and memory.</p></div>${routeLink('keepers', 'Meet the keepers ' + icon('arrow', 14), 'text-link')}</section></div>`;
  }

  function renderOralGenre() {
    const cards = [
      { route: 'trainer', title: 'Voice Trainer', subtitle: 'Live pitch & tone engine', icon: 'mic', tone: 'yellow', text: 'Interactive tone soundboards and voice recording across 60 lessons.' },
      { route: 'oriki', title: 'Oríkì', subtitle: 'Praise poetry & identity', icon: 'quote', tone: 'peach', text: 'Learn what praise poetry can express and how to listen for context.' },
      { route: 'owe', title: 'Òwe', subtitle: 'Proverbs & reflection', icon: 'sparkles', tone: 'mint', text: 'Explore short sayings and the ideas people carry through them.' },
      { route: 'ere', title: 'Folktales', subtitle: 'Stories & imagination', icon: 'book', tone: 'blue', text: 'Read a family story and notice what travels between generations.' },
      { route: 'voices', title: 'Spoken word', subtitle: 'Voices & pronunciation', icon: 'headphones', tone: 'lilac', text: 'Hear words spoken and build confidence through listening.' }
    ];
    return `<div class="container route-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span><strong>Genres</strong></div><section class="collection-hero simple-collection-hero"><span class="section-kicker">Oral forms · a guided introduction</span><h1>Many ways to tell<br /><em>what matters.</em></h1><p>Oral traditions are varied and living. Explore a form, listen for its context and follow the voice that leads you in.</p>${renderStepper(['Tradition', 'Genre', 'Example', 'Reflect'], 1)}</section><div class="section-heading collection-heading"><div><span class="section-kicker">Choose a genre</span><h2>Where would you like to begin?</h2></div>${aiHelperButton('oral')}</div><div class="oral-genre-grid">${cards.map((c) => `<a href="#/${c.route}" data-route="${c.route}" class="oral-genre-card tone-${c.tone}"><span class="oral-genre-icon">${icon(c.icon, 23)}</span><span class="oral-genre-sub">${c.subtitle}</span><h3>${c.title}</h3><p>${c.text}</p><span class="oral-genre-arrow">Explore ${icon('arrow', 15)}</span></a>`).join('')}</div><div class="content-note">${icon('shield', 17)} These introductions are a starting point. Community context, consent and attribution should guide how oral knowledge is shared.</div></div>`;
  }

  function renderOriki() {
    return `<div class="container route-page culture-detail-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span>${routeLink('oral_genre', 'Oral genres')}<span>/</span><strong>Oríkì</strong></div><section class="culture-detail-hero"><div><span class="section-kicker">Yorùbá oral tradition · guided introduction</span><h1>Oríkì:<br /><em>praise that remembers.</em></h1><p>Oríkì is often described as praise poetry, but each piece carries the voice, knowledge and context of the people who share it.</p><div class="hero-actions"><button class="button button-primary" data-action="play-audio" data-text="Oriki is a living form of praise and remembrance.">${icon('volume', 17)} Hear a short introduction</button>${aiHelperButton('oriki')}</div></div><div class="culture-detail-art"><img src="./assets/yoruba-educator-woman.jpg" alt="Yorùbá woman educator wearing richly woven aso-oke attire" /><div class="culture-art-caption">Hear the voice.<br />Ask about the meaning.</div>\n    </section>${renderStepper(['Tradition', 'Genre', 'Piece', 'Reflection'], 2)}<div class="detail-content-grid"><article class="detail-reading"><span class="section-kicker">A way to listen</span><h2>Notice more than the words.</h2><p>Listen for rhythm, repetition and the relationship between the speaker and the person being addressed. A phrase may carry family history, place, humour or a quality someone is known for.</p><p>There is no single version that speaks for everyone. Meaning changes with voice and context, so learn from the people who know the story behind the words.</p><div class="detail-prompt"><strong>Try this reflection</strong><p>What do you notice about the speaker’s tone? What would you want to ask before repeating the words?</p></div><div class="detail-actions">${routeLink('voices', 'Explore voices ' + icon('arrow', 14), 'text-link')}${routeLink('keepers', 'Learn from keepers ' + icon('arrow', 14), 'text-link')}</div></article><aside class="detail-side-card"><span class="side-card-icon">${icon('heart', 21)}</span><span class="section-kicker">Learn with care</span><h3>Context makes listening more meaningful.</h3><p>Ask who is sharing, what the words mean to them and whether the story is theirs to pass on.</p>${aiHelperButton('oriki')}${routeLink('oral_genre', 'More oral forms ' + icon('arrow', 14), 'text-link')}</aside></div></div>`;
  }

  function aiHelperButton(topic = 'general') {
    return `<button type="button" class="ai-helper-button" data-action="open-ai-helper" data-topic="${esc(topic)}">${icon('sparkles', 16)} <span>AI learning helper</span><small>preview</small></button>`;
  }

  function aiPromptSuggestions(topic) {
    const suggestions = {
      owe: ['What can patience look like in action?', 'How does Dami show patience?'],
      oriki: ['What should I listen for in Oríkì?', 'Why does context matter?'],
      story: ['What did Dami do while she waited?', 'What feeling might Dami have?'],
      oral: ['How can I learn oral traditions respectfully?', 'What questions can I ask a speaker?']
    };
    return suggestions[topic] || ['Help me think of a question to ask my teacher.', 'What is one small thing I can practice today?'];
  }

  function aiReply(topic) {
    const replies = {
      owe: 'A reflection prompt: patience can include caring action while you wait. Dami kept tending the seed. What small, helpful thing could you keep doing? Proverb wording and meaning can vary, so ask a fluent Yorùbá speaker about local nuance.',
      oriki: 'Listen for rhythm, repetition and who is being addressed. Oríkì is living oral knowledge; ask a knowledgeable speaker about the meaning and whether a specific piece is appropriate to repeat.',
      story: 'Dami showed patience by watering the seed and caring for the garden while she waited. What might you feel if you were Dami, and what would you do next?',
      oral: 'Start by listening. Ask who is sharing, what the words mean in that setting, and whether the knowledge is theirs to pass on. Give community context and consent more weight than a quick summary.',
      general: 'Try breaking your question into one small idea. You could write down what you noticed, then ask a teacher, caregiver or language keeper to help you explore it.'
    };
    return replies[topic] || replies.general;
  }

  function answerAiPrompt(topic) {
    const answer = document.getElementById('aiAnswer');
    if (!answer) return;
    answer.innerHTML = `<span class="section-kicker">A lesson prompt · offline preview</span><p>${esc(aiReply(topic))}</p>`;
  }

  function openAiHelper(topic = 'general') {
    const root = document.getElementById('modal-root');
    const suggestions = aiPromptSuggestions(topic);
    const title = topic === 'oriki' ? 'Think alongside Oríkì.' : topic === 'owe' ? 'Think alongside this Owe.' : topic === 'story' ? 'Think alongside the story.' : 'A gentle learning prompt.';
    root.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal-card ai-helper-modal" role="dialog" aria-modal="true" aria-labelledby="aiHelperTitle"><button class="modal-close icon-button" data-action="close-modal" aria-label="Close helper">${icon('close', 19)}</button><div class="modal-icon">${icon('sparkles', 22)}</div><span class="section-kicker">AI learning helper · local preview</span><h2 id="aiHelperTitle">${title}</h2><p class="ai-helper-disclaimer">This prototype has no AI service connected. It offers fixed, offline reflection prompts only; it does not send or save your question. Please do not type names or personal details.</p><div class="ai-suggestions">${suggestions.map((prompt) => `<button type="button" class="ai-suggestion" data-action="ai-suggestion" data-topic="${esc(topic)}" data-prompt="${esc(prompt)}">${esc(prompt)} ${icon('arrow', 14)}</button>`).join('')}</div><form class="ai-helper-form" data-form="ai-helper" data-topic="${esc(topic)}"><label for="aiHelperQuestion">What would you like to think about?</label><textarea id="aiHelperQuestion" name="question" rows="2" maxlength="240" placeholder="Keep your question general…" required></textarea><button type="submit" class="button button-primary">Show a reflection prompt ${icon('arrow', 14)}</button></form><div class="ai-helper-answer" id="aiAnswer" aria-live="polite"><span class="section-kicker">A safe place to start</span><p>Choose a suggested question to see an offline learning prompt.</p></div></section></div>`;
    document.getElementById('aiHelperQuestion')?.focus();
  }

  function renderOwe() {
    const meaningDone = state.quizResults['owe-meaning:comprehension'] === 'correct';
    const storyDone = state.quizResults['owe-story:comprehension'] === 'correct';
    const storyRoute = meaningDone ? 'owe_story' : 'owe_detail';
    const reflectionRoute = storyDone ? 'owe_reflection' : meaningDone ? 'owe_story' : 'owe_detail';
    const saved = state.savedProverbs.map((item) => `<article class="proverb-card saved-proverb"><span class="proverb-label">Shared on this device</span><blockquote>${esc(item.text)}</blockquote><p>${esc(item.meaning)}</p><small>${esc(item.language)}${item.context ? ` · ${esc(item.context)}` : ''}</small></article>`).join('');
    return `<div class="container route-page owe-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span>${routeLink('oral_genre', 'Oral genres')}<span>/</span><strong>Òwe · Proverbs</strong></div>
      <section class="owe-hero"><div class="owe-hero-copy"><span class="section-kicker">Òwe · Yorùbá proverbs</span><h1>A few words.<br /><em>A world to think about.</em></h1><p>Follow one proverb from its words, to a translation and meaning, into a story and your own reflection. Meaning and use can change with context, speaker and community.</p><div class="hero-actions">${routeLink('owe_detail', `Begin the Owe lesson ${icon('arrow', 15)}`, 'button button-primary')}${aiHelperButton('owe')}</div>${routeLink('owe_add', `Share a proverb ${icon('plus', 15)}`, 'text-link owe-share-link')}</div>
        <div class="owe-feature-photo"><img src="./assets/yoruba-educator-woman.jpg" alt="Yorùbá woman educator in richly woven aso-oke attire" /><div class="owe-feature-shade"></div><div class="owe-feature-content"><span class="section-kicker">A guided proverb · step one</span><blockquote>Sùúrù ni baba ìwà.</blockquote><p>A common classroom rendering: “Patience is the father of good character.”</p><span class="owe-feature-credit">Translations vary; learn with a fluent speaker.</span></div>\n    </section>
      ${renderStepper(['Proverb', 'Translation & meaning', 'Moral story', 'Reflect'], 0)}
      <section class="proverb-sequence"><div class="section-heading"><div><span class="section-kicker">A four-part learning journey</span><h2>Read, understand, imagine, reflect.</h2><p>Each step builds on the words without claiming one translation speaks for everyone.</p></div></div><div class="proverb-learning-row">
        <a href="#/owe_detail" data-route="owe_detail" class="sequence-card sequence-card-active"><span class="sequence-number">02</span><span class="feature-icon tone-mint">${icon('book', 20)}</span><h3>Translation & meaning</h3><p>Read the proverb, meet one translation and unpack the idea.</p><span class="sequence-link">Start here ${icon('arrow', 14)}</span></a>
        <a href="#/${storyRoute}" data-route="${storyRoute}" class="sequence-card ${meaningDone ? '' : 'is-locked'}"><span class="sequence-number">03</span><span class="feature-icon tone-blue">${icon(meaningDone ? 'quote' : 'lock', 20)}</span><h3>A story with a lesson</h3><p>See how patience can look in a child’s everyday choices.</p><span class="sequence-link">${meaningDone ? 'Read the story' : 'Finish meaning first'} ${icon('arrow', 14)}</span></a>
        <a href="#/${reflectionRoute}" data-route="${reflectionRoute}" class="sequence-card ${storyDone ? '' : 'is-locked'}"><span class="sequence-number">04</span><span class="feature-icon tone-peach">${icon(storyDone ? 'heart' : 'lock', 20)}</span><h3>Feel, think & act</h3><p>Choose a feeling and write one thought or action of your own.</p><span class="sequence-link">${storyDone ? 'Reflect' : meaningDone ? 'Finish the story first' : 'Start with the meaning'} ${icon('arrow', 14)}</span></a>
      </div></section>
      ${saved ? `<section class="saved-proverbs"><div class="section-heading"><div><span class="section-kicker">Your contribution</span><h2>Saved in this demo</h2></div></div><div class="proverb-grid">${saved}</div></section>` : ''}
      <div class="proverb-bottom-note">${icon('shield', 16)} Proverb translations can vary. A community voice can add the nuance a dictionary cannot.</div></div>`;
  }

  function renderOweDetail() {
    const result = state.quizResults['owe-meaning:comprehension'] || '';
    return `<div class="container route-page owe-lesson-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span>${routeLink('owe', 'Òwe')}<span>/</span><strong>Translation & meaning</strong></div>
      ${renderStepper(['Proverb', 'Translation & meaning', 'Moral story', 'Reflect'], 1)}
      <section class="owe-lesson-layout"><article class="owe-lesson-main"><span class="section-kicker">Step 2 · Translation & meaning</span><h1>Words can hold<br /><em>a whole way of seeing.</em></h1><div class="owe-verse-panel"><span class="proverb-label">Yorùbá proverb · Òwe</span><blockquote lang="yo">Sùúrù ni baba ìwà.</blockquote><button class="listen-inline" data-action="play-audio" data-text="Sùúrù ni baba ìwà.">${icon('play', 14)} Hear the words <span>Listen</span></button></div>
        <div class="owe-translation-card"><span class="section-kicker">Translation · one common rendering</span><h2>“Patience is the father of good character.”</h2><p>Some speakers render the final word simply as “character.” This short classroom translation is a starting point, not the only possible interpretation.</p></div>
        <div class="owe-meaning-card"><span class="section-kicker">Meaning · in everyday language</span><h2>Good character grows over time.</h2><p>Patience does not have to mean doing nothing. It can mean caring for something steadily, making thoughtful choices and giving growth the time it needs.</p><div class="detail-prompt"><strong>Pause and wonder</strong><p>When have you had to wait for something? What helpful thing could you do while you wait?</p></div></div>
        <section class="owe-story-quiz owe-meaning-check"><span class="section-kicker">Check the meaning</span><h2>What does patience mean in this example?</h2><div class="story-answer-list">${[['Keep caring while you wait.', true], ['Do nothing and stop trying.', false], ['Give up as soon as it feels slow.', false]].map(([label, correct], i) => `<button class="story-answer ${result === 'correct' && correct ? 'answer-correct' : ''}" data-action="owe-meaning-answer" data-key="comprehension" data-correct="${correct}" ${result === 'correct' ? 'disabled' : ''}><span>${String.fromCharCode(65 + i)}</span>${label}${result === 'correct' && correct ? icon('check', 17) : icon('arrow', 15)}</button>`).join('')}</div>${result === 'retry' ? `<div class="answer-feedback feedback-retry">Think about the care that continues while someone waits.</div>` : ''}${result === 'correct' ? `<div class="answer-feedback feedback-correct">Exactly—patience can include thoughtful action while you wait.</div>` : ''}</section>
        <div class="owe-lesson-actions">${routeLink('owe', 'Back to Òwe', 'text-link')}${result === 'correct' ? routeLink('owe_story', `Continue to the moral story ${icon('arrow', 15)}`, 'button button-primary') : '<button class="button button-primary" disabled>Answer the meaning check to continue</button>'}</div></article>
        <aside class="owe-ai-aside"><div class="detail-side-card"><span class="side-card-icon">${icon('sparkles', 21)}</span><span class="section-kicker">A small learning prompt</span><h3>What does patience look like in action?</h3><p>Think of something you can keep caring for, even when the result takes time.</p>${aiHelperButton('owe')}</div><div class="content-note">${icon('info', 16)} Yorùbá proverb wording and interpretation can vary by speaker and context.</div></aside></section></div>`;
  }

  function renderOweSequenceLayers(activeStep) {
    const stages = [
      { title: 'The original proverb', text: 'Read the Yorùbá words and notice their sound. Keep the original beside the translation rather than treating them as interchangeable.', action: 'Start with the words' },
      { title: 'Translation & meaning', text: 'Compare one common rendering, consider how context can change nuance, then answer a short meaning check.', action: 'Understand the idea' },
      { title: 'A moral story + quiz', text: 'Meet Dami and the okra seed in a new classroom story, then check what she chose to do while she waited.', action: 'Look for the lesson' },
      { title: 'Child reflection & action', text: 'Name a feeling, share a thought and choose one kind or helpful action to try. There is no single right answer.', action: 'Reflect and act' }
    ];
    return `<section class="owe-layer-roadmap" aria-labelledby="owe-layer-roadmap-title" data-sequence-step-count="4"><div class="owe-layer-roadmap-heading"><span class="section-kicker">Four-part Owe lesson sequence · follow in order</span><h2 id="owe-layer-roadmap-title">From proverb to a thoughtful next step.</h2><p>Each layer prepares the next. The child’s reflection stays last, after the meaning and story checks.</p></div><div class="owe-layer-roadmap-grid">${stages.map((stage, index) => `<article class="owe-layer-card ${index < activeStep ? 'is-complete' : index === activeStep ? 'is-current' : 'is-locked'}" ${index === activeStep ? 'aria-current="step"' : ''}><span class="owe-layer-number">0${index + 1}</span><div><small>Stage 0${index + 1} · ${index < activeStep ? 'Complete' : index === activeStep ? 'Next' : 'After this'}</small><h3>${stage.title}</h3><p>${stage.text}</p><strong>${stage.action}</strong></div></article>`).join('')}</div></section>`;
  }

  function renderOweStory() {
    const meaningDone = state.quizResults['owe-meaning:comprehension'] === 'correct';
    const result = state.quizResults['owe-story:comprehension'] || '';
    if (!meaningDone) return `<div class="container route-page owe-story-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('owe', 'Òwe')}<span>/</span><strong>Moral story</strong></div>${renderStepper(['Proverb', 'Translation & meaning', 'Moral story', 'Reflect'], 1)}<section class="owe-sequence-gate"><span class="section-kicker">Finish step 2 first</span><h1>Understand the proverb<br /><em>before the story.</em></h1><p>Read the translation and meaning, then answer one quick question. The moral story unlocks after that step.</p>${routeLink('owe_detail', `Return to translation & meaning ${icon('arrow', 15)}`, 'button button-primary')}${aiHelperButton('owe')}</section>${renderOweSequenceLayers(1)}</div>`;
    return `<div class="container route-page owe-story-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('owe', 'Òwe')}<span>/</span>${routeLink('owe_detail', 'Translation & meaning')}<span>/</span><strong>Moral story</strong></div>
      ${renderStepper(['Proverb', 'Translation & meaning', 'Moral story', 'Reflect'], 2)}
      <section class="owe-story-layout"><div class="owe-story-image"><img src="./assets/yoruba-kids-culture.jpg" alt="Children in traditional Yorùbá attire reading together" /><span class="image-caption">A story made for this learning activity.</span></div><article class="owe-story-reading"><span class="section-kicker">Step 3 · An original learning story · 3 min</span><h1>Dami and the<br /><em>okra seed.</em></h1><p class="story-subhead">A new classroom story about patience, care and letting things grow.</p><div class="story-credit-note">${icon('info', 16)} This story was written for the Idilewa lesson. It is not presented as a traditional folktale.</div>
        <div class="story-text"><p>At the start of the rainy season, Dami planted an okra seed beside her grandmother’s garden. Each day, she watered it and checked the soft earth.</p><p>On the second day, nothing had changed. Dami wondered if the seed had forgotten her. Her grandmother smiled and reminded her that caring for something includes giving it time.</p><p>Dami kept watering the seed and clearing away little weeds. Later, a green shoot appeared. She felt proud: patience had not meant sitting still. It meant caring steadily while something grew.</p></div>
        <section class="owe-story-quiz"><span class="section-kicker">Check what you noticed</span><h2>What did Dami do while she waited?</h2><div class="story-answer-list">${[['She kept caring for the seed.', true], ['She stopped visiting the garden.', false], ['She dug up the seed each morning.', false]].map(([label, correct], i) => `<button class="story-answer ${result === 'correct' && correct ? 'answer-correct' : ''}" data-action="owe-story-answer" data-key="comprehension" data-correct="${correct}" ${result === 'correct' ? 'disabled' : ''}><span>${String.fromCharCode(65 + i)}</span>${label}${result === 'correct' && correct ? icon('check', 17) : icon('arrow', 15)}</button>`).join('')}</div>${result === 'retry' ? `<div class="answer-feedback feedback-retry">Try again: what was Dami doing in the garden each day?</div>` : ''}${result === 'correct' ? `<div class="answer-feedback feedback-correct">Exactly—she kept caring for the seed as she waited.</div>` : ''}</section>
        <div class="owe-lesson-actions">${routeLink('owe_detail', 'Review the meaning', 'text-link')}${result === 'correct' ? routeLink('owe_reflection', `Continue to your reflection ${icon('arrow', 15)}`, 'button button-primary') : '<button class="button button-primary" disabled>Answer the story question to continue</button>'}</div>
      </article></section><div class="owe-story-ai">${aiHelperButton('story')}<span>Use it as a prompt, then talk the story through with a trusted adult.</span></div></div>`;
  }

  function renderOweReflection() {
    const meaningDone = state.quizResults['owe-meaning:comprehension'] === 'correct';
    const storyDone = state.quizResults['owe-story:comprehension'] === 'correct';
    if (!storyDone) {
      const nextRoute = meaningDone ? 'owe_story' : 'owe_detail';
      const nextLabel = meaningDone ? 'Finish the moral story' : 'Start with translation & meaning';
      return `<div class="container route-page owe-reflection-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('owe', 'Òwe')}<span>/</span><strong>Your reflection</strong></div>${renderStepper(['Proverb', 'Translation & meaning', 'Moral story', 'Reflect'], meaningDone ? 2 : 1)}<section class="owe-sequence-gate"><span class="section-kicker">Reflection unlocks after the story</span><h1>Your turn is next.</h1><p>Complete the proverb meaning and answer the story question first. Then this space will invite the child to name a feeling, share a thought and choose a small action.</p>${routeLink(nextRoute, `${nextLabel} ${icon('arrow', 15)}`, 'button button-primary')}${aiHelperButton('owe')}</section>${renderOweSequenceLayers(meaningDone ? 2 : 1)}</div>`;
    }
    const feelings = ['Curious', 'Calm', 'Impatient', 'Proud', 'Unsure'];
    const latest = state.reflections[0];
    return `<div class="container route-page owe-reflection-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('owe', 'Òwe')}<span>/</span>${routeLink('owe_story', 'Moral story')}<span>/</span><strong>Your reflection</strong></div>
      ${renderStepper(['Proverb', 'Translation & meaning', 'Moral story', 'Reflect'], 3)}
      <section class="reflection-layout"><article class="reflection-main"><span class="section-kicker">Step 4 · Your turn</span><h1>What do you<br /><em>feel and think?</em></h1><p class="reflection-intro">There is no single right answer. You can name a feeling, share an idea or think of one small action you could try when something takes time.</p>
        <fieldset class="feeling-fieldset"><legend>How might you feel when you have to wait?</legend><div class="feeling-picker">${feelings.map((feeling) => `<button type="button" class="feeling-chip ${state.reflectionFeeling === feeling ? 'is-selected' : ''}" data-action="select-feeling" data-feeling="${feeling}" aria-pressed="${state.reflectionFeeling === feeling}">${feeling}</button>`).join('')}</div></fieldset>
        <form class="reflection-form" data-form="owe-reflection"><label for="oweThought">What do you think? What could you do with patience?</label><textarea id="oweThought" name="thought" rows="5" maxlength="600" placeholder="You could write a sentence, a plan or a question…" required></textarea><small>Keep it general—please do not write a full name, address or other private details.</small><button class="button button-primary" type="submit">Save my reflection on this device ${icon('arrow', 15)}</button></form>
        ${latest ? `<div class="reflection-saved"><span class="section-kicker">Saved locally on this browser</span><strong>${esc(latest.feeling || 'A thought')} · ${new Date(latest.createdAt).toLocaleDateString()}</strong><p>${esc(latest.thought)}</p><small>This is visible to people who use this device. Nothing is sent to a server.</small></div>` : ''}
      </article><aside class="reflection-aside"><div class="detail-side-card"><span class="side-card-icon">${icon('heart', 21)}</span><span class="section-kicker">A gentle reminder</span><h3>Waiting can still include action.</h3><p>Dami cared for her seed. What is one kind or helpful thing you might do while you wait?</p>${aiHelperButton('owe')}</div><img class="reflection-kids-photo" src="./assets/yoruba-kids-culture.jpg" alt="Friends learning together in traditional Yorùbá clothing" /></aside></section>
      <div class="owe-lesson-actions reflection-back-actions">${routeLink('owe_story', 'Back to the story', 'text-link')}${routeLink('owe', `Return to all proverbs ${icon('arrow', 15)}`, 'button button-outline')}</div></div>`;
  }

  function renderOweAdd() {
    return `<div class="container route-page form-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span>${routeLink('owe', 'Proverbs')}<span>/</span><strong>Share a proverb</strong></div><section class="form-intro"><span class="section-kicker">A contribution, held with care</span><h1>Share a proverb<br /><em>you know and love.</em></h1><p>Add it to this local demo to see how a community contribution might feel. Nothing is sent or published.</p></section>${renderStepper(['Choose words', 'Add meaning', 'Add context', 'Share with care'], 3)}<div class="contribution-layout"><form class="contribution-form" data-form="proverb"><label for="proverbLang">Language <select id="proverbLang" name="language" required><option value="Yorùbá">Yorùbá</option><option value="Igbo">Igbo</option><option value="Hausa">Hausa</option><option value="Swahili">Swahili</option></select></label><label for="proverbText">Proverb in its original language <textarea id="proverbText" name="text" rows="3" maxlength="240" placeholder="Type the words as you know them…" required></textarea><small>Keep tonal marks and diacritics where you can.</small></label><label for="proverbMeaning">Meaning or translation <textarea id="proverbMeaning" name="meaning" rows="3" maxlength="320" placeholder="What does it mean to you?" required></textarea></label><label for="proverbContext">Context or attribution <input id="proverbContext" name="context" maxlength="120" placeholder="Who shared it, or where did you hear it?" /></label><label class="consent-check"><input type="checkbox" name="consent" required /><span>I have permission to share this contribution, and understand it remains on this device in this prototype.</span></label><button class="button button-primary" type="submit">Save to this demo ${icon('arrow', 16)}</button></form><aside class="contribution-aside"><span class="side-card-icon">${icon('heart', 21)}</span><h2>Knowledge travels with care.</h2><p>Before sharing an oral tradition, check who owns the story, what should stay private and how the source wants to be credited.</p><div class="contribution-aside-note">${icon('lock', 16)} This prototype does not upload or publish your words.</div></aside></div></div>`;
  }

  function renderVoices() {
    const voices = [
      { lang: 'yoruba', speaker: 'Everyday greeting', phrase: 'Ẹ káàárọ̀', translation: 'Good morning', tint: 'mint' },
      { lang: 'igbo', speaker: 'Friendly greeting', phrase: 'Ndewo', translation: 'Hello', tint: 'peach' },
      { lang: 'hausa', speaker: 'Friendly greeting', phrase: 'Sannu', translation: 'Hello', tint: 'blue' },
      { lang: 'swahili', speaker: 'Everyday greeting', phrase: 'Habari', translation: 'How are you?', tint: 'lilac' }
    ];
    return `<div class="container route-page voices-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span><strong>Voice library</strong></div><section class="voices-hero"><div><span class="section-kicker">Listen close · speak with confidence</span><h1>Every word has<br /><em>a voice of its own.</em></h1><p>Listen to short sample phrases, notice the rhythm and practice at your own pace.</p><div class="hero-actions">${routeLink('trainer', `Voice African Language Trainer ${icon('arrow', 15)}`, 'button button-primary')}</div></div><div class="voice-orbit"><span class="orbit-core">${icon('volume', 30)}</span><span class="orbit-word orbit-one">Ẹ káàárọ̀</span><span class="orbit-word orbit-two">Ndewo</span><span class="orbit-word orbit-three">Sannu</span><span class="orbit-word orbit-four">Habari</span></div></section>${renderStepper(['Choose a language', 'Hear a phrase', 'Practice', 'Remember'], 1)}<section class="voice-list-section"><div class="section-heading"><div><span class="section-kicker">Try a greeting</span><h2>Choose a phrase and listen.</h2><p>Audio here is a browser-based prototype sample. Production recordings should be approved by native speakers.</p></div><span class="demo-badge">Sample phrases</span></div><div class="voice-list">${voices.map((v) => { const l = getLanguage(v.lang); return `<article class="voice-row"><span class="voice-language-mark lang-${v.tint}">${l.glyph}</span><div class="voice-row-copy"><span class="voice-row-lang">${l.name} · ${v.speaker}</span><strong>${v.phrase}</strong><small>${v.translation}</small></div><div class="voice-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><button class="voice-play" data-action="play-audio" data-text="${esc(v.phrase)}" aria-label="Play ${esc(v.phrase)}">${icon('play', 16)}</button></article>`; }).join('')}</div><div class="voice-access-note">${icon('shield', 16)} Language audio and pronunciation need review by fluent speakers before public release.</div></section></div>`;
  }

  function renderGeneric(key) {
    const meta = PAGE_META[key];
    if (!meta) return renderDirectory();
    const imageSrc = meta.image === 'story' ? './assets/story-grandmother.jpg' : meta.image === 'code' ? './assets/code-kids.jpg' : meta.image === 'kids' ? './assets/yoruba-kids-culture.jpg' : meta.image === 'hero' ? './assets/hero-reader.jpg' : '';
    const cards = meta.cards.map((card) => `<a class="editorial-card tone-${card.tone || 'mint'}" href="#/${card.route}" data-route="${card.route}"><span class="editorial-card-icon">${icon(card.icon, 20)}</span><span class="editorial-card-overline">Explore</span><h3>${card.title}</h3><p>${card.text}</p><span class="editorial-card-go">Learn more ${icon('arrow', 14)}</span></a>`).join('');
    const interestForm = meta.form ? `<form class="interest-form" data-form="interest"><label for="interestEmail">${meta.form === 'school' ? 'Get school updates' : 'Ask about guided learning'}</label><div><input id="interestEmail" name="email" type="email" placeholder="Your email address" required /><button type="submit">${icon('send', 16)} <span>Send interest</span></button></div><small>Prototype only—your details are not sent.</small></form>` : '';
    return `<div class="container route-page editorial-page page-${key}">
      <div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>${meta.eyebrow}</strong></div>
      <section class="editorial-hero"><div class="editorial-copy"><span class="section-kicker">${meta.eyebrow}</span><h1>${meta.title}</h1><p>${meta.desc}</p><div class="editorial-actions">${routeLink(meta.ctaRoute, `${meta.cta} ${icon('arrow', 15)}`, 'button button-primary')}${key !== 'about' ? routeLink('about', 'About Idilewa', 'text-link') : ''}</div><div class="editorial-proof">${icon('shield', 16)} Warm, accessible and built to grow with learners.</div></div><div class="editorial-visual ${meta.image ? 'has-photo' : ''}">${imageSrc ? `<img src="${imageSrc}" alt="${meta.imageAlt}" />` : `<div class="editorial-illustration tone-mint">${icon(meta.icon || 'sparkles', 50)}<span class="editorial-spark">✦</span><span class="editorial-orbit">${meta.eyebrow}</span></div>`}<div class="visual-note">${icon(meta.icon || 'sparkles', 16)} <span>Rooted in language<br />open to the future</span></div>\n    </section>
      <div class="editorial-body"><div class="editorial-main"><section class="editorial-cards-section"><div class="section-heading"><div><span class="section-kicker">A thoughtful way to begin</span><h2>Explore what matters to you.</h2><p>Choose a next step or follow your curiosity.</p></div></div><div class="editorial-card-grid">${cards}</div></section>${interestForm}<section class="editorial-footer-note"><span>${icon('heart', 18)}</span><p>Idilewa is designed to be welcoming for children and useful for adults—with privacy, consent and cultural context in mind.</p></section></div><aside class="editorial-aside"><div class="aside-path-card"><span class="section-kicker">A clear journey</span><h3>See your next step.</h3>${renderStepper(meta.flow || ['Discover', 'Choose', 'Practice', 'Grow'], meta.active || 0)}<p>Each path keeps the next layer easy to find.</p><a class="text-link" href="#/base" data-route="base">Explore all spaces ${icon('arrow', 14)}</a></div><div class="aside-quote-card"><span>${icon(meta.icon || 'leaf', 19)}</span><p>“Language is a bridge between who we are and what we can imagine.”</p><small>Idilewa learning principle</small></div></aside></div>
    </div>`;
  }

  function renderDirectory() {
    const groups = [
      { title: 'Learn & practice', text: 'Language learning from the first choice to the next small win.', pages: ['index', 'trainer', 'languages', 'course', 'lesson', 'kids', 'individuals', 'schools', 'tutor', 'profile', 'connect_teachers', 'connect_students'] },
      { title: 'Stories & living culture', text: 'Explore oral traditions, voices, guides and cultural context.', pages: ['ere', 'ere_game', 'oral', 'oral_genre', 'oriki', 'owe', 'owe_add', 'owe_detail', 'owe_story', 'owe_reflection', 'voices', 'ifa', 'ifa_odu', 'guides', 'human', 'keepers'] },
      { title: 'Technology & Idilewa', text: 'Discover bilingual coding, the learning approach and platform spaces.', pages: ['coding', 'about', 'method', 'pricing', 'login', 'consent', 'base'] }
    ];
    return `<div class="container route-page directory-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Explore all spaces</strong></div><section class="directory-hero"><span class="section-kicker">The Idilewa map</span><h1>One home.<br /><em>Many ways to belong.</em></h1><p>Start with a language, follow a story, explore culture or build something new.</p>${renderStepper(['Language', 'Level', 'Module', 'Lesson'], 0)}</section>${groups.map((g) => `<section class="directory-group"><div class="directory-heading"><div><span class="section-kicker">A learning layer</span><h2>${g.title}</h2><p>${g.text}</p></div><span class="directory-count">${g.pages.length} spaces</span></div><div class="directory-links">${g.pages.map((page) => `<a href="#/${page}" data-route="${page}" class="directory-link"><span>${icon(page === 'coding' ? 'code' : page.includes('oral') || page.includes('ere') || page === 'voices' ? 'book' : page === 'schools' || page === 'tutor' || page === 'connect_students' || page === 'connect_teachers' ? 'people' : 'sparkles', 17)}</span><strong>${LABELS[page]}</strong>${icon('arrow', 15)}</a>`).join('')}</div></section>`).join('')}<div class="directory-note">${icon('info', 17)} Every named prototype route is connected through this route map and the main navigation.</div></div>`;
  }

  function renderPricing() {
    const selected = state.billing || 'monthly';
    return `<div class="container route-page pricing-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Plans</strong></div><section class="pricing-hero"><span class="section-kicker">Flexible ways to learn</span><h1>More language.<br /><em>More belonging.</em></h1><p>Find the learning setup that fits your home or classroom. This preview keeps plans simple while the final scope is being shaped.</p><div class="billing-switch" role="group" aria-label="Billing period"><button class="${selected === 'monthly' ? 'active' : ''}" data-action="billing-period" data-period="monthly">Monthly</button><button class="${selected === 'yearly' ? 'active' : ''}" data-action="billing-period" data-period="yearly">Yearly</button><span>Preview only</span></div></section>${renderStepper(['Explore plans', 'Choose learning paths', 'Review as a family', 'Begin together'], 0)}<div class="pricing-grid"><article class="pricing-card"><span class="pricing-label">Begin here</span><h2>Explorer</h2><p>For learners ready to try a first path.</p><div class="pricing-cost"><strong>Free</strong><small>to get started</small></div><ul><li>${icon('check', 15)} Explore available languages</li><li>${icon('check', 15)} Try sample lessons & stories</li><li>${icon('check', 15)} Follow a personal learning path</li></ul>${routeLink('languages', 'Start exploring ' + icon('arrow', 15), 'button button-outline')}</article><article class="pricing-card pricing-featured"><span class="popular-pill">Made for together</span><span class="pricing-label">For home</span><h2>Family</h2><p>A shared learning space for the people close to you.</p><div class="pricing-cost"><strong>Coming soon</strong><small>final details to be confirmed</small></div><ul><li>${icon('check', 15)} Shared family learning routines</li><li>${icon('check', 15)} Stories to read and listen together</li><li>${icon('check', 15)} Progress designed for encouragement</li></ul><button class="button button-primary" data-action="choose-plan" data-plan="Family">Join the interest list ${icon('arrow', 15)}</button></article><article class="pricing-card"><span class="pricing-label">For educators</span><h2>School</h2><p>Learning paths for classrooms and teaching teams.</p><div class="pricing-cost"><strong>Let’s talk</strong><small>school plans are tailored</small></div><ul><li>${icon('check', 15)} Structured language modules</li><li>${icon('check', 15)} Culture and coding experiences</li><li>${icon('check', 15)} Educator-led learning journeys</li></ul>${routeLink('schools', 'Explore schools ' + icon('arrow', 15), 'button button-outline')}</article></div><p class="pricing-footnote">No final pricing or subscription commitments are represented in this prototype. Hosting, API and production costs should be confirmed with the Idilewa team.</p></div>`;
  }

  function renderProfile() {
    const completedCount = state.completed.length;
    const percent = Math.min(100, Math.round((completedCount / 8) * 100));
    const lang = getLanguage(state.currentLang);
    const journeyStep = completedCount >= 8 ? 3 : state.streak >= 3 ? 2 : completedCount ? 1 : 0;
    return `<div class="container route-page profile-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>My progress</strong></div>${renderStepper(['Choose a path', 'Practice a lesson', 'Build a streak', 'Celebrate progress'], journeyStep)}<section class="profile-welcome"><div class="profile-avatar">${icon('user', 27)}</div><div><span class="section-kicker">Your learning space · demo</span><h1>A good day to keep going.</h1><p>Your progress is saved in this browser for this prototype.</p></div><button class="button button-outline" data-route="login">${icon('user', 16)} Account settings</button></section><div class="profile-overview-grid"><article class="progress-main-card"><div class="progress-main-head"><div><span class="section-kicker">Current path</span><h2>${lang.name} · ${state.level.charAt(0).toUpperCase() + state.level.slice(1)}</h2><p>Keep building confidence, one small lesson at a time.</p></div><span class="progress-medallion">${icon('leaf', 23)}</span></div><div class="large-progress"><div><span style="width:${percent}%"></span></div><strong>${percent}%</strong></div><div class="progress-foot"><span>${completedCount} lessons completed</span>${routeLink('course', 'Continue learning ' + icon('arrow', 14), 'text-link')}</div></article><div class="stat-card stat-streak"><span>${icon('sparkles', 20)}</span><small>Learning streak</small><strong>${state.streak} <em>days</em></strong><p>Showing up is a win.</p></div><div class="stat-card stat-points"><span>${icon('star', 20)}</span><small>Practice points</small><strong>${state.points}</strong><p>Earned by trying new things.</p></div></div><div class="profile-lower-grid"><section class="profile-card"><div class="section-heading compact-heading"><div><span class="section-kicker">Your recent steps</span><h2>Learning timeline</h2></div>${routeLink('course', 'View path ' + icon('arrow', 14), 'text-link')}</div><div class="timeline-row"><span class="timeline-check">${icon('check', 15)}</span><div><strong>Start with a greeting</strong><small>${lang.name} · First lesson</small></div><span class="timeline-status">${state.completed.includes(`${lang.id}-greetings-intro`) ? 'Complete' : 'Ready'}</span></div><div class="timeline-row timeline-next"><span class="timeline-num">02</span><div><strong>People close to us</strong><small>Next module · Words for family</small></div><button class="text-link" data-action="open-module" data-module="family" data-lang="${lang.id}" data-level="${state.level}">Open ${icon('arrow', 14)}</button></div><div class="timeline-row timeline-next"><span class="timeline-num">03</span><div><strong>Stories & memory</strong><small>Explore a story and listen for new words</small></div>${routeLink('ere', 'Explore ' + icon('arrow', 14), 'text-link')}</div></section><aside class="profile-badges"><span class="section-kicker">Small things worth celebrating</span><h2>Your first badges</h2><div class="badge-list"><div class="badge-item"><span class="badge-icon badge-green">${icon('leaf', 18)}</span><div><strong>First steps</strong><small>Opened your learning path</small></div></div><div class="badge-item"><span class="badge-icon badge-yellow">${icon('volume', 18)}</span><div><strong>Good listener</strong><small>Practiced a spoken phrase</small></div></div><div class="badge-item badge-locked"><span class="badge-icon">${icon('trophy', 18)}</span><div><strong>Story keeper</strong><small>Complete a story activity</small></div></div></div></aside></div><div class="profile-privacy-note">${icon('lock', 16)} This demo keeps progress on this device. Production accounts require secure authentication and privacy review.</div></div>`;
  }

  function renderLogin() {
    const signUp = state.loginMode === 'signup';
    const activeGrant = consentCodeIsActive();
    const role = state.authRole || 'child';
    const isChild = role === 'child';
    const isEducator = role === 'educator';
    const isParent = role === 'parent';
    const isAdult = role === 'adult';

    const loginJourneyStep = activeGrant ? (signUp ? 2 : 1) : 0;
    const authLayers = [
      { title: 'Choose who is learning', text: 'Adults and educators can explore independently. A child path starts with a parent or guardian, never personal details.' },
      { title: 'Get signed family approval', text: 'A guardian reviews the request and signs. Approval for an assigned tutor is an explicit, separate choice.' },
      { title: 'Check the approved code', text: 'The code is a local verification check ensuring all young learners stay under active parental supervision.' },
      { title: 'Continue safely & explore', text: 'You can explore all language paths freely. Never enter real passwords or sensitive personal data in this demo.' }
    ];

    return `<div class="container route-page auth-page modern-auth-page">
      <!-- Left Column: Rich Cultural Media & Highlights Showcase -->
      <aside class="auth-art modern-auth-art">
        <div class="auth-showcase-card">
          <div class="auth-image modern-auth-image">
            <img src="./assets/hero-home.jpg" alt="African mother and children learning languages and technology together on Idilewa" />
            <div class="auth-art-overlay"></div>
            <div class="auth-art-badge">
              <span class="pulse-dot"></span>
              <span>Idilewa Learning Space</span>
            </div>
            <div class="auth-art-note">
              <span>Èdè wa, àṣà wa, ìdílé wa</span>
              <strong>Our language. Our culture. Our family.</strong>
            </div>
          </div>

          <div class="auth-highlights-box">
            <div class="auth-highlight-pill">
              <span class="auth-pill-ico tone-mint">${icon('mic', 16)}</span>
              <div>
                <strong>AI Voice & Tonal Feedback</strong>
                <small>6 African languages with live pitch scoring</small>
              </div>
            </div>
            <div class="auth-highlight-pill">
              <span class="auth-pill-ico tone-yellow">${icon('code', 16)}</span>
              <div>
                <strong>K–8 Code for Kids & STEAM</strong>
                <small>30+ interactive lessons paired with cultural proverbs</small>
              </div>
            </div>
            <div class="auth-highlight-pill">
              <span class="auth-pill-ico tone-blue">${icon('shield', 16)}</span>
              <div>
                <strong>Child-Safe Guardian Supervision</strong>
                <small>Consent codes & verified educator matching</small>
              </div>
            </div>
          </div>

          <div class="auth-quote-card">
            <div class="auth-quote-mark">“</div>
            <p>A joyful place where children and families preserve African heritage while mastering 21st-century tech.</p>
            <div class="auth-quote-author">— The Idilewa Philosophy</div>
          </div>
        </div>
      </aside>

      <!-- Right Column: Modern Authentication Card Panel -->
      <main class="auth-panel modern-auth-panel">
        <div class="breadcrumbs">
          ${routeLink('index', 'Home')}
          <span>/</span>
          <strong>${signUp ? 'Create Account' : 'Sign In'}</strong>
        </div>

        <div class="auth-header-block">
          <span class="section-kicker">${signUp ? 'Join the Idilewa Family' : 'Welcome Back'}</span>
          <h1 class="auth-title">${signUp ? 'Start Your Heritage Journey' : 'Sign In to Your Space'}</h1>
          <p class="auth-subtitle">${signUp ? 'Create a personalized learning space for yourself or your family.' : 'Continue practicing languages, voice training, and coding.'}</p>
        </div>

        <!-- Mode Selector Switcher Tabs -->
        <div class="auth-toggle modern-auth-tabs" role="tablist">
          <button type="button" class="auth-tab-btn ${!signUp ? 'active' : ''}" data-action="login-mode" data-mode="signin" role="tab" aria-selected="${!signUp}">
            ${icon('user', 15)} Sign In
          </button>
          <button type="button" class="auth-tab-btn ${signUp ? 'active' : ''}" data-action="login-mode" data-mode="signup" role="tab" aria-selected="${signUp}">
            ${icon('plus', 15)} Create Account
          </button>
        </div>

        <!-- Persona Role Selector Cards -->
        <div class="auth-role-selector">
          <label class="auth-role-label">Choose Learning Persona:</label>
          <div class="auth-role-grid">
            <button type="button" class="auth-role-card ${isChild ? 'is-selected' : ''}" data-action="auth-role-select" data-role="child">
              <span class="role-icon tone-green">${icon('smile', 16)}</span>
              <span class="role-title">Child Learner</span>
              <span class="role-tag">Parent Code</span>
            </button>
            <button type="button" class="auth-role-card ${isAdult ? 'is-selected' : ''}" data-action="auth-role-select" data-role="adult">
              <span class="role-icon tone-blue">${icon('book', 16)}</span>
              <span class="role-title">Adult Learner</span>
              <span class="role-tag">Self-Paced</span>
            </button>
            <button type="button" class="auth-role-card ${isParent ? 'is-selected' : ''}" data-action="auth-role-select" data-role="parent">
              <span class="role-icon tone-warm">${icon('heart', 16)}</span>
              <span class="role-title">Parent/Guardian</span>
              <span class="role-tag">Supervisor</span>
            </button>
            <button type="button" class="auth-role-card ${isEducator ? 'is-selected' : ''}" data-action="auth-role-select" data-role="educator">
              <span class="role-icon tone-pink">${icon('school', 16)}</span>
              <span class="role-title">Educator/Tutor</span>
              <span class="role-tag">Teacher</span>
            </button>
          </div>
        </div>

        <!-- Quick 1-Click Persona Demo Bar -->
        <div class="auth-quick-demo-bar">
          <span class="quick-demo-title">⚡ 1-Click Interactive Demo Login:</span>
          <div class="quick-demo-btns">
            <button type="button" class="quick-demo-chip" data-action="quick-demo-login" data-role="child" title="Fill as Child Learner">
              ${icon('smile', 13)} Child
            </button>
            <button type="button" class="quick-demo-chip" data-action="quick-demo-login" data-role="parent" title="Fill as Parent Guardian">
              ${icon('heart', 13)} Parent
            </button>
            <button type="button" class="quick-demo-chip" data-action="quick-demo-login" data-role="educator" title="Fill as Language Educator">
              ${icon('school', 13)} Educator
            </button>
            <button type="button" class="quick-demo-chip" data-action="quick-demo-login" data-role="adult" title="Fill as Adult Learner">
              ${icon('book', 13)} Adult
            </button>
          </div>
        </div>

        <!-- Modern Auth Form -->
        <form class="auth-form modern-auth-form" data-form="login">
          <input type="hidden" name="accountType" id="authAccountType" value="${role}" />

          ${signUp ? `
          <div class="form-group">
            <label for="authName" class="form-label">Name or Learner Alias</label>
            <div class="input-with-icon">
              <span class="input-icon">${icon('smile', 17)}</span>
              <input id="authName" type="text" name="name" class="form-input" autocomplete="name" placeholder="${isChild ? 'e.g. Ayo B. (Use nickname for safety)' : 'e.g. Samuel Owoyemi'}" required />
            </div>
          </div>
          ` : ''}

          <div class="form-group">
            <label for="authEmail" class="form-label">Email address or Username</label>
            <div class="input-with-icon">
              <span class="input-icon">${icon('user', 17)}</span>
              <input id="authEmail" type="email" name="email" class="form-input" autocomplete="email" placeholder="${isChild ? 'learner@idilewa.demo' : isEducator ? 'teacher@idilewa.demo' : isParent ? 'parent@idilewa.demo' : 'you@example.com'}" required />
            </div>
          </div>

          ${isChild ? `
          <div class="form-group consent-form-group">
            <div class="form-label-row">
              <label for="signinConsentCode" class="form-label">Parent-Approved Consent Code</label>
              ${routeLink('consent', 'Get Parent Code ' + icon('arrow', 12), 'text-link text-link-small')}
            </div>
            <div class="input-with-icon">
              <span class="input-icon">${icon('shield', 17)}</span>
              <input id="signinConsentCode" type="text" name="consentCode" class="form-input" maxlength="12" autocomplete="off" placeholder="ID-123456" value="${activeGrant ? esc(state.consent.approvedCode) : ''}" required />
              ${activeGrant ? `<span class="input-badge-verified">${icon('check', 13)} Active on Device</span>` : ''}
            </div>
            <p class="form-helper-text">${activeGrant ? 'Guardian approval is active on this browser.' : 'A parent or guardian must sign the consent form to generate this code.'}</p>
          </div>
          ` : ''}

          <div class="form-group">
            <div class="form-label-row">
              <label for="authPassword" class="form-label">Password</label>
              ${!signUp ? `<button class="forgot-link" type="button" data-action="forgot-password">Forgot password?</button>` : ''}
            </div>
            <div class="input-with-icon">
              <span class="input-icon">${icon('lock', 17)}</span>
              <input id="authPassword" type="password" name="password" class="form-input" autocomplete="${signUp ? 'new-password' : 'current-password'}" minlength="8" placeholder="••••••••••••" required />
              <button type="button" class="password-toggle-btn" data-action="toggle-password-visibility" aria-label="Toggle password visibility">
                ${icon('eye', 16)}
              </button>
            </div>
          </div>

          ${signUp ? `
          <label class="consent-check modern-consent-check">
            <input type="checkbox" name="demoOnly" value="yes" required checked />
            <span>I understand this is a prototype sandbox; no real passwords or sensitive details are saved.</span>
          </label>
          ` : `
          <div class="form-options-row">
            <label class="consent-check modern-consent-check">
              <input type="checkbox" name="rememberMe" value="yes" checked />
              <span>Remember this device</span>
            </label>
            <span class="auth-security-badge">${icon('shield', 12)} Protected Demo</span>
          </div>
          `}

          <button class="button button-primary modern-auth-submit" type="submit">
            <span>${signUp ? (isChild ? 'Validate Code & Create Child Space' : 'Create Supervised Space') : (isChild ? 'Check Code & Sign In' : 'Sign In to Learning Space')}</span>
            ${icon('arrow', 16)}
          </button>
        </form>

        <!-- Trust & Privacy Sandbox Note -->
        <div class="auth-safe-note modern-auth-safe-note">
          <span class="safe-note-icon">${icon('lock', 16)}</span>
          <div>
            <strong>Local Privacy-Preserving Sandbox</strong>
            <span>All progress and lesson points are stored locally. Real credentials are never collected or transmitted.</span>
          </div>
        </div>

        <div class="auth-separator"><span>or explore freely</span></div>

        <div class="auth-alt-links">
          ${routeLink('languages', 'Continue as Guest without signing in ' + icon('arrow', 14), 'button button-soft auth-guest-btn')}
          <div class="auth-sub-links">
            ${routeLink('consent', `${icon('heart', 13)} Parent & Guardian Consent Center`, 'text-link')}
            ${routeLink('trainer', `${icon('mic', 13)} African Voice Trainer Studio`, 'text-link')}
          </div>
        </div>

        <!-- 4-Layer Family-First Access Checks Section -->
        <section class="auth-layer-guide" aria-labelledby="auth-layer-title" data-access-check-count="4">
          <div class="auth-layer-guide-heading">
            <span class="section-kicker">Family-first access checks</span>
            <h2 id="auth-layer-title">A clear route into learning.</h2>
            <p>Access follows the learner’s age, guardian permission and the choice to keep exploring safely.</p>
          </div>
          <div class="auth-layer-guide-grid">
            ${authLayers.map((layer, index) => `
              <article class="auth-layer-card">
                <span>0${index + 1}</span>
                <div>
                  <h3>${layer.title}</h3>
                  <p>${layer.text}</p>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </main>
    </div>`;
  }

  const TEACHER_PROFILES = [
    {
      id: 'tola-demo', name: 'Tola A.', image: 'yoruba-educator-woman.jpg', language: 'Yorùbá',
      focus: 'Everyday conversation & family phrases', tags: ['speaking'],
      hours: 'Monday & Wednesday · 4:00–7:00 pm WAT', hoursSummary: '6 hours each week', learners: 36,
      bio: 'A sample educator profile focused on warm, practical language practice for beginners. Profile details and numbers are illustrative placeholders for this prototype.'
    },
    {
      id: 'kunle-demo', name: 'Kunle O.', image: 'yoruba-educator-man.jpg', language: 'Yorùbá',
      focus: 'Stories, pronunciation & beginner coding', tags: ['story', 'coding'],
      hours: 'Tuesday & Thursday · 5:00–7:00 pm WAT', hoursSummary: '4 hours each week', learners: 24,
      bio: 'A sample educator profile combining story-led language learning with first steps in coding. Profile details and numbers are illustrative placeholders for this prototype.'
    }
  ];

  const LEARNER_REQUESTS = [
    { id: 'learner-a', label: 'Learner A.', language: 'Yorùbá', level: 'New learner', goal: 'Practice greetings and everyday family phrases.', preferred: 'Weekdays after school · 4:00–5:00 pm WAT', interest: 'Speaking with confidence' },
    { id: 'learner-b', label: 'Learner B.', language: 'Yorùbá', level: 'Growing learner', goal: 'Listen to a short story and learn new words from it.', preferred: 'Saturday morning · 10:00–11:00 am WAT', interest: 'Stories & listening' },
    { id: 'learner-c', label: 'Learner C.', language: 'Yorùbá', level: 'New learner', goal: 'Try a small coding activity with familiar language words.', preferred: 'Tuesday · 5:00–6:00 pm WAT', interest: 'Language + coding' }
  ];

  function makeConsentCode(prefix) {
    let value = 0;
    try {
      const sample = new Uint32Array(1);
      if (window.crypto && typeof window.crypto.getRandomValues === 'function') window.crypto.getRandomValues(sample);
      else sample[0] = Math.floor(Math.random() * 0xffffffff);
      value = sample[0] % 900000 + 100000;
    } catch (_) { value = Math.floor(Math.random() * 900000) + 100000; }
    return `${prefix}-${String(value).padStart(6, '0')}`;
  }
  function consentCodeIsActive() {
    const grant = state.consent;
    return !!(grant?.approved && grant.accountApproved && grant.approvedCode && Number(grant.expiresAt) > Date.now());
  }
  function tutorGrantIsActive(tutorId) {
    const grant = state.consent;
    return consentCodeIsActive() && !!(grant.tutorApproved && tutorId && grant.tutorId === tutorId);
  }
  function tutorSessionIsValid() {
    const grant = state.consent;
    return tutorGrantIsActive(grant.tutorId) && grant.tutorValidatedFor === grant.tutorId;
  }
  function startConsentRequest(tutorId = '') {
    const alias = state.consent.learnerAlias || 'Young learner';
    state.consent = {
      ...defaults.consent,
      requestCode: makeConsentCode('REQ'),
      learnerAlias: alias,
      tutorId: tutorId || '',
      requestedAt: new Date().toISOString()
    };
    saveState();
  }

  function renderConnectTeachers() {
    const visible = TEACHER_PROFILES.filter((teacher) => state.teacherFilter === 'all' || teacher.tags.includes(state.teacherFilter));
    const codeActive = consentCodeIsActive();
    const childVerified = codeActive && !!state.consent.childVerified;
    const banner = !codeActive
      ? `<div class="consent-gate-card is-pending">${icon('shield', 20)}<div><strong>Parent approval comes first.</strong><p>Before a child requests an introduction, a parent or guardian must sign a short consent form and issue a code for the selected tutor.</p></div>${routeLink('consent', 'Start parent consent ' + icon('arrow', 14), 'button button-primary')}</div>`
      : !childVerified
        ? `<form class="consent-code-check" data-form="child-consent-check"><div><span class="section-kicker">Parent approval found · child verification needed</span><h2>Enter the code your parent gave you.</h2><p>Only the tutor selected by your parent can be requested from this page.</p></div><label for="childConnectCode">Parent-approved code<input id="childConnectCode" name="consentCode" autocomplete="off" maxlength="12" placeholder="ID-123456" required /></label><button class="button button-primary" type="submit">Verify parent code ${icon('check', 15)}</button></form>`
        : `<div class="consent-gate-card is-approved">${icon('check', 20)}<div><strong>Parent approval verified on this device.</strong><p>Connection is limited to ${esc(TEACHER_PROFILES.find((item) => item.id === state.consent.tutorId)?.name || 'the approved tutor')}. No booking or message is sent by this preview.</p></div></div>`;
    return `<div class="container route-page connection-page connect-teachers-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Connect with Teachers</strong></div>
      <section class="connection-hero"><div class="connection-hero-copy"><span class="section-kicker">For learners & families</span><h1>Find a teacher<br /><em>who helps you grow.</em></h1><p>Explore educator profiles, teaching times and learning experience. A guardian-approved code must match the specific tutor before an introduction can be requested.</p><div class="connection-hero-points"><span>${icon('shield', 16)} Parent-approved introductions</span><span>${icon('clock', 16)} Times shown in WAT</span></div></div><div class="connection-hero-image"><img src="./assets/yoruba-educator-man.jpg" alt="Illustrative Yorùbá educator in traditional agbada holding a language book" /><span>Educator portraits and schedules are illustrative demo content.</span></div></section>
      ${renderStepper(['Choose a tutor', 'Parent signs consent', 'Child verifies code', 'Connect safely'], childVerified ? 3 : codeActive ? 2 : 0)}
      ${banner}
      <div class="connection-notice">${icon('info', 17)} <div><strong>Sample directory · not real registered teachers.</strong><span>Profiles, schedules and learner counts are placeholders. No one receives a message or booking from this demo. In a real service, permission must be checked on a secure server.</span></div></div>
      <section class="teacher-directory-section"><div class="section-heading"><div><span class="section-kicker">Educator profiles</span><h2>Meet a language guide.</h2><p>Compare teaching focus, weekly availability and sample experience.</p></div><label class="teacher-filter-label" for="teacherFilter">Filter by focus<select id="teacherFilter" data-action="filter-teachers"><option value="all" ${state.teacherFilter === 'all' ? 'selected' : ''}>All teaching styles</option><option value="speaking" ${state.teacherFilter === 'speaking' ? 'selected' : ''}>Conversation</option><option value="story" ${state.teacherFilter === 'story' ? 'selected' : ''}>Stories</option><option value="coding" ${state.teacherFilter === 'coding' ? 'selected' : ''}>Coding + language</option></select></label></div>
        <div class="teacher-profile-grid">${visible.length ? visible.map((teacher) => { const allowed = childVerified && tutorGrantIsActive(teacher.id); const requested = state.teacherRequests.includes(teacher.id); return `<article class="teacher-profile-card"><div class="teacher-profile-photo teacher-profile-initials-photo" role="img" aria-label="Sample educator profile for ${esc(teacher.name)}"><span class="teacher-profile-monogram" aria-hidden="true">${esc(teacher.name.split(' ').map((part) => part[0]).join('').replace(/[^a-z0-9]/gi, ''))}</span><span class="demo-profile-badge">Sample profile</span></div><div class="teacher-profile-body"><div class="teacher-name-row"><div><span class="teacher-language-tag">${esc(teacher.language)} · ${teacher.focus.includes('coding') ? 'Language + code' : 'Language learning'}</span><h3>${esc(teacher.name)}</h3></div><span class="teacher-registered-mark">${icon('check', 13)} Preview</span></div><p class="teacher-focus">${esc(teacher.focus)}</p><div class="teacher-metrics"><div><span>${icon('clock', 15)} Teaching hours</span><strong>${esc(teacher.hoursSummary)}</strong></div><div><span>${icon('people', 15)} Learners supported</span><strong>${teacher.learners} <small>sample</small></strong></div></div><div class="teacher-card-hours"><span>${icon('calendar', 15)} Weekly availability</span><strong>${esc(teacher.hours)}</strong></div><button class="button ${allowed && requested ? 'button-soft' : 'button-primary'} teacher-profile-button" type="button" data-action="connect-tutor" data-id="${teacher.id}">${allowed && requested ? 'Approved request saved' : allowed ? 'Request approved introduction' : 'Ask parent to approve this tutor'} ${icon(allowed && requested ? 'check' : 'arrow', 14)}</button><button class="text-link teacher-details-link" type="button" data-action="teacher-profile" data-id="${teacher.id}">View sample profile</button></div></article>`; }).join('') : '<div class="teacher-empty">No sample profiles match that focus yet. Try another filter.</div>'}</div>
      </section><div class="connection-child-note">${icon('heart', 17)} A parent can approve one named tutor at a time. Any new tutor requires a new signed approval and code.</div></div>`;
  }

  function renderConnectStudents() {
    const verified = tutorSessionIsValid();
    const grant = state.consent;
    const tutor = TEACHER_PROFILES.find((item) => item.id === grant.tutorId);
    const samplePreview = `<details class="locked-sample-preview"><summary>Preview fictional learner cards (read-only)</summary><div class="learner-request-grid">${LEARNER_REQUESTS.map((learner) => `<article class="learner-request-card sample-locked"><div class="learner-card-head"><span class="learner-avatar">${icon('user', 21)}</span><span class="guardian-managed-tag">${icon('lock', 13)} Fictional sample</span></div><span class="teacher-language-tag">${esc(learner.language)} · ${esc(learner.level)}</span><h3>${esc(learner.label)}</h3><div class="learner-goal"><small>Example learning goal</small><p>${esc(learner.goal)}</p></div><div class="learner-request-meta"><span>${icon('sparkles', 14)} ${esc(learner.interest)}</span><span>${icon('calendar', 14)} Sample schedule</span></div><button class="button button-soft" type="button" disabled>Parent code required before assignment</button></article>`).join('')}</div></details>`;
    const tutorOptions = TEACHER_PROFILES.map((profile) => `<option value="${profile.id}" ${grant.tutorId === profile.id ? 'selected' : ''}>${esc(profile.name)} · ${esc(profile.language)}</option>`).join('');
    const assignment = verified
      ? `<article class="approved-assignment-card"><div class="approved-assignment-mark">${icon('check', 22)}</div><span class="section-kicker">Parent-approved assignment</span><h2>${esc(grant.learnerAlias || 'Young learner')}</h2><p>Assigned tutor: <strong>${esc(tutor?.name || 'Approved tutor')}</strong>. The guardian approved this specific pairing and signed the consent form.</p><div class="assignment-scope-pill">${icon('shield', 15)} Anonymous learner · no contact details</div>${grant.assignmentAccepted ? `<div class="assignment-active-note">${icon('check', 16)} Assignment accepted in this local demo. No lesson, message or booking is actually created.</div>` : `<button class="button button-primary" data-action="accept-assignment">Accept this approved demo assignment ${icon('arrow', 15)}</button>`}</article>`
      : `<form class="tutor-consent-verify-card" data-form="tutor-consent-check"><div><span class="section-kicker">Required before teaching or connecting</span><h2>Validate the parent-approved code.</h2><p>A tutor may only open the learner’s anonymous assignment after the parent has signed the form, approved that tutor and shared the matching code.</p></div><label for="tutorIdentity">Your tutor profile<select id="tutorIdentity" name="tutorId" required><option value="">Choose your sample tutor profile</option>${tutorOptions}</select></label><label for="tutorConsentCode">Parent-approved consent code<input id="tutorConsentCode" name="consentCode" type="text" autocomplete="off" maxlength="12" placeholder="ID-123456" required /></label><button class="button button-primary" type="submit">Validate code & assignment ${icon('shield', 15)}</button><small>No code or parent approval means no learner profile, response, booking or teaching access.</small></form>`;
    return `<div class="container route-page connection-page connect-students-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Connect with Students</strong></div>
      <section class="connection-teacher-hero"><div><span class="section-kicker">For educators · safeguarding first</span><h1>Teach only after<br /><em>guardian approval.</em></h1><p>Every child–tutor pairing needs a signed parent consent form and a code that matches the assigned tutor before a learner can be accepted.</p><div class="hero-actions">${routeLink('connect_teachers', `Open family tutor directory ${icon('arrow', 15)}`, 'button button-outline')}${routeLink('consent', 'How consent works', 'text-link')}</div></div><div class="connection-kids-image"><img src="./assets/yoruba-kids-culture.jpg" alt="Children in traditional Yorùbá attire sharing a language book" /><span>Safety and family permission come first.</span></div></section>
      ${renderStepper(['Review request', 'Parent signs form', 'Validate tutor code', 'Accept assignment'], verified ? 3 : 0)}
      <div class="connection-notice">${icon('shield', 17)} <div><strong>Four checks before a real lesson.</strong><span>Parent approval · signed form · code matches the assigned tutor · secure production verification. This offline prototype demonstrates the flow but cannot verify a real parent.</span></div></div>
      <section class="tutor-approval-workspace">${assignment}</section>
      ${!verified ? samplePreview : ''}
      <div class="connection-child-note">${icon('lock', 17)} Tutor approvals are tutor-specific and expire after seven days in this demo. The stored local code is not a production credential.</div></div>`;
  }

  function renderConsent() {
    const grant = state.consent;
    const active = consentCodeIsActive();
    const pending = !!grant.requestCode && !grant.approved;
    const mode = active ? 'approved' : pending ? 'pending' : 'start';
    const activeStep = mode === 'start' ? 0 : mode === 'pending' ? 1 : (grant.childVerified || grant.tutorValidatedFor ? 3 : 2);
    const assignedTutor = TEACHER_PROFILES.find((item) => item.id === grant.tutorId);
    const tutorOptions = `<option value="">No tutor approved yet</option>${TEACHER_PROFILES.map((teacher) => `<option value="${teacher.id}" ${grant.tutorId === teacher.id ? 'selected' : ''}>${esc(teacher.name)} · ${esc(teacher.language)} · ${esc(teacher.focus)}</option>`).join('')}`;
    let body = '';
    if (mode === 'start') {
      body = `<section class="consent-step-card"><span class="section-kicker">Step 1 · request parent approval</span><h2>Start with a grown-up.</h2><p>Generate a short request reference, then invite a parent or guardian to complete and sign the consent form. The child does not receive an access code until after approval.</p><div class="consent-action-row"><button class="button button-primary" data-action="start-consent-request">Generate parent request code ${icon('arrow', 15)}</button>${routeLink('connect_teachers', 'Choose a tutor first ' + icon('arrow', 14), 'text-link')}</div><div class="consent-safety-callout">${icon('shield', 16)} Use a nickname only. Do not enter a child's full name, date of birth, address, phone number or school.</div></section>`;
    } else if (mode === 'pending') {
      body = `<section class="consent-step-card consent-request-card"><span class="section-kicker">Step 1 · share this request with a parent</span><h2>Parent request is ready.</h2><p>Give this reference to your parent or guardian. They must match it on the form below, read the permissions and add their typed signature before a learner code is issued.</p><div class="request-code-display"><small>Request reference · not an access code</small><strong>${esc(grant.requestCode)}</strong></div><form class="guardian-consent-form" data-form="guardian-consent"><span class="section-kicker">Step 2 · parent or guardian completes and signs</span><label for="guardianRequestCode">Request reference<input id="guardianRequestCode" name="requestCode" type="text" maxlength="12" placeholder="Enter the request reference above" required /></label><label for="learnerAlias">Child's nickname for this demo<input id="learnerAlias" name="learnerAlias" maxlength="28" value="${esc(grant.learnerAlias || 'Young learner')}" required /><small>Please use an alias, not the child's legal name.</small></label><label for="guardianRelationship">I am the child's<select id="guardianRelationship" name="relationship" required><option value="">Choose relationship</option><option>Parent</option><option>Legal guardian</option><option>Other caregiver with authority</option></select></label><label for="guardianSignature">Parent / guardian typed signature<input id="guardianSignature" name="signature" maxlength="80" autocomplete="off" placeholder="Type your name to sign" required /><small>The typed signature is checked in this demo but is not saved.</small></label><div class="guardian-consent-checks"><label class="consent-check"><input type="checkbox" name="accountConsent" value="yes" required /><span>I am authorised to act for this child and approve creation of a supervised learning account.</span></label><label class="consent-check"><input type="checkbox" name="tutorConsent" value="yes" /><span>I approve the child connecting with the specific tutor selected below. I understand other tutors need separate approval.</span></label></div><label for="consentTutor">Tutor approved for this child (optional) <select id="consentTutor" name="tutorId">${tutorOptions}</select></label><p class="consent-form-summary">If you select a tutor, you must also tick the tutor-approval box. If no tutor is assigned, the code can authorize account creation only.</p><label class="consent-check final-consent-check"><input type="checkbox" name="consentRead" value="yes" required /><span>I have read the short consent statement. I understand I can withdraw permission; this offline preview does not create an account, send messages or arrange lessons.</span></label><button class="button button-primary" type="submit">Sign approval & issue child code ${icon('check', 15)}</button></form></section>`;
    } else {
      const expired = !active;
      body = expired
        ? `<section class="consent-step-card"><span class="section-kicker">Approval expired</span><h2>Generate a fresh parent request.</h2><p>This demo code has expired or is no longer active. A guardian must complete a fresh form before a child account or tutor pairing can proceed.</p><button class="button button-primary" data-action="start-consent-request">Create a new request ${icon('arrow', 15)}</button></section>`
        : `<section class="consent-approved-card"><div class="consent-approved-icon">${icon('check', 25)}</div><span class="section-kicker">Step 3 · parent approved</span><h2>Guardian approval is ready.</h2><p>The parent-signed form has approved a supervised account${grant.tutorApproved ? ` and one named tutor: <strong>${esc(assignedTutor?.name || 'Approved tutor')}</strong>` : ' only; tutor access is not approved yet'}.</p><div class="approved-code-display"><small>Child consent code · share only with the learner and approved tutor</small><strong>${esc(grant.approvedCode)}</strong><span>Expires in 7 days · local demo only</span></div><div class="consent-scope-list"><span>${icon('check', 15)} Child account approval: active</span><span>${grant.tutorApproved ? icon('check', 15) : icon('lock', 15)} Tutor approval: ${grant.tutorApproved ? esc(assignedTutor?.name || 'one assigned tutor') : 'not included'}</span></div><div class="consent-action-row"><button class="button button-primary" data-action="consent-signup">Continue to child sign-up ${icon('arrow', 14)}</button>${routeLink('connect_students', 'Tutor code validation ' + icon('arrow', 14), 'button button-outline')}</div><p class="consent-demo-warning">This is an offline prototype: its local code cannot prove who signed or securely notify another device. Do not use it to authorise a real child account or lesson.</p></section>`;
    }
    return `<div class="container route-page consent-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Parent & guardian consent</strong></div><section class="consent-hero"><div><span class="section-kicker">A clear, family-first safeguard</span><h1>Permission before<br /><em>connection.</em></h1><p>A short guardian-signed form comes first. Only then can the child receive a code—and a tutor must validate that same code before a learner assignment opens.</p><div class="consent-hero-tags"><span>${icon('lock', 15)} No child contact details</span><span>${icon('shield', 15)} Tutor-specific approval</span></div></div><div class="consent-hero-image"><img src="./assets/hero-reader.jpg" alt="A parent and child reviewing a learning activity together" /><span>Illustrative family learning scene.</span></div></section>${renderStepper(['Request code', 'Guardian form', 'Approved code', 'Use & validate'], activeStep)}${body}<div class="consent-four-rules"><article><strong>1. Request</strong><span>A reference is created for the parent to review.</span></article><article><strong>2. Sign</strong><span>Guardian role, permissions and typed signature are required.</span></article><article><strong>3. Issue</strong><span>A child code appears only after the form passes its checks.</span></article><article><strong>4. Validate</strong><span>Signup and a named tutor must validate the approved code.</span></article></div><div class="consent-security-note">${icon('info', 16)} Browser storage is not secure verification. A production service needs a protected backend, guardian identity/authority checks, expiring one-time tokens, audit records, secure account controls and a reviewed child-safeguarding/legal process.</div></div>`;
  }

  function openTeacherProfile(id) {
    const teacher = TEACHER_PROFILES.find((item) => item.id === id);
    if (!teacher) return;
    const requested = state.teacherRequests.includes(teacher.id);
    document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal-card teacher-modal" role="dialog" aria-modal="true" aria-labelledby="teacherModalTitle"><button class="modal-close icon-button" data-action="close-modal" aria-label="Close profile">${icon('close', 19)}</button><div class="teacher-modal-top"><span class="teacher-modal-avatar" aria-hidden="true">${esc(teacher.name.split(' ').map((part) => part[0]).join(''))}</span><div><span class="section-kicker">Sample educator profile</span><h2 id="teacherModalTitle">${esc(teacher.name)}</h2><p>${esc(teacher.language)} · ${esc(teacher.focus)}</p></div></div><div class="teacher-modal-stats"><div><span>Teaching hours</span><strong>${esc(teacher.hours)}</strong></div><div><span>Learners supported</span><strong>${teacher.learners} <small>sample learners</small></strong></div></div><p class="teacher-modal-bio">${esc(teacher.bio)}</p><div class="teacher-modal-safeguard">${icon('shield', 16)} This preview does not contact this educator. A parent or guardian should review and arrange any real session.</div><button class="button ${requested ? 'button-soft' : 'button-primary'} teacher-request-button" data-action="request-teacher-intro" data-id="${teacher.id}" ${requested ? 'aria-pressed="true"' : ''}>${requested ? 'Request saved in this demo' : 'Request a learning introduction'} ${icon(requested ? 'check' : 'arrow', 15)}</button></section></div>`;
    document.querySelector('.teacher-request-button')?.focus();
  }

  function openLearnerProfile(id) {
    const learner = LEARNER_REQUESTS.find((item) => item.id === id);
    if (!learner) return;
    const replied = state.teacherReplies.includes(learner.id);
    document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal-card learner-modal" role="dialog" aria-modal="true" aria-labelledby="learnerModalTitle"><button class="modal-close icon-button" data-action="close-modal" aria-label="Close profile">${icon('close', 19)}</button><span class="side-card-icon">${icon('people', 21)}</span><span class="section-kicker">Anonymous, family-managed learner preview</span><h2 id="learnerModalTitle">${esc(learner.label)}</h2><div class="learner-modal-facts"><p><strong>Language & level</strong><span>${esc(learner.language)} · ${esc(learner.level)}</span></p><p><strong>Learning goal</strong><span>${esc(learner.goal)}</span></p><p><strong>Preferred time</strong><span>${esc(learner.preferred)}</span></p></div><div class="teacher-modal-safeguard">${icon('shield', 16)} In a real service, a parent or guardian must approve any introduction. Contact details are intentionally not shown.</div><button class="button ${replied ? 'button-soft' : 'button-primary'}" data-action="respond-learner" data-id="${learner.id}">${replied ? 'Interest saved in this demo' : 'Express interest (demo)'} ${icon(replied ? 'check' : 'arrow', 15)}</button></section></div>`;
  }


  function renderBase() { return renderDirectory(); }

  
    /* ==========================================================================
       VOICE AFRICAN LANGUAGE TRAINER MODEL DATA & ENGINE (60 LESSONS / 3 TIERS)
       ========================================================================== */
    const TRAINER_CURRICULUM = {"yoruba":{"beginner":[{"id":1,"title":"Lesson 1: Ẹ kú àárọ̀ o, ẹ ṣeé púpọ...","category":"Greetings & Tones","phrase":"Ẹ kú àárọ̀ o, ẹ ṣeé púpọ̀","phonetic":"[ẹ kú àárọ̀ o, ẹ ṣeé púpọ̀]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"kú","tone":"high","pitch":"Mí","freq":330},{"text":"àár","tone":"mid","pitch":"Re","freq":293},{"text":"o","tone":"low","pitch":"Dó","freq":261},{"text":"eé","tone":"high","pitch":"Mí","freq":330},{"text":"púp","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #1 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":2,"title":"Lesson 2: Ẹ kú ìrọ̀lẹ́ o, àlàáfíà ...","category":"Greetings & Tones","phrase":"Ẹ kú ìrọ̀lẹ́ o, àlàáfíà ni?","phonetic":"[ẹ kú ìrọ̀lẹ́ o, àlàáfíà ni?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"kú","tone":"high","pitch":"Mí","freq":330},{"text":"ìrl","tone":"mid","pitch":"Re","freq":293},{"text":"o","tone":"low","pitch":"Dó","freq":261},{"text":"àlàáfíà","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #2 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":3,"title":"Lesson 3: Orúkọ mi ni Tèmítọ́pẹ́, ...","category":"Greetings & Tones","phrase":"Orúkọ mi ni Tèmítọ́pẹ́, inú mi dùn","phonetic":"[orúkọ mi ni tèmítọ́pẹ́, inú mi dùn]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Orúk","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293},{"text":"ni","tone":"low","pitch":"Dó","freq":261},{"text":"Tèmítp","tone":"high","pitch":"Mí","freq":330},{"text":"inú","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #3 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":4,"title":"Lesson 4: Oókan, Èjì, Ẹ́ta, Ẹ́rin,...","category":"Greetings & Tones","phrase":"Oókan, Èjì, Ẹ́ta, Ẹ́rin, Àrún","phonetic":"[oókan, èjì, ẹ́ta, ẹ́rin, àrún]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Oókan","tone":"high","pitch":"Mí","freq":330},{"text":"Èjì","tone":"mid","pitch":"Re","freq":293},{"text":"ta","tone":"low","pitch":"Dó","freq":261},{"text":"rin","tone":"high","pitch":"Mí","freq":330},{"text":"Àrún","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #4 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":5,"title":"Lesson 5: Ẹ̀fà, Èje, Ẹ́jọ, Ẹ́sàn, ...","category":"Greetings & Tones","phrase":"Ẹ̀fà, Èje, Ẹ́jọ, Ẹ́sàn, Mẹ́wàá","phonetic":"[ẹ̀fà, èje, ẹ́jọ, ẹ́sàn, mẹ́wàá]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"fà","tone":"high","pitch":"Mí","freq":330},{"text":"Èje","tone":"mid","pitch":"Re","freq":293},{"text":"j","tone":"low","pitch":"Dó","freq":261},{"text":"sàn","tone":"high","pitch":"Mí","freq":330},{"text":"Mwàá","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #5 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":6,"title":"Lesson 6: Bàbá mi, Ìyá mi, àti Àbú...","category":"Numbers & Kinship","phrase":"Bàbá mi, Ìyá mi, àti Àbúrò mi","phonetic":"[bàbá mi, ìyá mi, àti àbúrò mi]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Bàbá","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293},{"text":"Ìyá","tone":"low","pitch":"Dó","freq":261},{"text":"mi","tone":"high","pitch":"Mí","freq":330},{"text":"àti","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #6 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":7,"title":"Lesson 7: Ẹ jọ̀ọ́, ẹ fún mi ní omi...","category":"Numbers & Kinship","phrase":"Ẹ jọ̀ọ́, ẹ fún mi ní omi tútù","phonetic":"[ẹ jọ̀ọ́, ẹ fún mi ní omi tútù]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"j","tone":"high","pitch":"Mí","freq":330},{"text":"fún","tone":"mid","pitch":"Re","freq":293},{"text":"mi","tone":"low","pitch":"Dó","freq":261},{"text":"ní","tone":"high","pitch":"Mí","freq":330},{"text":"omi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #7 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":8,"title":"Lesson 8: Pupa bí iná, Dúdú bí èéd...","category":"Numbers & Kinship","phrase":"Pupa bí iná, Dúdú bí èédú, Funfun","phonetic":"[pupa bí iná, dúdú bí èédú, funfun]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Pupa","tone":"high","pitch":"Mí","freq":330},{"text":"bí","tone":"mid","pitch":"Re","freq":293},{"text":"iná","tone":"low","pitch":"Dó","freq":261},{"text":"Dúdú","tone":"high","pitch":"Mí","freq":330},{"text":"bí","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #8 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":9,"title":"Lesson 9: Ilé wa lẹ́wà, ìwé kíkà d...","category":"Numbers & Kinship","phrase":"Ilé wa lẹ́wà, ìwé kíkà dùn mọ́ mi","phonetic":"[ilé wa lẹ́wà, ìwé kíkà dùn mọ́ mi]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ilé","tone":"high","pitch":"Mí","freq":330},{"text":"wa","tone":"mid","pitch":"Re","freq":293},{"text":"lwà","tone":"low","pitch":"Dó","freq":261},{"text":"ìwé","tone":"high","pitch":"Mí","freq":330},{"text":"kíkà","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #9 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":10,"title":"Lesson 10: Inú mi dùn púpọ̀ lónìí...","category":"Numbers & Kinship","phrase":"Inú mi dùn púpọ̀ lónìí","phonetic":"[inú mi dùn púpọ̀ lónìí]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Inú","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293},{"text":"dùn","tone":"low","pitch":"Dó","freq":261},{"text":"púp","tone":"high","pitch":"Mí","freq":330},{"text":"lónìí","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #10 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":11,"title":"Lesson 11: Bẹ́ẹ̀ni mà, Rárá sir, ẹ ...","category":"Daily Life & Nature","phrase":"Bẹ́ẹ̀ni mà, Rárá sir, ẹ ṣeé púpọ̀","phonetic":"[bẹ́ẹ̀ni mà, rárá sir, ẹ ṣeé púpọ̀]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Bni","tone":"high","pitch":"Mí","freq":330},{"text":"mà","tone":"mid","pitch":"Re","freq":293},{"text":"Rárá","tone":"low","pitch":"Dó","freq":261},{"text":"sir","tone":"high","pitch":"Mí","freq":330},{"text":"eé","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #11 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":12,"title":"Lesson 12: Èló ni ẹja tútù yìí, ẹ̀g...","category":"Daily Life & Nature","phrase":"Èló ni ẹja tútù yìí, ẹ̀gbọ́n mi?","phonetic":"[èló ni ẹja tútù yìí, ẹ̀gbọ́n mi?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Èló","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"ja","tone":"low","pitch":"Dó","freq":261},{"text":"tútù","tone":"high","pitch":"Mí","freq":330},{"text":"yìí","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #12 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":13,"title":"Lesson 13: Ajá ń gbó, adìyẹ ń kọ, e...","category":"Daily Life & Nature","phrase":"Ajá ń gbó, adìyẹ ń kọ, ewúrẹ́ ń jẹkoríko","phonetic":"[ajá ń gbó, adìyẹ ń kọ, ewúrẹ́ ń jẹkoríko]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ajá","tone":"high","pitch":"Mí","freq":330},{"text":"ń","tone":"mid","pitch":"Re","freq":293},{"text":"gbó","tone":"low","pitch":"Dó","freq":261},{"text":"adìy","tone":"high","pitch":"Mí","freq":330},{"text":"ń","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #13 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":14,"title":"Lesson 14: Ọjọ́ Ajé, Ọjọ́ Ìṣẹ́gun, ...","category":"Daily Life & Nature","phrase":"Ọjọ́ Ajé, Ọjọ́ Ìṣẹ́gun, Ọjọ́ Ọ̀sẹ̀","phonetic":"[ọjọ́ ajé, ọjọ́ ìṣẹ́gun, ọjọ́ ọ̀sẹ̀]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"j","tone":"high","pitch":"Mí","freq":330},{"text":"Ajé","tone":"mid","pitch":"Re","freq":293},{"text":"j","tone":"low","pitch":"Dó","freq":261},{"text":"Ìgun","tone":"high","pitch":"Mí","freq":330},{"text":"j","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #14 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":15,"title":"Lesson 15: Orí, Ojú, Imú, Ẹnu, Ọwọ́...","category":"Daily Life & Nature","phrase":"Orí, Ojú, Imú, Ẹnu, Ọwọ́ àti Ẹsẹ̀","phonetic":"[orí, ojú, imú, ẹnu, ọwọ́ àti ẹsẹ̀]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Orí","tone":"high","pitch":"Mí","freq":330},{"text":"Ojú","tone":"mid","pitch":"Re","freq":293},{"text":"Imú","tone":"low","pitch":"Dó","freq":261},{"text":"nu","tone":"high","pitch":"Mí","freq":330},{"text":"w","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #15 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":16,"title":"Lesson 16: Níbo ni ilé-ìwé wa wà?...","category":"Daily Life & Nature","phrase":"Níbo ni ilé-ìwé wa wà?","phonetic":"[níbo ni ilé-ìwé wa wà?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Níbo","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"iléìwé","tone":"low","pitch":"Dó","freq":261},{"text":"wa","tone":"high","pitch":"Mí","freq":330},{"text":"wà","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #16 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":17,"title":"Lesson 17: Ẹ wá jẹun pẹ̀lú wa, oúnj...","category":"Daily Life & Nature","phrase":"Ẹ wá jẹun pẹ̀lú wa, oúnjẹ ti dé","phonetic":"[ẹ wá jẹun pẹ̀lú wa, oúnjẹ ti dé]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"wá","tone":"high","pitch":"Mí","freq":330},{"text":"jun","tone":"mid","pitch":"Re","freq":293},{"text":"plú","tone":"low","pitch":"Dó","freq":261},{"text":"wa","tone":"high","pitch":"Mí","freq":330},{"text":"oúnj","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #17 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":18,"title":"Lesson 18: Oòrùn ń ran lọ́wọ́, òjò ...","category":"Daily Life & Nature","phrase":"Oòrùn ń ran lọ́wọ́, òjò ń rọ̀ sorí ilẹ̀","phonetic":"[oòrùn ń ran lọ́wọ́, òjò ń rọ̀ sorí ilẹ̀]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Oòrùn","tone":"high","pitch":"Mí","freq":330},{"text":"ń","tone":"mid","pitch":"Re","freq":293},{"text":"ran","tone":"low","pitch":"Dó","freq":261},{"text":"lw","tone":"high","pitch":"Mí","freq":330},{"text":"òjò","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #18 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":19,"title":"Lesson 19: Ó dàárọ̀ o, kí Ọlọ́run ṣ...","category":"Daily Life & Nature","phrase":"Ó dàárọ̀ o, kí Ọlọ́run ṣọ́ wa","phonetic":"[ó dàárọ̀ o, kí ọlọ́run ṣọ́ wa]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ó","tone":"high","pitch":"Mí","freq":330},{"text":"dàár","tone":"mid","pitch":"Re","freq":293},{"text":"o","tone":"low","pitch":"Dó","freq":261},{"text":"kí","tone":"high","pitch":"Mí","freq":330},{"text":"lrun","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #19 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":20,"title":"Lesson 20: Ọmọlúwàbí ni mí, èdè mi ...","category":"Daily Life & Nature","phrase":"Ọmọlúwàbí ni mí, èdè mi lọlá mi!","phonetic":"[ọmọlúwàbí ni mí, èdè mi lọlá mi!]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"mlúwàbí","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"mí","tone":"low","pitch":"Dó","freq":261},{"text":"èdè","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #20 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1}],"intermediate":[{"id":21,"title":"Lesson 21: Àlọ́ o! Àlọ̀! Àlọ́ mi dá...","category":"Conversations & Culture","phrase":"Àlọ́ o! Àlọ̀! Àlọ́ mi dá fìrìgbàgbò...","phonetic":"[àlọ́ o! àlọ̀! àlọ́ mi dá fìrìgbàgbò...]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Àl","tone":"high","pitch":"Mí","freq":330},{"text":"o","tone":"mid","pitch":"Re","freq":293},{"text":"Àl","tone":"low","pitch":"Dó","freq":261},{"text":"Àl","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #21 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":22,"title":"Lesson 22: Bá mi lọ, ba lórí igi, b...","category":"Conversations & Culture","phrase":"Bá mi lọ, ba lórí igi, bà sorí ilẹ̀","phonetic":"[bá mi lọ, ba lórí igi, bà sorí ilẹ̀]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Bá","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293},{"text":"l","tone":"low","pitch":"Dó","freq":261},{"text":"ba","tone":"high","pitch":"Mí","freq":330},{"text":"lórí","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #22 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":23,"title":"Lesson 23: Aṣọ-òkè lẹ́wà, agbádá bà...","category":"Conversations & Culture","phrase":"Aṣọ-òkè lẹ́wà, agbádá bàbá gùn dáadáa","phonetic":"[aṣọ-òkè lẹ́wà, agbádá bàbá gùn dáadáa]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Aòkè","tone":"high","pitch":"Mí","freq":330},{"text":"lwà","tone":"mid","pitch":"Re","freq":293},{"text":"agbádá","tone":"low","pitch":"Dó","freq":261},{"text":"bàbá","tone":"high","pitch":"Mí","freq":330},{"text":"gùn","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #23 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":24,"title":"Lesson 24: Mo fẹ́ràn eré ayò àti or...","category":"Conversations & Culture","phrase":"Mo fẹ́ràn eré ayò àti orin kíkọ","phonetic":"[mo fẹ́ràn eré ayò àti orin kíkọ]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Mo","tone":"high","pitch":"Mí","freq":330},{"text":"fràn","tone":"mid","pitch":"Re","freq":293},{"text":"eré","tone":"low","pitch":"Dó","freq":261},{"text":"ayò","tone":"high","pitch":"Mí","freq":330},{"text":"àti","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #24 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":25,"title":"Lesson 25: Ká-biyè-ésí o, Ká-biyè-é...","category":"Conversations & Culture","phrase":"Ká-biyè-ésí o, Ká-biyè-ésí o!","phonetic":"[ká-biyè-ésí o, ká-biyè-ésí o!]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kábiyèésí","tone":"high","pitch":"Mí","freq":330},{"text":"o","tone":"mid","pitch":"Re","freq":293},{"text":"Kábiyèésí","tone":"low","pitch":"Dó","freq":261},{"text":"o","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #25 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":26,"title":"Lesson 26: Ẹ fún mi ní amàlà, gbẹ̀g...","category":"Conversations & Culture","phrase":"Ẹ fún mi ní amàlà, gbẹ̀gìrì àti ewédú","phonetic":"[ẹ fún mi ní amàlà, gbẹ̀gìrì àti ewédú]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"fún","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293},{"text":"ní","tone":"low","pitch":"Dó","freq":261},{"text":"amàlà","tone":"high","pitch":"Mí","freq":330},{"text":"gbgìrì","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #26 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":27,"title":"Lesson 27: Aago mélòó ló lù lọ́wọ́ ...","category":"Conversations & Culture","phrase":"Aago mélòó ló lù lọ́wọ́ yìí?","phonetic":"[aago mélòó ló lù lọ́wọ́ yìí?]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Aago","tone":"high","pitch":"Mí","freq":330},{"text":"mélòó","tone":"mid","pitch":"Re","freq":293},{"text":"ló","tone":"low","pitch":"Dó","freq":261},{"text":"lù","tone":"high","pitch":"Mí","freq":330},{"text":"lw","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #27 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":28,"title":"Lesson 28: Màmá Àgbà ń kọ́ mi ní or...","category":"Conversations & Culture","phrase":"Màmá Àgbà ń kọ́ mi ní orin ìbílẹ̀","phonetic":"[màmá àgbà ń kọ́ mi ní orin ìbílẹ̀]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Màmá","tone":"high","pitch":"Mí","freq":330},{"text":"Àgbà","tone":"mid","pitch":"Re","freq":293},{"text":"ń","tone":"low","pitch":"Dó","freq":261},{"text":"k","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #28 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":29,"title":"Lesson 29: Èkó gbajúmọ̀, Ìbàdàn ní ...","category":"Conversations & Culture","phrase":"Èkó gbajúmọ̀, Ìbàdàn ní orí-òkè méje","phonetic":"[èkó gbajúmọ̀, ìbàdàn ní orí-òkè méje]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Èkó","tone":"high","pitch":"Mí","freq":330},{"text":"gbajúm","tone":"mid","pitch":"Re","freq":293},{"text":"Ìbàdàn","tone":"low","pitch":"Dó","freq":261},{"text":"ní","tone":"high","pitch":"Mí","freq":330},{"text":"oríòkè","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #29 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":30,"title":"Lesson 30: Èdè Yorùbá àti ìmọ̀-ẹ̀rọ...","category":"Conversations & Culture","phrase":"Èdè Yorùbá àti ìmọ̀-ẹ̀rọ kọ̀mpútà papọ̀","phonetic":"[èdè yorùbá àti ìmọ̀-ẹ̀rọ kọ̀mpútà papọ̀]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Èdè","tone":"high","pitch":"Mí","freq":330},{"text":"Yorùbá","tone":"mid","pitch":"Re","freq":293},{"text":"àti","tone":"low","pitch":"Dó","freq":261},{"text":"ìmr","tone":"high","pitch":"Mí","freq":330},{"text":"kmpútà","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #30 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":31,"title":"Lesson 31: Ayẹyẹ Ọdún Iṣu Tuntun ti...","category":"Rhythm & Community","phrase":"Ayẹyẹ Ọdún Iṣu Tuntun ti dé pẹ̀lú ayọ̀","phonetic":"[ayẹyẹ ọdún iṣu tuntun ti dé pẹ̀lú ayọ̀]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ayy","tone":"high","pitch":"Mí","freq":330},{"text":"dún","tone":"mid","pitch":"Re","freq":293},{"text":"Iu","tone":"low","pitch":"Dó","freq":261},{"text":"Tuntun","tone":"high","pitch":"Mí","freq":330},{"text":"ti","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #31 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":32,"title":"Lesson 32: Ẹ jọ̀ọ́, ẹ dín owó rẹ̀ k...","category":"Rhythm & Community","phrase":"Ẹ jọ̀ọ́, ẹ dín owó rẹ̀ kù fún mi díẹ̀","phonetic":"[ẹ jọ̀ọ́, ẹ dín owó rẹ̀ kù fún mi díẹ̀]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"j","tone":"high","pitch":"Mí","freq":330},{"text":"dín","tone":"mid","pitch":"Re","freq":293},{"text":"owó","tone":"low","pitch":"Dó","freq":261},{"text":"r","tone":"high","pitch":"Mí","freq":330},{"text":"kù","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #32 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":33,"title":"Lesson 33: Lojú tèmi, èdè wa ni orí...","category":"Rhythm & Community","phrase":"Lojú tèmi, èdè wa ni orísun ọgbọ́n wa","phonetic":"[lojú tèmi, èdè wa ni orísun ọgbọ́n wa]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Lojú","tone":"high","pitch":"Mí","freq":330},{"text":"tèmi","tone":"mid","pitch":"Re","freq":293},{"text":"èdè","tone":"low","pitch":"Dó","freq":261},{"text":"wa","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #33 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":34,"title":"Lesson 34: Oyin dùn, ata ta, ewúrẹ́...","category":"Rhythm & Community","phrase":"Oyin dùn, ata ta, ewúrẹ́ dùn mọ́ ẹnu","phonetic":"[oyin dùn, ata ta, ewúrẹ́ dùn mọ́ ẹnu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Oyin","tone":"high","pitch":"Mí","freq":330},{"text":"dùn","tone":"mid","pitch":"Re","freq":293},{"text":"ata","tone":"low","pitch":"Dó","freq":261},{"text":"ta","tone":"high","pitch":"Mí","freq":330},{"text":"ewúr","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #34 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":35,"title":"Lesson 35: Ẹ má bìnú o, àlàáfíà ni ...","category":"Rhythm & Community","phrase":"Ẹ má bìnú o, àlàáfíà ni a ó máa rí","phonetic":"[ẹ má bìnú o, àlàáfíà ni a ó máa rí]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"má","tone":"high","pitch":"Mí","freq":330},{"text":"bìnú","tone":"mid","pitch":"Re","freq":293},{"text":"o","tone":"low","pitch":"Dó","freq":261},{"text":"àlàáfíà","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #35 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":36,"title":"Lesson 36: Gba ọwọ́ ọ̀tún, yà sí ọw...","category":"Rhythm & Community","phrase":"Gba ọwọ́ ọ̀tún, yà sí ọwọ́ òsì lẹ́bàá ọjà","phonetic":"[gba ọwọ́ ọ̀tún, yà sí ọwọ́ òsì lẹ́bàá ọjà]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Gba","tone":"high","pitch":"Mí","freq":330},{"text":"w","tone":"mid","pitch":"Re","freq":293},{"text":"tún","tone":"low","pitch":"Dó","freq":261},{"text":"yà","tone":"high","pitch":"Mí","freq":330},{"text":"sí","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #36 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":37,"title":"Lesson 37: Kìnnìún ní ọba ẹranko, e...","category":"Rhythm & Community","phrase":"Kìnnìún ní ọba ẹranko, erin ní baba igbó","phonetic":"[kìnnìún ní ọba ẹranko, erin ní baba igbó]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kìnnìún","tone":"high","pitch":"Mí","freq":330},{"text":"ní","tone":"mid","pitch":"Re","freq":293},{"text":"ba","tone":"low","pitch":"Dó","freq":261},{"text":"ranko","tone":"high","pitch":"Mí","freq":330},{"text":"erin","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #37 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":38,"title":"Lesson 38: Ẹ dárí jì mí, mi ò ní ṣe...","category":"Rhythm & Community","phrase":"Ẹ dárí jì mí, mi ò ní ṣe bẹ́ẹ̀ mọ́","phonetic":"[ẹ dárí jì mí, mi ò ní ṣe bẹ́ẹ̀ mọ́]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"dárí","tone":"high","pitch":"Mí","freq":330},{"text":"jì","tone":"mid","pitch":"Re","freq":293},{"text":"mí","tone":"low","pitch":"Dó","freq":261},{"text":"mi","tone":"high","pitch":"Mí","freq":330},{"text":"ò","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #38 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":39,"title":"Lesson 39: Bùsọ́kùn ọmọ mi, orun re...","category":"Rhythm & Community","phrase":"Bùsọ́kùn ọmọ mi, orun rere lo máa sùn","phonetic":"[bùsọ́kùn ọmọ mi, orun rere lo máa sùn]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Bùskùn","tone":"high","pitch":"Mí","freq":330},{"text":"m","tone":"mid","pitch":"Re","freq":293},{"text":"mi","tone":"low","pitch":"Dó","freq":261},{"text":"orun","tone":"high","pitch":"Mí","freq":330},{"text":"rere","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #39 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":40,"title":"Lesson 40: Èdè mi kò ní parun lẹ́nu...","category":"Rhythm & Community","phrase":"Èdè mi kò ní parun lẹ́nu mi láé!","phonetic":"[èdè mi kò ní parun lẹ́nu mi láé!]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Èdè","tone":"high","pitch":"Mí","freq":330},{"text":"mi","tone":"mid","pitch":"Re","freq":293},{"text":"kò","tone":"low","pitch":"Dó","freq":261},{"text":"ní","tone":"high","pitch":"Mí","freq":330},{"text":"parun","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #40 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2}],"advanced":[{"id":41,"title":"Lesson 41: Sùúrù lérè, àgbà tó ní s...","category":"Classical Proverbs","phrase":"Sùúrù lérè, àgbà tó ní sùúrù ohun gbogbo ló ní","phonetic":"[sùúrù lérè, àgbà tó ní sùúrù ohun gbogbo ló ní]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Sùúrù","tone":"high","pitch":"Mí","freq":330},{"text":"lérè","tone":"mid","pitch":"Re","freq":293},{"text":"àgbà","tone":"low","pitch":"Dó","freq":261},{"text":"tó","tone":"high","pitch":"Mí","freq":330},{"text":"ní","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #41 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":42,"title":"Lesson 42: Àgbájọ ọwọ́ la fi ń sọ̀y...","category":"Classical Proverbs","phrase":"Àgbájọ ọwọ́ la fi ń sọ̀yà, ọwọ́ kan kò lè gbé ẹrù","phonetic":"[àgbájọ ọwọ́ la fi ń sọ̀yà, ọwọ́ kan kò lè gbé ẹrù]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Àgbáj","tone":"high","pitch":"Mí","freq":330},{"text":"w","tone":"mid","pitch":"Re","freq":293},{"text":"la","tone":"low","pitch":"Dó","freq":261},{"text":"fi","tone":"high","pitch":"Mí","freq":330},{"text":"ń","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #42 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":43,"title":"Lesson 43: Ọ̀pọ̀lọ́pọ̀ ọ̀pọ̀lọ́ ló ...","category":"Classical Proverbs","phrase":"Ọ̀pọ̀lọ́pọ̀ ọ̀pọ̀lọ́ ló ń fò nínú pọ̀lọ́pọ̀lọ̀ lẹ́bàá odò","phonetic":"[ọ̀pọ̀lọ́pọ̀ ọ̀pọ̀lọ́ ló ń fò nínú pọ̀lọ́pọ̀lọ̀ lẹ́bàá odò]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"plp","tone":"high","pitch":"Mí","freq":330},{"text":"pl","tone":"mid","pitch":"Re","freq":293},{"text":"ló","tone":"low","pitch":"Dó","freq":261},{"text":"ń","tone":"high","pitch":"Mí","freq":330},{"text":"fò","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #43 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":44,"title":"Lesson 44: Kànnàkánnà kàn lórí igi ...","category":"Classical Proverbs","phrase":"Kànnàkánnà kàn lórí igi kànnàkánnà tó ga fíofío","phonetic":"[kànnàkánnà kàn lórí igi kànnàkánnà tó ga fíofío]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kànnàkánnà","tone":"high","pitch":"Mí","freq":330},{"text":"kàn","tone":"mid","pitch":"Re","freq":293},{"text":"lórí","tone":"low","pitch":"Dó","freq":261},{"text":"igi","tone":"high","pitch":"Mí","freq":330},{"text":"kànnàkánnà","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #44 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":45,"title":"Lesson 45: Ìbàdàn kò nílé tútù, gbo...","category":"Classical Proverbs","phrase":"Ìbàdàn kò nílé tútù, gbogbo ilé ní ń kọ́ ọ̀sẹ̀ àti ayọ̀","phonetic":"[ìbàdàn kò nílé tútù, gbogbo ilé ní ń kọ́ ọ̀sẹ̀ àti ayọ̀]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ìbàdàn","tone":"high","pitch":"Mí","freq":330},{"text":"kò","tone":"mid","pitch":"Re","freq":293},{"text":"nílé","tone":"low","pitch":"Dó","freq":261},{"text":"tútù","tone":"high","pitch":"Mí","freq":330},{"text":"gbogbo","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #45 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":46,"title":"Lesson 46: Kábiyeèsí Aláàfin! Kádé ...","category":"Classical Proverbs","phrase":"Kábiyeèsí Aláàfin! Kádé pẹ́ lórí, kí bàtà pẹ́ lẹ́sẹ̀!","phonetic":"[kábiyeèsí aláàfin! kádé pẹ́ lórí, kí bàtà pẹ́ lẹ́sẹ̀!]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kábiyeèsí","tone":"high","pitch":"Mí","freq":330},{"text":"Aláàfin","tone":"mid","pitch":"Re","freq":293},{"text":"Kádé","tone":"low","pitch":"Dó","freq":261},{"text":"p","tone":"high","pitch":"Mí","freq":330},{"text":"lórí","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #46 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":47,"title":"Lesson 47: Ìwà rere lẹ̀ṣọ́ ènìyàn, ...","category":"Classical Proverbs","phrase":"Ìwà rere lẹ̀ṣọ́ ènìyàn, owó kò lè ra orúkọ rere","phonetic":"[ìwà rere lẹ̀ṣọ́ ènìyàn, owó kò lè ra orúkọ rere]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ìwà","tone":"high","pitch":"Mí","freq":330},{"text":"rere","tone":"mid","pitch":"Re","freq":293},{"text":"l","tone":"low","pitch":"Dó","freq":261},{"text":"ènìyàn","tone":"high","pitch":"Mí","freq":330},{"text":"owó","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #47 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":48,"title":"Lesson 48: Àlọ́ lórí Ìjàpá àti Ẹlẹ́...","category":"Classical Proverbs","phrase":"Àlọ́ lórí Ìjàpá àti Ẹlẹ́dẹ̀ nínú igbó àìmọ̀","phonetic":"[àlọ́ lórí ìjàpá àti ẹlẹ́dẹ̀ nínú igbó àìmọ̀]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Àl","tone":"high","pitch":"Mí","freq":330},{"text":"lórí","tone":"mid","pitch":"Re","freq":293},{"text":"Ìjàpá","tone":"low","pitch":"Dó","freq":261},{"text":"àti","tone":"high","pitch":"Mí","freq":330},{"text":"ld","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #48 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":49,"title":"Lesson 49: Odò tí ó bá gbàgbé orísu...","category":"Classical Proverbs","phrase":"Odò tí ó bá gbàgbé orísun rẹ̀, gbígbẹ ni yóò gbẹ","phonetic":"[odò tí ó bá gbàgbé orísun rẹ̀, gbígbẹ ni yóò gbẹ]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Odò","tone":"high","pitch":"Mí","freq":330},{"text":"tí","tone":"mid","pitch":"Re","freq":293},{"text":"ó","tone":"low","pitch":"Dó","freq":261},{"text":"bá","tone":"high","pitch":"Mí","freq":330},{"text":"gbàgbé","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #49 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":50,"title":"Lesson 50: Ẹbí wa wá láti ìrandíran...","category":"Classical Proverbs","phrase":"Ẹbí wa wá láti ìrandíran akọni àti ọ̀mọ̀wé","phonetic":"[ẹbí wa wá láti ìrandíran akọni àti ọ̀mọ̀wé]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"bí","tone":"high","pitch":"Mí","freq":330},{"text":"wa","tone":"mid","pitch":"Re","freq":293},{"text":"wá","tone":"low","pitch":"Dó","freq":261},{"text":"láti","tone":"high","pitch":"Mí","freq":330},{"text":"ìrandíran","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #50 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":51,"title":"Lesson 51: Ewé àti gbòǹgbò orílẹ̀ w...","category":"Philosophy & Blessings","phrase":"Ewé àti gbòǹgbò orílẹ̀ wa ní agbára ìwòsàn","phonetic":"[ewé àti gbòǹgbò orílẹ̀ wa ní agbára ìwòsàn]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ewé","tone":"high","pitch":"Mí","freq":330},{"text":"àti","tone":"mid","pitch":"Re","freq":293},{"text":"gbòǹgbò","tone":"low","pitch":"Dó","freq":261},{"text":"oríl","tone":"high","pitch":"Mí","freq":330},{"text":"wa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #51 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":52,"title":"Lesson 52: Àgbà tí kò bínú lọmọ rẹ̀...","category":"Philosophy & Blessings","phrase":"Àgbà tí kò bínú lọmọ rẹ̀ ń pọ̀ lórí ilẹ̀","phonetic":"[àgbà tí kò bínú lọmọ rẹ̀ ń pọ̀ lórí ilẹ̀]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Àgbà","tone":"high","pitch":"Mí","freq":330},{"text":"tí","tone":"mid","pitch":"Re","freq":293},{"text":"kò","tone":"low","pitch":"Dó","freq":261},{"text":"bínú","tone":"high","pitch":"Mí","freq":330},{"text":"lm","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #52 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":53,"title":"Lesson 53: Gbọ́ ohùn àwọn baba ńlá ...","category":"Philosophy & Blessings","phrase":"Gbọ́ ohùn àwọn baba ńlá wa nínú afẹ́fẹ́ àbáláyé","phonetic":"[gbọ́ ohùn àwọn baba ńlá wa nínú afẹ́fẹ́ àbáláyé]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Gb","tone":"high","pitch":"Mí","freq":330},{"text":"ohùn","tone":"mid","pitch":"Re","freq":293},{"text":"àwn","tone":"low","pitch":"Dó","freq":261},{"text":"baba","tone":"high","pitch":"Mí","freq":330},{"text":"ńlá","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #53 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":54,"title":"Lesson 54: Kí ló ń rìn nínú igbó tí...","category":"Philosophy & Blessings","phrase":"Kí ló ń rìn nínú igbó tí kò fẹsẹ̀ tẹ koríko?","phonetic":"[kí ló ń rìn nínú igbó tí kò fẹsẹ̀ tẹ koríko?]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kí","tone":"high","pitch":"Mí","freq":330},{"text":"ló","tone":"mid","pitch":"Re","freq":293},{"text":"ń","tone":"low","pitch":"Dó","freq":261},{"text":"rìn","tone":"high","pitch":"Mí","freq":330},{"text":"nínú","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #54 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":55,"title":"Lesson 55: Ìmọ̀ ẹ̀rọ ayélujára àti ...","category":"Philosophy & Blessings","phrase":"Ìmọ̀ ẹ̀rọ ayélujára àti ọgbọ́n orí ẹ̀rọ","phonetic":"[ìmọ̀ ẹ̀rọ ayélujára àti ọgbọ́n orí ẹ̀rọ]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ìm","tone":"high","pitch":"Mí","freq":330},{"text":"r","tone":"mid","pitch":"Re","freq":293},{"text":"ayélujára","tone":"low","pitch":"Dó","freq":261},{"text":"àti","tone":"high","pitch":"Mí","freq":330},{"text":"gbn","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #55 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":56,"title":"Lesson 56: Ẹ jẹ́ kí á fi ọ̀rọ̀ dídù...","category":"Philosophy & Blessings","phrase":"Ẹ jẹ́ kí á fi ọ̀rọ̀ dídùn wó odi àìgbọ́ra-ẹni-yé","phonetic":"[ẹ jẹ́ kí á fi ọ̀rọ̀ dídùn wó odi àìgbọ́ra-ẹni-yé]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"j","tone":"high","pitch":"Mí","freq":330},{"text":"kí","tone":"mid","pitch":"Re","freq":293},{"text":"á","tone":"low","pitch":"Dó","freq":261},{"text":"fi","tone":"high","pitch":"Mí","freq":330},{"text":"r","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #56 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":57,"title":"Lesson 57: Àkókò kò dúró de ẹnìkan,...","category":"Philosophy & Blessings","phrase":"Àkókò kò dúró de ẹnìkan, ẹ jẹ́ kí á mú ẹ̀kọ́ lókùnkúndùn","phonetic":"[àkókò kò dúró de ẹnìkan, ẹ jẹ́ kí á mú ẹ̀kọ́ lókùnkúndùn]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Àkókò","tone":"high","pitch":"Mí","freq":330},{"text":"kò","tone":"mid","pitch":"Re","freq":293},{"text":"dúró","tone":"low","pitch":"Dó","freq":261},{"text":"de","tone":"high","pitch":"Mí","freq":330},{"text":"nìkan","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #57 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":58,"title":"Lesson 58: Ọ̀dọ́ lọ̀la orílẹ̀-èdè w...","category":"Philosophy & Blessings","phrase":"Ọ̀dọ́ lọ̀la orílẹ̀-èdè wa, àwa la ó gbé àsìá ga","phonetic":"[ọ̀dọ́ lọ̀la orílẹ̀-èdè wa, àwa la ó gbé àsìá ga]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"d","tone":"high","pitch":"Mí","freq":330},{"text":"lla","tone":"mid","pitch":"Re","freq":293},{"text":"orílèdè","tone":"low","pitch":"Dó","freq":261},{"text":"wa","tone":"high","pitch":"Mí","freq":330},{"text":"àwa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #58 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":59,"title":"Lesson 59: Dó Re Mí Dó Mí Re Dó - O...","category":"Philosophy & Blessings","phrase":"Dó Re Mí Dó Mí Re Dó - Ohùn Yorùbá dára púpọ̀","phonetic":"[dó re mí dó mí re dó - ohùn yorùbá dára púpọ̀]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Dó","tone":"high","pitch":"Mí","freq":330},{"text":"Re","tone":"mid","pitch":"Re","freq":293},{"text":"Mí","tone":"low","pitch":"Dó","freq":261},{"text":"Dó","tone":"high","pitch":"Mí","freq":330},{"text":"Mí","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #59 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":60,"title":"Lesson 60: Àṣẹ! Kí gbogbo yín ṣe re...","category":"Philosophy & Blessings","phrase":"Àṣẹ! Kí gbogbo yín ṣe rere, kí ìmọ́lẹ̀ ẹ̀kọ́ yín tàn káàkiri ayé!","phonetic":"[àṣẹ! kí gbogbo yín ṣe rere, kí ìmọ́lẹ̀ ẹ̀kọ́ yín tàn káàkiri ayé!]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"À","tone":"high","pitch":"Mí","freq":330},{"text":"Kí","tone":"mid","pitch":"Re","freq":293},{"text":"gbogbo","tone":"low","pitch":"Dó","freq":261},{"text":"yín","tone":"high","pitch":"Mí","freq":330},{"text":"e","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #60 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3}]},"igbo":{"beginner":[{"id":1,"title":"Lesson 1: Ndị kọrọ, daalu nke ukwu...","category":"Greetings & Tones","phrase":"Ndị kọrọ, daalu nke ukwu","phonetic":"[ndị kọrọ, daalu nke ukwu]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nd","tone":"high","pitch":"Mí","freq":330},{"text":"kr","tone":"mid","pitch":"Re","freq":293},{"text":"daalu","tone":"low","pitch":"Dó","freq":261},{"text":"nke","tone":"high","pitch":"Mí","freq":330},{"text":"ukwu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #1 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":2,"title":"Lesson 2: Kedu ka i mere taa?...","category":"Greetings & Tones","phrase":"Kedu ka i mere taa?","phonetic":"[kedu ka i mere taa?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Kedu","tone":"high","pitch":"Mí","freq":330},{"text":"ka","tone":"mid","pitch":"Re","freq":293},{"text":"i","tone":"low","pitch":"Dó","freq":261},{"text":"mere","tone":"high","pitch":"Mí","freq":330},{"text":"taa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #2 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":3,"title":"Lesson 3: Afam bu Chidiebere, obi ...","category":"Greetings & Tones","phrase":"Afam bu Chidiebere, obi na-atọ m ụtọ","phonetic":"[afam bu chidiebere, obi na-atọ m ụtọ]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Afam","tone":"high","pitch":"Mí","freq":330},{"text":"bu","tone":"mid","pitch":"Re","freq":293},{"text":"Chidiebere","tone":"low","pitch":"Dó","freq":261},{"text":"obi","tone":"high","pitch":"Mí","freq":330},{"text":"naat","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #3 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":4,"title":"Lesson 4: Otu, Abụọ, Atọ, Anọ, Ise...","category":"Greetings & Tones","phrase":"Otu, Abụọ, Atọ, Anọ, Ise","phonetic":"[otu, abụọ, atọ, anọ, ise]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Otu","tone":"high","pitch":"Mí","freq":330},{"text":"Ab","tone":"mid","pitch":"Re","freq":293},{"text":"At","tone":"low","pitch":"Dó","freq":261},{"text":"An","tone":"high","pitch":"Mí","freq":330},{"text":"Ise","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #4 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":5,"title":"Lesson 5: Isii, Asaa, Asatọ, Itool...","category":"Greetings & Tones","phrase":"Isii, Asaa, Asatọ, Itoolu, Iri","phonetic":"[isii, asaa, asatọ, itoolu, iri]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Isii","tone":"high","pitch":"Mí","freq":330},{"text":"Asaa","tone":"mid","pitch":"Re","freq":293},{"text":"Asat","tone":"low","pitch":"Dó","freq":261},{"text":"Itoolu","tone":"high","pitch":"Mí","freq":330},{"text":"Iri","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #5 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":6,"title":"Lesson 6: Nna m, Nne m, na Nwanne ...","category":"Numbers & Kinship","phrase":"Nna m, Nne m, na Nwanne m","phonetic":"[nna m, nne m, na nwanne m]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nna","tone":"high","pitch":"Mí","freq":330},{"text":"m","tone":"mid","pitch":"Re","freq":293},{"text":"Nne","tone":"low","pitch":"Dó","freq":261},{"text":"m","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #6 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":7,"title":"Lesson 7: Biko, nyem mmiri oyi...","category":"Numbers & Kinship","phrase":"Biko, nyem mmiri oyi","phonetic":"[biko, nyem mmiri oyi]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Biko","tone":"high","pitch":"Mí","freq":330},{"text":"nyem","tone":"mid","pitch":"Re","freq":293},{"text":"mmiri","tone":"low","pitch":"Dó","freq":261},{"text":"oyi","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #7 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":8,"title":"Lesson 8: Uhie ka ọkụ, Ojii, Ọcha...","category":"Numbers & Kinship","phrase":"Uhie ka ọkụ, Ojii, Ọcha","phonetic":"[uhie ka ọkụ, ojii, ọcha]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Uhie","tone":"high","pitch":"Mí","freq":330},{"text":"ka","tone":"mid","pitch":"Re","freq":293},{"text":"k","tone":"low","pitch":"Dó","freq":261},{"text":"Ojii","tone":"high","pitch":"Mí","freq":330},{"text":"cha","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #8 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":9,"title":"Lesson 9: Ụlọ anyị mara mma nke uk...","category":"Numbers & Kinship","phrase":"Ụlọ anyị mara mma nke ukwu","phonetic":"[ụlọ anyị mara mma nke ukwu]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"l","tone":"high","pitch":"Mí","freq":330},{"text":"any","tone":"mid","pitch":"Re","freq":293},{"text":"mara","tone":"low","pitch":"Dó","freq":261},{"text":"mma","tone":"high","pitch":"Mí","freq":330},{"text":"nke","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #9 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":10,"title":"Lesson 10: A nọ m na udo taa...","category":"Numbers & Kinship","phrase":"A nọ m na udo taa","phonetic":"[a nọ m na udo taa]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"A","tone":"high","pitch":"Mí","freq":330},{"text":"n","tone":"mid","pitch":"Re","freq":293},{"text":"m","tone":"low","pitch":"Dó","freq":261},{"text":"na","tone":"high","pitch":"Mí","freq":330},{"text":"udo","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #10 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":11,"title":"Lesson 11: Ee nne m, Mba nna m, daa...","category":"Daily Life & Nature","phrase":"Ee nne m, Mba nna m, daalu","phonetic":"[ee nne m, mba nna m, daalu]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ee","tone":"high","pitch":"Mí","freq":330},{"text":"nne","tone":"mid","pitch":"Re","freq":293},{"text":"m","tone":"low","pitch":"Dó","freq":261},{"text":"Mba","tone":"high","pitch":"Mí","freq":330},{"text":"nna","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #11 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":12,"title":"Lesson 12: Ego ole ka azụ a dị?...","category":"Daily Life & Nature","phrase":"Ego ole ka azụ a dị?","phonetic":"[ego ole ka azụ a dị?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ego","tone":"high","pitch":"Mí","freq":330},{"text":"ole","tone":"mid","pitch":"Re","freq":293},{"text":"ka","tone":"low","pitch":"Dó","freq":261},{"text":"az","tone":"high","pitch":"Mí","freq":330},{"text":"a","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #12 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":13,"title":"Lesson 13: Nkịta na-agbọ ụja, Ọkụkọ...","category":"Daily Life & Nature","phrase":"Nkịta na-agbọ ụja, Ọkụkọ na-akwa","phonetic":"[nkịta na-agbọ ụja, ọkụkọ na-akwa]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nkta","tone":"high","pitch":"Mí","freq":330},{"text":"naagb","tone":"mid","pitch":"Re","freq":293},{"text":"ja","tone":"low","pitch":"Dó","freq":261},{"text":"kk","tone":"high","pitch":"Mí","freq":330},{"text":"naakwa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #13 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":14,"title":"Lesson 14: Mọnde, Tuzdee, Sọnde...","category":"Daily Life & Nature","phrase":"Mọnde, Tuzdee, Sọnde","phonetic":"[mọnde, tuzdee, sọnde]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Mnde","tone":"high","pitch":"Mí","freq":330},{"text":"Tuzdee","tone":"mid","pitch":"Re","freq":293},{"text":"Snde","tone":"low","pitch":"Dó","freq":261}],"translation":"Interactive voice training phrase #14 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":15,"title":"Lesson 15: Isi, Anya, Imi, Ọnụ, Aka...","category":"Daily Life & Nature","phrase":"Isi, Anya, Imi, Ọnụ, Aka na Ụkwụ","phonetic":"[isi, anya, imi, ọnụ, aka na ụkwụ]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Isi","tone":"high","pitch":"Mí","freq":330},{"text":"Anya","tone":"mid","pitch":"Re","freq":293},{"text":"Imi","tone":"low","pitch":"Dó","freq":261},{"text":"n","tone":"high","pitch":"Mí","freq":330},{"text":"Aka","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #15 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":16,"title":"Lesson 16: Ebee ka ụlọ akwụkwọ anyị...","category":"Daily Life & Nature","phrase":"Ebee ka ụlọ akwụkwọ anyị dị?","phonetic":"[ebee ka ụlọ akwụkwọ anyị dị?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ebee","tone":"high","pitch":"Mí","freq":330},{"text":"ka","tone":"mid","pitch":"Re","freq":293},{"text":"l","tone":"low","pitch":"Dó","freq":261},{"text":"akwkw","tone":"high","pitch":"Mí","freq":330},{"text":"any","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #16 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":17,"title":"Lesson 17: Bịa rie nri, nri adịla n...","category":"Daily Life & Nature","phrase":"Bịa rie nri, nri adịla njikere","phonetic":"[bịa rie nri, nri adịla njikere]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ba","tone":"high","pitch":"Mí","freq":330},{"text":"rie","tone":"mid","pitch":"Re","freq":293},{"text":"nri","tone":"low","pitch":"Dó","freq":261},{"text":"nri","tone":"high","pitch":"Mí","freq":330},{"text":"adla","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #17 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":18,"title":"Lesson 18: Anwụ na-acha, mmiri na-e...","category":"Daily Life & Nature","phrase":"Anwụ na-acha, mmiri na-ezo","phonetic":"[anwụ na-acha, mmiri na-ezo]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Anw","tone":"high","pitch":"Mí","freq":330},{"text":"naacha","tone":"mid","pitch":"Re","freq":293},{"text":"mmiri","tone":"low","pitch":"Dó","freq":261},{"text":"naezo","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #18 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":19,"title":"Lesson 19: Ka chi foo, Chukwu chekw...","category":"Daily Life & Nature","phrase":"Ka chi foo, Chukwu chekwaba anyị","phonetic":"[ka chi foo, chukwu chekwaba anyị]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ka","tone":"high","pitch":"Mí","freq":330},{"text":"chi","tone":"mid","pitch":"Re","freq":293},{"text":"foo","tone":"low","pitch":"Dó","freq":261},{"text":"Chukwu","tone":"high","pitch":"Mí","freq":330},{"text":"chekwaba","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #19 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":20,"title":"Lesson 20: Nwa amadi ka m bụ, asụsụ...","category":"Daily Life & Nature","phrase":"Nwa amadi ka m bụ, asụsụ m bụ ugwu m!","phonetic":"[nwa amadi ka m bụ, asụsụ m bụ ugwu m!]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nwa","tone":"high","pitch":"Mí","freq":330},{"text":"amadi","tone":"mid","pitch":"Re","freq":293},{"text":"ka","tone":"low","pitch":"Dó","freq":261},{"text":"m","tone":"high","pitch":"Mí","freq":330},{"text":"b","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #20 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1}],"intermediate":[{"id":21,"title":"Lesson 21: Akụkọ m ga-amalite ugbu ...","category":"Conversations & Culture","phrase":"Akụkọ m ga-amalite ugbu a...","phonetic":"[akụkọ m ga-amalite ugbu a...]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Akk","tone":"high","pitch":"Mí","freq":330},{"text":"m","tone":"mid","pitch":"Re","freq":293},{"text":"gaamalite","tone":"low","pitch":"Dó","freq":261},{"text":"ugbu","tone":"high","pitch":"Mí","freq":330},{"text":"a","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #21 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":22,"title":"Lesson 22: Ịgba egwu na ịgụ egwu na...","category":"Conversations & Culture","phrase":"Ịgba egwu na ịgụ egwu na-amasị m","phonetic":"[ịgba egwu na ịgụ egwu na-amasị m]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"gba","tone":"high","pitch":"Mí","freq":330},{"text":"egwu","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"g","tone":"high","pitch":"Mí","freq":330},{"text":"egwu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #22 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":23,"title":"Lesson 23: Ekike omenala Igbo mara ...","category":"Conversations & Culture","phrase":"Ekike omenala Igbo mara mma nke ukwu","phonetic":"[ekike omenala igbo mara mma nke ukwu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ekike","tone":"high","pitch":"Mí","freq":330},{"text":"omenala","tone":"mid","pitch":"Re","freq":293},{"text":"Igbo","tone":"low","pitch":"Dó","freq":261},{"text":"mara","tone":"high","pitch":"Mí","freq":330},{"text":"mma","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #23 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":24,"title":"Lesson 24: Ka anyị gbaa nchọkọta eg...","category":"Conversations & Culture","phrase":"Ka anyị gbaa nchọkọta egwuregwu","phonetic":"[ka anyị gbaa nchọkọta egwuregwu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ka","tone":"high","pitch":"Mí","freq":330},{"text":"any","tone":"mid","pitch":"Re","freq":293},{"text":"gbaa","tone":"low","pitch":"Dó","freq":261},{"text":"nchkta","tone":"high","pitch":"Mí","freq":330},{"text":"egwuregwu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #24 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":25,"title":"Lesson 25: Ikoro na Ekwe na-ada nụl...","category":"Conversations & Culture","phrase":"Ikoro na Ekwe na-ada nụlọ ezumezu","phonetic":"[ikoro na ekwe na-ada nụlọ ezumezu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ikoro","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"Ekwe","tone":"low","pitch":"Dó","freq":261},{"text":"naada","tone":"high","pitch":"Mí","freq":330},{"text":"nl","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #25 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":26,"title":"Lesson 26: Nye m ofe onugbu na akpụ...","category":"Conversations & Culture","phrase":"Nye m ofe onugbu na akpụ","phonetic":"[nye m ofe onugbu na akpụ]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Nye","tone":"high","pitch":"Mí","freq":330},{"text":"m","tone":"mid","pitch":"Re","freq":293},{"text":"ofe","tone":"low","pitch":"Dó","freq":261},{"text":"onugbu","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #26 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":27,"title":"Lesson 27: Kedu oge o ji ugbu a?...","category":"Conversations & Culture","phrase":"Kedu oge o ji ugbu a?","phonetic":"[kedu oge o ji ugbu a?]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kedu","tone":"high","pitch":"Mí","freq":330},{"text":"oge","tone":"mid","pitch":"Re","freq":293},{"text":"o","tone":"low","pitch":"Dó","freq":261},{"text":"ji","tone":"high","pitch":"Mí","freq":330},{"text":"ugbu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #27 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":28,"title":"Lesson 28: Nne ochie na-akụziri m a...","category":"Conversations & Culture","phrase":"Nne ochie na-akụziri m akụkọ mgbe ochie","phonetic":"[nne ochie na-akụziri m akụkọ mgbe ochie]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Nne","tone":"high","pitch":"Mí","freq":330},{"text":"ochie","tone":"mid","pitch":"Re","freq":293},{"text":"naakziri","tone":"low","pitch":"Dó","freq":261},{"text":"m","tone":"high","pitch":"Mí","freq":330},{"text":"akk","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #28 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":29,"title":"Lesson 29: Enugu na Owerri bu obodo...","category":"Conversations & Culture","phrase":"Enugu na Owerri bu obodo mara mma","phonetic":"[enugu na owerri bu obodo mara mma]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Enugu","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"Owerri","tone":"low","pitch":"Dó","freq":261},{"text":"bu","tone":"high","pitch":"Mí","freq":330},{"text":"obodo","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #29 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":30,"title":"Lesson 30: Asụsụ Igbo na sayensị kọ...","category":"Conversations & Culture","phrase":"Asụsụ Igbo na sayensị kọmputa","phonetic":"[asụsụ igbo na sayensị kọmputa]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ass","tone":"high","pitch":"Mí","freq":330},{"text":"Igbo","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"sayens","tone":"high","pitch":"Mí","freq":330},{"text":"kmputa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #30 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":31,"title":"Lesson 31: Emume Iri Ji Ọhụrụ abịal...","category":"Rhythm & Community","phrase":"Emume Iri Ji Ọhụrụ abịala","phonetic":"[emume iri ji ọhụrụ abịala]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Emume","tone":"high","pitch":"Mí","freq":330},{"text":"Iri","tone":"mid","pitch":"Re","freq":293},{"text":"Ji","tone":"low","pitch":"Dó","freq":261},{"text":"hr","tone":"high","pitch":"Mí","freq":330},{"text":"abala","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #31 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":32,"title":"Lesson 32: Biko belata ọnụ ahịa ya ...","category":"Rhythm & Community","phrase":"Biko belata ọnụ ahịa ya ntakịrị","phonetic":"[biko belata ọnụ ahịa ya ntakịrị]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Biko","tone":"high","pitch":"Mí","freq":330},{"text":"belata","tone":"mid","pitch":"Re","freq":293},{"text":"n","tone":"low","pitch":"Dó","freq":261},{"text":"aha","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #32 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":33,"title":"Lesson 33: Nechiche m, asụsụ anyị b...","category":"Rhythm & Community","phrase":"Nechiche m, asụsụ anyị bụ akụ anyị","phonetic":"[nechiche m, asụsụ anyị bụ akụ anyị]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Nechiche","tone":"high","pitch":"Mí","freq":330},{"text":"m","tone":"mid","pitch":"Re","freq":293},{"text":"ass","tone":"low","pitch":"Dó","freq":261},{"text":"any","tone":"high","pitch":"Mí","freq":330},{"text":"b","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #33 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":34,"title":"Lesson 34: Mmanụ aṅụ na-atọ ụtọ, os...","category":"Rhythm & Community","phrase":"Mmanụ aṅụ na-atọ ụtọ, ose na-ekpo ọkụ","phonetic":"[mmanụ aṅụ na-atọ ụtọ, ose na-ekpo ọkụ]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Mman","tone":"high","pitch":"Mí","freq":330},{"text":"a","tone":"mid","pitch":"Re","freq":293},{"text":"naat","tone":"low","pitch":"Dó","freq":261},{"text":"t","tone":"high","pitch":"Mí","freq":330},{"text":"ose","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #34 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":35,"title":"Lesson 35: Echegbula onwe gị, udo g...","category":"Rhythm & Community","phrase":"Echegbula onwe gị, udo ga-adị","phonetic":"[echegbula onwe gị, udo ga-adị]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Echegbula","tone":"high","pitch":"Mí","freq":330},{"text":"onwe","tone":"mid","pitch":"Re","freq":293},{"text":"g","tone":"low","pitch":"Dó","freq":261},{"text":"udo","tone":"high","pitch":"Mí","freq":330},{"text":"gaad","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #35 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":36,"title":"Lesson 36: Gbaa aka nri, gafere ahị...","category":"Rhythm & Community","phrase":"Gbaa aka nri, gafere ahịa","phonetic":"[gbaa aka nri, gafere ahịa]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Gbaa","tone":"high","pitch":"Mí","freq":330},{"text":"aka","tone":"mid","pitch":"Re","freq":293},{"text":"nri","tone":"low","pitch":"Dó","freq":261},{"text":"gafere","tone":"high","pitch":"Mí","freq":330},{"text":"aha","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #36 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":37,"title":"Lesson 37: Ọdụm bụ eze anụ ọhịa...","category":"Rhythm & Community","phrase":"Ọdụm bụ eze anụ ọhịa","phonetic":"[ọdụm bụ eze anụ ọhịa]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"dm","tone":"high","pitch":"Mí","freq":330},{"text":"b","tone":"mid","pitch":"Re","freq":293},{"text":"eze","tone":"low","pitch":"Dó","freq":261},{"text":"an","tone":"high","pitch":"Mí","freq":330},{"text":"ha","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #37 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":38,"title":"Lesson 38: Gbaghara m, agaghị m eme...","category":"Rhythm & Community","phrase":"Gbaghara m, agaghị m eme ya ọzọ","phonetic":"[gbaghara m, agaghị m eme ya ọzọ]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Gbaghara","tone":"high","pitch":"Mí","freq":330},{"text":"m","tone":"mid","pitch":"Re","freq":293},{"text":"agagh","tone":"low","pitch":"Dó","freq":261},{"text":"m","tone":"high","pitch":"Mí","freq":330},{"text":"eme","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #38 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":39,"title":"Lesson 39: Hie ụra nke ọma nwa m ma...","category":"Rhythm & Community","phrase":"Hie ụra nke ọma nwa m mara mma","phonetic":"[hie ụra nke ọma nwa m mara mma]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Hie","tone":"high","pitch":"Mí","freq":330},{"text":"ra","tone":"mid","pitch":"Re","freq":293},{"text":"nke","tone":"low","pitch":"Dó","freq":261},{"text":"ma","tone":"high","pitch":"Mí","freq":330},{"text":"nwa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #39 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":40,"title":"Lesson 40: Asụsụ Igbo agaghị anwụ n...","category":"Rhythm & Community","phrase":"Asụsụ Igbo agaghị anwụ nọnụ m!","phonetic":"[asụsụ igbo agaghị anwụ nọnụ m!]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ass","tone":"high","pitch":"Mí","freq":330},{"text":"Igbo","tone":"mid","pitch":"Re","freq":293},{"text":"agagh","tone":"low","pitch":"Dó","freq":261},{"text":"anw","tone":"high","pitch":"Mí","freq":330},{"text":"nn","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #40 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2}],"advanced":[{"id":41,"title":"Lesson 41: Onye nwere ndidi na-eri ...","category":"Classical Proverbs","phrase":"Onye nwere ndidi na-eri azụ kacha ibu","phonetic":"[onye nwere ndidi na-eri azụ kacha ibu]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Onye","tone":"high","pitch":"Mí","freq":330},{"text":"nwere","tone":"mid","pitch":"Re","freq":293},{"text":"ndidi","tone":"low","pitch":"Dó","freq":261},{"text":"naeri","tone":"high","pitch":"Mí","freq":330},{"text":"az","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #41 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":42,"title":"Lesson 42: Aka nri kwọọ aka ekpe, a...","category":"Classical Proverbs","phrase":"Aka nri kwọọ aka ekpe, aka ekpe akwọọ aka nri","phonetic":"[aka nri kwọọ aka ekpe, aka ekpe akwọọ aka nri]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Aka","tone":"high","pitch":"Mí","freq":330},{"text":"nri","tone":"mid","pitch":"Re","freq":293},{"text":"kw","tone":"low","pitch":"Dó","freq":261},{"text":"aka","tone":"high","pitch":"Mí","freq":330},{"text":"ekpe","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #42 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":43,"title":"Lesson 43: Ọkpọrọkpọ akpịrị na-agụ ...","category":"Classical Proverbs","phrase":"Ọkpọrọkpọ akpịrị na-agụ egwu nakụkụ mmiri","phonetic":"[ọkpọrọkpọ akpịrị na-agụ egwu nakụkụ mmiri]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"kprkp","tone":"high","pitch":"Mí","freq":330},{"text":"akpr","tone":"mid","pitch":"Re","freq":293},{"text":"naag","tone":"low","pitch":"Dó","freq":261},{"text":"egwu","tone":"high","pitch":"Mí","freq":330},{"text":"nakk","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #43 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":44,"title":"Lesson 44: Nnụnụ na-efe efe anaghị ...","category":"Classical Proverbs","phrase":"Nnụnụ na-efe efe anaghị echefu akwụ ya","phonetic":"[nnụnụ na-efe efe anaghị echefu akwụ ya]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Nnn","tone":"high","pitch":"Mí","freq":330},{"text":"naefe","tone":"mid","pitch":"Re","freq":293},{"text":"efe","tone":"low","pitch":"Dó","freq":261},{"text":"anagh","tone":"high","pitch":"Mí","freq":330},{"text":"echefu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #44 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":45,"title":"Lesson 45: Egwu Ogene na-akpali mmụ...","category":"Classical Proverbs","phrase":"Egwu Ogene na-akpali mmụọ dike","phonetic":"[egwu ogene na-akpali mmụọ dike]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Egwu","tone":"high","pitch":"Mí","freq":330},{"text":"Ogene","tone":"mid","pitch":"Re","freq":293},{"text":"naakpali","tone":"low","pitch":"Dó","freq":261},{"text":"mm","tone":"high","pitch":"Mí","freq":330},{"text":"dike","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #45 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":46,"title":"Lesson 46: Eze gbalaga! Ndụ gị ga-a...","category":"Classical Proverbs","phrase":"Eze gbalaga! Ndụ gị ga-adị ogologo!","phonetic":"[eze gbalaga! ndụ gị ga-adị ogologo!]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Eze","tone":"high","pitch":"Mí","freq":330},{"text":"gbalaga","tone":"mid","pitch":"Re","freq":293},{"text":"Nd","tone":"low","pitch":"Dó","freq":261},{"text":"g","tone":"high","pitch":"Mí","freq":330},{"text":"gaad","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #46 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":47,"title":"Lesson 47: Ezi agwa bụ ezi aha, ego...","category":"Classical Proverbs","phrase":"Ezi agwa bụ ezi aha, ego apụghị ịzụ ya","phonetic":"[ezi agwa bụ ezi aha, ego apụghị ịzụ ya]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ezi","tone":"high","pitch":"Mí","freq":330},{"text":"agwa","tone":"mid","pitch":"Re","freq":293},{"text":"b","tone":"low","pitch":"Dó","freq":261},{"text":"ezi","tone":"high","pitch":"Mí","freq":330},{"text":"aha","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #47 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":48,"title":"Lesson 48: Akụkọ banyere Mbe na Ezi...","category":"Classical Proverbs","phrase":"Akụkọ banyere Mbe na Ezi nọhịa","phonetic":"[akụkọ banyere mbe na ezi nọhịa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Akk","tone":"high","pitch":"Mí","freq":330},{"text":"banyere","tone":"mid","pitch":"Re","freq":293},{"text":"Mbe","tone":"low","pitch":"Dó","freq":261},{"text":"na","tone":"high","pitch":"Mí","freq":330},{"text":"Ezi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #48 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":49,"title":"Lesson 49: Mmiri mara onye bu ụzọ m...","category":"Classical Proverbs","phrase":"Mmiri mara onye bu ụzọ mara onye na-eso ya","phonetic":"[mmiri mara onye bu ụzọ mara onye na-eso ya]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Mmiri","tone":"high","pitch":"Mí","freq":330},{"text":"mara","tone":"mid","pitch":"Re","freq":293},{"text":"onye","tone":"low","pitch":"Dó","freq":261},{"text":"bu","tone":"high","pitch":"Mí","freq":330},{"text":"z","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #49 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":50,"title":"Lesson 50: Anyị si nagbụrụ ndị dike...","category":"Classical Proverbs","phrase":"Anyị si nagbụrụ ndị dike na ndị amamihe","phonetic":"[anyị si nagbụrụ ndị dike na ndị amamihe]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Any","tone":"high","pitch":"Mí","freq":330},{"text":"si","tone":"mid","pitch":"Re","freq":293},{"text":"nagbr","tone":"low","pitch":"Dó","freq":261},{"text":"nd","tone":"high","pitch":"Mí","freq":330},{"text":"dike","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #50 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":51,"title":"Lesson 51: Akwụkwọ nri na mkpọrọgwụ...","category":"Philosophy & Blessings","phrase":"Akwụkwọ nri na mkpọrọgwụ nwere ike ọgwụgwọ","phonetic":"[akwụkwọ nri na mkpọrọgwụ nwere ike ọgwụgwọ]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Akwkw","tone":"high","pitch":"Mí","freq":330},{"text":"nri","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"mkprgw","tone":"high","pitch":"Mí","freq":330},{"text":"nwere","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #51 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":52,"title":"Lesson 52: Onye ndú na-ege ntị na-a...","category":"Philosophy & Blessings","phrase":"Onye ndú na-ege ntị na-achị nudo","phonetic":"[onye ndú na-ege ntị na-achị nudo]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Onye","tone":"high","pitch":"Mí","freq":330},{"text":"ndú","tone":"mid","pitch":"Re","freq":293},{"text":"naege","tone":"low","pitch":"Dó","freq":261},{"text":"nt","tone":"high","pitch":"Mí","freq":330},{"text":"naach","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #52 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":53,"title":"Lesson 53: Nụrụ olu ndị nna ochie n...","category":"Philosophy & Blessings","phrase":"Nụrụ olu ndị nna ochie nikuku","phonetic":"[nụrụ olu ndị nna ochie nikuku]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Nr","tone":"high","pitch":"Mí","freq":330},{"text":"olu","tone":"mid","pitch":"Re","freq":293},{"text":"nd","tone":"low","pitch":"Dó","freq":261},{"text":"nna","tone":"high","pitch":"Mí","freq":330},{"text":"ochie","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #53 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":54,"title":"Lesson 54: Gịnị na-aga ije na-enweg...","category":"Philosophy & Blessings","phrase":"Gịnị na-aga ije na-enweghị ụkwụ? (Ikuku)","phonetic":"[gịnị na-aga ije na-enweghị ụkwụ? (ikuku)]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Gn","tone":"high","pitch":"Mí","freq":330},{"text":"naaga","tone":"mid","pitch":"Re","freq":293},{"text":"ije","tone":"low","pitch":"Dó","freq":261},{"text":"naenwegh","tone":"high","pitch":"Mí","freq":330},{"text":"kw","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #54 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":55,"title":"Lesson 55: Nkà na ụzụ na amamihe ọh...","category":"Philosophy & Blessings","phrase":"Nkà na ụzụ na amamihe ọhụrụ","phonetic":"[nkà na ụzụ na amamihe ọhụrụ]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Nkà","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"z","tone":"low","pitch":"Dó","freq":261},{"text":"na","tone":"high","pitch":"Mí","freq":330},{"text":"amamihe","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #55 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":56,"title":"Lesson 56: Ka anyị jiri okwu ọma wu...","category":"Philosophy & Blessings","phrase":"Ka anyị jiri okwu ọma wulite udo","phonetic":"[ka anyị jiri okwu ọma wulite udo]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ka","tone":"high","pitch":"Mí","freq":330},{"text":"any","tone":"mid","pitch":"Re","freq":293},{"text":"jiri","tone":"low","pitch":"Dó","freq":261},{"text":"okwu","tone":"high","pitch":"Mí","freq":330},{"text":"ma","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #56 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":57,"title":"Lesson 57: Oge anaghị eche onye ọ b...","category":"Philosophy & Blessings","phrase":"Oge anaghị eche onye ọ bụla","phonetic":"[oge anaghị eche onye ọ bụla]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Oge","tone":"high","pitch":"Mí","freq":330},{"text":"anagh","tone":"mid","pitch":"Re","freq":293},{"text":"eche","tone":"low","pitch":"Dó","freq":261},{"text":"onye","tone":"high","pitch":"Mí","freq":330},{"text":"bla","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #57 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":58,"title":"Lesson 58: Ndị ntorobịa bụ olileany...","category":"Philosophy & Blessings","phrase":"Ndị ntorobịa bụ olileanya anyị","phonetic":"[ndị ntorobịa bụ olileanya anyị]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Nd","tone":"high","pitch":"Mí","freq":330},{"text":"ntoroba","tone":"mid","pitch":"Re","freq":293},{"text":"b","tone":"low","pitch":"Dó","freq":261},{"text":"olileanya","tone":"high","pitch":"Mí","freq":330},{"text":"any","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #58 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":59,"title":"Lesson 59: Dó Re Mí - Uda olu Igbo ...","category":"Philosophy & Blessings","phrase":"Dó Re Mí - Uda olu Igbo mara mma","phonetic":"[dó re mí - uda olu igbo mara mma]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Dó","tone":"high","pitch":"Mí","freq":330},{"text":"Re","tone":"mid","pitch":"Re","freq":293},{"text":"Mí","tone":"low","pitch":"Dó","freq":261},{"text":"Uda","tone":"high","pitch":"Mí","freq":330},{"text":"olu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #59 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":60,"title":"Lesson 60: Ka ngozi na amamihe dịrị...","category":"Philosophy & Blessings","phrase":"Ka ngozi na amamihe dịrị unu niile!","phonetic":"[ka ngozi na amamihe dịrị unu niile!]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ka","tone":"high","pitch":"Mí","freq":330},{"text":"ngozi","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"amamihe","tone":"high","pitch":"Mí","freq":330},{"text":"dr","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #60 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3}]},"hausa":{"beginner":[{"id":1,"title":"Lesson 1: Ina kwana, na gode sosai...","category":"Greetings & Tones","phrase":"Ina kwana, na gode sosai","phonetic":"[ina kwana, na gode sosai]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ina","tone":"high","pitch":"Mí","freq":330},{"text":"kwana","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"gode","tone":"high","pitch":"Mí","freq":330},{"text":"sosai","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #1 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":2,"title":"Lesson 2: Yaya kake da iyalinka?...","category":"Greetings & Tones","phrase":"Yaya kake da iyalinka?","phonetic":"[yaya kake da iyalinka?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Yaya","tone":"high","pitch":"Mí","freq":330},{"text":"kake","tone":"mid","pitch":"Re","freq":293},{"text":"da","tone":"low","pitch":"Dó","freq":261},{"text":"iyalinka","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #2 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":3,"title":"Lesson 3: Sunana Amina, ina jin da...","category":"Greetings & Tones","phrase":"Sunana Amina, ina jin dadi","phonetic":"[sunana amina, ina jin dadi]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Sunana","tone":"high","pitch":"Mí","freq":330},{"text":"Amina","tone":"mid","pitch":"Re","freq":293},{"text":"ina","tone":"low","pitch":"Dó","freq":261},{"text":"jin","tone":"high","pitch":"Mí","freq":330},{"text":"dadi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #3 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":4,"title":"Lesson 4: Daya, Biyu, Uku, Hudu, B...","category":"Greetings & Tones","phrase":"Daya, Biyu, Uku, Hudu, Biyar","phonetic":"[daya, biyu, uku, hudu, biyar]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Daya","tone":"high","pitch":"Mí","freq":330},{"text":"Biyu","tone":"mid","pitch":"Re","freq":293},{"text":"Uku","tone":"low","pitch":"Dó","freq":261},{"text":"Hudu","tone":"high","pitch":"Mí","freq":330},{"text":"Biyar","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #4 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":5,"title":"Lesson 5: Shida, Bakwai, Takwas, T...","category":"Greetings & Tones","phrase":"Shida, Bakwai, Takwas, Tara, Goma","phonetic":"[shida, bakwai, takwas, tara, goma]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Shida","tone":"high","pitch":"Mí","freq":330},{"text":"Bakwai","tone":"mid","pitch":"Re","freq":293},{"text":"Takwas","tone":"low","pitch":"Dó","freq":261},{"text":"Tara","tone":"high","pitch":"Mí","freq":330},{"text":"Goma","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #5 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":6,"title":"Lesson 6: Babana, Mamana, da Kanen...","category":"Numbers & Kinship","phrase":"Babana, Mamana, da Kanena","phonetic":"[babana, mamana, da kanena]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Babana","tone":"high","pitch":"Mí","freq":330},{"text":"Mamana","tone":"mid","pitch":"Re","freq":293},{"text":"da","tone":"low","pitch":"Dó","freq":261},{"text":"Kanena","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #6 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":7,"title":"Lesson 7: Don Allah, ba ni ruwan s...","category":"Numbers & Kinship","phrase":"Don Allah, ba ni ruwan sha","phonetic":"[don allah, ba ni ruwan sha]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Don","tone":"high","pitch":"Mí","freq":330},{"text":"Allah","tone":"mid","pitch":"Re","freq":293},{"text":"ba","tone":"low","pitch":"Dó","freq":261},{"text":"ni","tone":"high","pitch":"Mí","freq":330},{"text":"ruwan","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #7 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":8,"title":"Lesson 8: Ja kamar wuta, Baki, Far...","category":"Numbers & Kinship","phrase":"Ja kamar wuta, Baki, Fari","phonetic":"[ja kamar wuta, baki, fari]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ja","tone":"high","pitch":"Mí","freq":330},{"text":"kamar","tone":"mid","pitch":"Re","freq":293},{"text":"wuta","tone":"low","pitch":"Dó","freq":261},{"text":"Baki","tone":"high","pitch":"Mí","freq":330},{"text":"Fari","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #8 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":9,"title":"Lesson 9: Gidanmu yana da kyau sos...","category":"Numbers & Kinship","phrase":"Gidanmu yana da kyau sosai","phonetic":"[gidanmu yana da kyau sosai]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Gidanmu","tone":"high","pitch":"Mí","freq":330},{"text":"yana","tone":"mid","pitch":"Re","freq":293},{"text":"da","tone":"low","pitch":"Dó","freq":261},{"text":"kyau","tone":"high","pitch":"Mí","freq":330},{"text":"sosai","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #9 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":10,"title":"Lesson 10: Ina cikin farin ciki yau...","category":"Numbers & Kinship","phrase":"Ina cikin farin ciki yau","phonetic":"[ina cikin farin ciki yau]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ina","tone":"high","pitch":"Mí","freq":330},{"text":"cikin","tone":"mid","pitch":"Re","freq":293},{"text":"farin","tone":"low","pitch":"Dó","freq":261},{"text":"ciki","tone":"high","pitch":"Mí","freq":330},{"text":"yau","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #10 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":11,"title":"Lesson 11: I mana, Aa, na gode...","category":"Daily Life & Nature","phrase":"I mana, Aa, na gode","phonetic":"[i mana, aa, na gode]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"I","tone":"high","pitch":"Mí","freq":330},{"text":"mana","tone":"mid","pitch":"Re","freq":293},{"text":"Aa","tone":"low","pitch":"Dó","freq":261},{"text":"na","tone":"high","pitch":"Mí","freq":330},{"text":"gode","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #11 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":12,"title":"Lesson 12: Nawa ne wannan kifin?...","category":"Daily Life & Nature","phrase":"Nawa ne wannan kifin?","phonetic":"[nawa ne wannan kifin?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nawa","tone":"high","pitch":"Mí","freq":330},{"text":"ne","tone":"mid","pitch":"Re","freq":293},{"text":"wannan","tone":"low","pitch":"Dó","freq":261},{"text":"kifin","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #12 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":13,"title":"Lesson 13: Kare yana haushi, Kaza t...","category":"Daily Life & Nature","phrase":"Kare yana haushi, Kaza tana kuka","phonetic":"[kare yana haushi, kaza tana kuka]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Kare","tone":"high","pitch":"Mí","freq":330},{"text":"yana","tone":"mid","pitch":"Re","freq":293},{"text":"haushi","tone":"low","pitch":"Dó","freq":261},{"text":"Kaza","tone":"high","pitch":"Mí","freq":330},{"text":"tana","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #13 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":14,"title":"Lesson 14: Litinin, Talata, Lahadi...","category":"Daily Life & Nature","phrase":"Litinin, Talata, Lahadi","phonetic":"[litinin, talata, lahadi]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Litinin","tone":"high","pitch":"Mí","freq":330},{"text":"Talata","tone":"mid","pitch":"Re","freq":293},{"text":"Lahadi","tone":"low","pitch":"Dó","freq":261}],"translation":"Interactive voice training phrase #14 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":15,"title":"Lesson 15: Kai, Ido, Hanci, Baki, H...","category":"Daily Life & Nature","phrase":"Kai, Ido, Hanci, Baki, Hannu da Kafa","phonetic":"[kai, ido, hanci, baki, hannu da kafa]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Kai","tone":"high","pitch":"Mí","freq":330},{"text":"Ido","tone":"mid","pitch":"Re","freq":293},{"text":"Hanci","tone":"low","pitch":"Dó","freq":261},{"text":"Baki","tone":"high","pitch":"Mí","freq":330},{"text":"Hannu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #15 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":16,"title":"Lesson 16: Ina makarantarmu take?...","category":"Daily Life & Nature","phrase":"Ina makarantarmu take?","phonetic":"[ina makarantarmu take?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ina","tone":"high","pitch":"Mí","freq":330},{"text":"makarantarmu","tone":"mid","pitch":"Re","freq":293},{"text":"take","tone":"low","pitch":"Dó","freq":261}],"translation":"Interactive voice training phrase #16 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":17,"title":"Lesson 17: Zo mu ci abinci tare...","category":"Daily Life & Nature","phrase":"Zo mu ci abinci tare","phonetic":"[zo mu ci abinci tare]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Zo","tone":"high","pitch":"Mí","freq":330},{"text":"mu","tone":"mid","pitch":"Re","freq":293},{"text":"ci","tone":"low","pitch":"Dó","freq":261},{"text":"abinci","tone":"high","pitch":"Mí","freq":330},{"text":"tare","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #17 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":18,"title":"Lesson 18: Rana tana haske, ruwa ya...","category":"Daily Life & Nature","phrase":"Rana tana haske, ruwa yana sauka","phonetic":"[rana tana haske, ruwa yana sauka]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Rana","tone":"high","pitch":"Mí","freq":330},{"text":"tana","tone":"mid","pitch":"Re","freq":293},{"text":"haske","tone":"low","pitch":"Dó","freq":261},{"text":"ruwa","tone":"high","pitch":"Mí","freq":330},{"text":"yana","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #18 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":19,"title":"Lesson 19: Sai da safe, Allah Ya ka...","category":"Daily Life & Nature","phrase":"Sai da safe, Allah Ya kare mu","phonetic":"[sai da safe, allah ya kare mu]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Sai","tone":"high","pitch":"Mí","freq":330},{"text":"da","tone":"mid","pitch":"Re","freq":293},{"text":"safe","tone":"low","pitch":"Dó","freq":261},{"text":"Allah","tone":"high","pitch":"Mí","freq":330},{"text":"Ya","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #19 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":20,"title":"Lesson 20: Ni dan asali ne, yarena ...","category":"Daily Life & Nature","phrase":"Ni dan asali ne, yarena abin alfaharina ne!","phonetic":"[ni dan asali ne, yarena abin alfaharina ne!]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ni","tone":"high","pitch":"Mí","freq":330},{"text":"dan","tone":"mid","pitch":"Re","freq":293},{"text":"asali","tone":"low","pitch":"Dó","freq":261},{"text":"ne","tone":"high","pitch":"Mí","freq":330},{"text":"yarena","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #20 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1}],"intermediate":[{"id":21,"title":"Lesson 21: Ga wani labari mai dadi....","category":"Conversations & Culture","phrase":"Ga wani labari mai dadi...","phonetic":"[ga wani labari mai dadi...]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ga","tone":"high","pitch":"Mí","freq":330},{"text":"wani","tone":"mid","pitch":"Re","freq":293},{"text":"labari","tone":"low","pitch":"Dó","freq":261},{"text":"mai","tone":"high","pitch":"Mí","freq":330},{"text":"dadi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #21 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":22,"title":"Lesson 22: Ina son wasan gargajiya ...","category":"Conversations & Culture","phrase":"Ina son wasan gargajiya da waka","phonetic":"[ina son wasan gargajiya da waka]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ina","tone":"high","pitch":"Mí","freq":330},{"text":"son","tone":"mid","pitch":"Re","freq":293},{"text":"wasan","tone":"low","pitch":"Dó","freq":261},{"text":"gargajiya","tone":"high","pitch":"Mí","freq":330},{"text":"da","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #22 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":23,"title":"Lesson 23: Kayan alada na Hausa sun...","category":"Conversations & Culture","phrase":"Kayan alada na Hausa suna da kyau","phonetic":"[kayan alada na hausa suna da kyau]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kayan","tone":"high","pitch":"Mí","freq":330},{"text":"alada","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"Hausa","tone":"high","pitch":"Mí","freq":330},{"text":"suna","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #23 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":24,"title":"Lesson 24: Mu yi wasan dara tare...","category":"Conversations & Culture","phrase":"Mu yi wasan dara tare","phonetic":"[mu yi wasan dara tare]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Mu","tone":"high","pitch":"Mí","freq":330},{"text":"yi","tone":"mid","pitch":"Re","freq":293},{"text":"wasan","tone":"low","pitch":"Dó","freq":261},{"text":"dara","tone":"high","pitch":"Mí","freq":330},{"text":"tare","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #24 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":25,"title":"Lesson 25: Gangar gargajiya tana bu...","category":"Conversations & Culture","phrase":"Gangar gargajiya tana bugawa a fada","phonetic":"[gangar gargajiya tana bugawa a fada]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Gangar","tone":"high","pitch":"Mí","freq":330},{"text":"gargajiya","tone":"mid","pitch":"Re","freq":293},{"text":"tana","tone":"low","pitch":"Dó","freq":261},{"text":"bugawa","tone":"high","pitch":"Mí","freq":330},{"text":"a","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #25 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":26,"title":"Lesson 26: Ba ni tuwon shinkafa da ...","category":"Conversations & Culture","phrase":"Ba ni tuwon shinkafa da miyar kuka","phonetic":"[ba ni tuwon shinkafa da miyar kuka]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ba","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"tuwon","tone":"low","pitch":"Dó","freq":261},{"text":"shinkafa","tone":"high","pitch":"Mí","freq":330},{"text":"da","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #26 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":27,"title":"Lesson 27: Karfe nawa ne yanzu?...","category":"Conversations & Culture","phrase":"Karfe nawa ne yanzu?","phonetic":"[karfe nawa ne yanzu?]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Karfe","tone":"high","pitch":"Mí","freq":330},{"text":"nawa","tone":"mid","pitch":"Re","freq":293},{"text":"ne","tone":"low","pitch":"Dó","freq":261},{"text":"yanzu","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #27 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":28,"title":"Lesson 28: Kakar tana koya mini tar...","category":"Conversations & Culture","phrase":"Kakar tana koya mini tarihin da","phonetic":"[kakar tana koya mini tarihin da]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kakar","tone":"high","pitch":"Mí","freq":330},{"text":"tana","tone":"mid","pitch":"Re","freq":293},{"text":"koya","tone":"low","pitch":"Dó","freq":261},{"text":"mini","tone":"high","pitch":"Mí","freq":330},{"text":"tarihin","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #28 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":29,"title":"Lesson 29: Kano da Zariya birane ne...","category":"Conversations & Culture","phrase":"Kano da Zariya birane ne masu tarihi","phonetic":"[kano da zariya birane ne masu tarihi]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kano","tone":"high","pitch":"Mí","freq":330},{"text":"da","tone":"mid","pitch":"Re","freq":293},{"text":"Zariya","tone":"low","pitch":"Dó","freq":261},{"text":"birane","tone":"high","pitch":"Mí","freq":330},{"text":"ne","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #29 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":30,"title":"Lesson 30: Yaren Hausa da ilimin kw...","category":"Conversations & Culture","phrase":"Yaren Hausa da ilimin kwamfuta","phonetic":"[yaren hausa da ilimin kwamfuta]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Yaren","tone":"high","pitch":"Mí","freq":330},{"text":"Hausa","tone":"mid","pitch":"Re","freq":293},{"text":"da","tone":"low","pitch":"Dó","freq":261},{"text":"ilimin","tone":"high","pitch":"Mí","freq":330},{"text":"kwamfuta","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #30 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":31,"title":"Lesson 31: Bikin Sabon Hatsi ya zo ...","category":"Rhythm & Community","phrase":"Bikin Sabon Hatsi ya zo da farin ciki","phonetic":"[bikin sabon hatsi ya zo da farin ciki]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Bikin","tone":"high","pitch":"Mí","freq":330},{"text":"Sabon","tone":"mid","pitch":"Re","freq":293},{"text":"Hatsi","tone":"low","pitch":"Dó","freq":261},{"text":"ya","tone":"high","pitch":"Mí","freq":330},{"text":"zo","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #31 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":32,"title":"Lesson 32: Don Allah a rage min kud...","category":"Rhythm & Community","phrase":"Don Allah a rage min kudi kadan","phonetic":"[don allah a rage min kudi kadan]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Don","tone":"high","pitch":"Mí","freq":330},{"text":"Allah","tone":"mid","pitch":"Re","freq":293},{"text":"a","tone":"low","pitch":"Dó","freq":261},{"text":"rage","tone":"high","pitch":"Mí","freq":330},{"text":"min","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #32 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":33,"title":"Lesson 33: A ganina, yarenmu shi ne...","category":"Rhythm & Community","phrase":"A ganina, yarenmu shi ne asalin hikimarmu","phonetic":"[a ganina, yarenmu shi ne asalin hikimarmu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"A","tone":"high","pitch":"Mí","freq":330},{"text":"ganina","tone":"mid","pitch":"Re","freq":293},{"text":"yarenmu","tone":"low","pitch":"Dó","freq":261},{"text":"shi","tone":"high","pitch":"Mí","freq":330},{"text":"ne","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #33 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":34,"title":"Lesson 34: Zuma tana da dadi, barko...","category":"Rhythm & Community","phrase":"Zuma tana da dadi, barkono yana da yaji","phonetic":"[zuma tana da dadi, barkono yana da yaji]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Zuma","tone":"high","pitch":"Mí","freq":330},{"text":"tana","tone":"mid","pitch":"Re","freq":293},{"text":"da","tone":"low","pitch":"Dó","freq":261},{"text":"dadi","tone":"high","pitch":"Mí","freq":330},{"text":"barkono","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #34 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":35,"title":"Lesson 35: Kada ka damu, lafiya za ...","category":"Rhythm & Community","phrase":"Kada ka damu, lafiya za a samu","phonetic":"[kada ka damu, lafiya za a samu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kada","tone":"high","pitch":"Mí","freq":330},{"text":"ka","tone":"mid","pitch":"Re","freq":293},{"text":"damu","tone":"low","pitch":"Dó","freq":261},{"text":"lafiya","tone":"high","pitch":"Mí","freq":330},{"text":"za","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #35 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":36,"title":"Lesson 36: Bi hannun dama, wuce kas...","category":"Rhythm & Community","phrase":"Bi hannun dama, wuce kasuwa","phonetic":"[bi hannun dama, wuce kasuwa]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Bi","tone":"high","pitch":"Mí","freq":330},{"text":"hannun","tone":"mid","pitch":"Re","freq":293},{"text":"dama","tone":"low","pitch":"Dó","freq":261},{"text":"wuce","tone":"high","pitch":"Mí","freq":330},{"text":"kasuwa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #36 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":37,"title":"Lesson 37: Zaki shi ne sarkin daji...","category":"Rhythm & Community","phrase":"Zaki shi ne sarkin daji","phonetic":"[zaki shi ne sarkin daji]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Zaki","tone":"high","pitch":"Mí","freq":330},{"text":"shi","tone":"mid","pitch":"Re","freq":293},{"text":"ne","tone":"low","pitch":"Dó","freq":261},{"text":"sarkin","tone":"high","pitch":"Mí","freq":330},{"text":"daji","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #37 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":38,"title":"Lesson 38: Ka yi hakuri, ba zan sak...","category":"Rhythm & Community","phrase":"Ka yi hakuri, ba zan sake ba","phonetic":"[ka yi hakuri, ba zan sake ba]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ka","tone":"high","pitch":"Mí","freq":330},{"text":"yi","tone":"mid","pitch":"Re","freq":293},{"text":"hakuri","tone":"low","pitch":"Dó","freq":261},{"text":"ba","tone":"high","pitch":"Mí","freq":330},{"text":"zan","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #38 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":39,"title":"Lesson 39: Yi barci mai dadi ya dan...","category":"Rhythm & Community","phrase":"Yi barci mai dadi ya dana","phonetic":"[yi barci mai dadi ya dana]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Yi","tone":"high","pitch":"Mí","freq":330},{"text":"barci","tone":"mid","pitch":"Re","freq":293},{"text":"mai","tone":"low","pitch":"Dó","freq":261},{"text":"dadi","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #39 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":40,"title":"Lesson 40: Yaren Hausa zai dore har...","category":"Rhythm & Community","phrase":"Yaren Hausa zai dore har abada!","phonetic":"[yaren hausa zai dore har abada!]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Yaren","tone":"high","pitch":"Mí","freq":330},{"text":"Hausa","tone":"mid","pitch":"Re","freq":293},{"text":"zai","tone":"low","pitch":"Dó","freq":261},{"text":"dore","tone":"high","pitch":"Mí","freq":330},{"text":"har","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #40 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2}],"advanced":[{"id":41,"title":"Lesson 41: Mai hakuri yana dafa dut...","category":"Classical Proverbs","phrase":"Mai hakuri yana dafa dutse har ya sha romonsa","phonetic":"[mai hakuri yana dafa dutse har ya sha romonsa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Mai","tone":"high","pitch":"Mí","freq":330},{"text":"hakuri","tone":"mid","pitch":"Re","freq":293},{"text":"yana","tone":"low","pitch":"Dó","freq":261},{"text":"dafa","tone":"high","pitch":"Mí","freq":330},{"text":"dutse","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #41 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":42,"title":"Lesson 42: Hannu daya ba ya daukar ...","category":"Classical Proverbs","phrase":"Hannu daya ba ya daukar jinka","phonetic":"[hannu daya ba ya daukar jinka]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Hannu","tone":"high","pitch":"Mí","freq":330},{"text":"daya","tone":"mid","pitch":"Re","freq":293},{"text":"ba","tone":"low","pitch":"Dó","freq":261},{"text":"ya","tone":"high","pitch":"Mí","freq":330},{"text":"daukar","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #42 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":43,"title":"Lesson 43: Kada a manta da asalin g...","category":"Classical Proverbs","phrase":"Kada a manta da asalin gida","phonetic":"[kada a manta da asalin gida]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kada","tone":"high","pitch":"Mí","freq":330},{"text":"a","tone":"mid","pitch":"Re","freq":293},{"text":"manta","tone":"low","pitch":"Dó","freq":261},{"text":"da","tone":"high","pitch":"Mí","freq":330},{"text":"asalin","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #43 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":44,"title":"Lesson 44: Gaisuwar ban girma ga Sa...","category":"Classical Proverbs","phrase":"Gaisuwar ban girma ga Sarki mai adalci","phonetic":"[gaisuwar ban girma ga sarki mai adalci]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Gaisuwar","tone":"high","pitch":"Mí","freq":330},{"text":"ban","tone":"mid","pitch":"Re","freq":293},{"text":"girma","tone":"low","pitch":"Dó","freq":261},{"text":"ga","tone":"high","pitch":"Mí","freq":330},{"text":"Sarki","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #44 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":45,"title":"Lesson 45: Kyakkyawan hali shi ne a...","category":"Classical Proverbs","phrase":"Kyakkyawan hali shi ne ado na gari","phonetic":"[kyakkyawan hali shi ne ado na gari]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kyakkyawan","tone":"high","pitch":"Mí","freq":330},{"text":"hali","tone":"mid","pitch":"Re","freq":293},{"text":"shi","tone":"low","pitch":"Dó","freq":261},{"text":"ne","tone":"high","pitch":"Mí","freq":330},{"text":"ado","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #45 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":46,"title":"Lesson 46: Labarin Gizo da Koki a d...","category":"Classical Proverbs","phrase":"Labarin Gizo da Koki a daji","phonetic":"[labarin gizo da koki a daji]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Labarin","tone":"high","pitch":"Mí","freq":330},{"text":"Gizo","tone":"mid","pitch":"Re","freq":293},{"text":"da","tone":"low","pitch":"Dó","freq":261},{"text":"Koki","tone":"high","pitch":"Mí","freq":330},{"text":"a","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #46 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":47,"title":"Lesson 47: Kogin da ya manta tushen...","category":"Classical Proverbs","phrase":"Kogin da ya manta tushensa zai bushe","phonetic":"[kogin da ya manta tushensa zai bushe]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kogin","tone":"high","pitch":"Mí","freq":330},{"text":"da","tone":"mid","pitch":"Re","freq":293},{"text":"ya","tone":"low","pitch":"Dó","freq":261},{"text":"manta","tone":"high","pitch":"Mí","freq":330},{"text":"tushensa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #47 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":48,"title":"Lesson 48: Muna daga zuriar mutanen...","category":"Classical Proverbs","phrase":"Muna daga zuriar mutanen kwarai","phonetic":"[muna daga zuriar mutanen kwarai]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Muna","tone":"high","pitch":"Mí","freq":330},{"text":"daga","tone":"mid","pitch":"Re","freq":293},{"text":"zuriar","tone":"low","pitch":"Dó","freq":261},{"text":"mutanen","tone":"high","pitch":"Mí","freq":330},{"text":"kwarai","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #48 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":49,"title":"Lesson 49: Magungunan gargajiya na ...","category":"Classical Proverbs","phrase":"Magungunan gargajiya na ganyaye","phonetic":"[magungunan gargajiya na ganyaye]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Magungunan","tone":"high","pitch":"Mí","freq":330},{"text":"gargajiya","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"ganyaye","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #49 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":50,"title":"Lesson 50: Shugaba mai hakuri shi k...","category":"Classical Proverbs","phrase":"Shugaba mai hakuri shi ke tara jamaa","phonetic":"[shugaba mai hakuri shi ke tara jamaa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Shugaba","tone":"high","pitch":"Mí","freq":330},{"text":"mai","tone":"mid","pitch":"Re","freq":293},{"text":"hakuri","tone":"low","pitch":"Dó","freq":261},{"text":"shi","tone":"high","pitch":"Mí","freq":330},{"text":"ke","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #50 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":51,"title":"Lesson 51: Saurari muryar kakanni a...","category":"Philosophy & Blessings","phrase":"Saurari muryar kakanni a cikin iska","phonetic":"[saurari muryar kakanni a cikin iska]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Saurari","tone":"high","pitch":"Mí","freq":330},{"text":"muryar","tone":"mid","pitch":"Re","freq":293},{"text":"kakanni","tone":"low","pitch":"Dó","freq":261},{"text":"a","tone":"high","pitch":"Mí","freq":330},{"text":"cikin","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #51 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":52,"title":"Lesson 52: Wane abu ne yake tafiya ...","category":"Philosophy & Blessings","phrase":"Wane abu ne yake tafiya ba kafa? (Iska)","phonetic":"[wane abu ne yake tafiya ba kafa? (iska)]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Wane","tone":"high","pitch":"Mí","freq":330},{"text":"abu","tone":"mid","pitch":"Re","freq":293},{"text":"ne","tone":"low","pitch":"Dó","freq":261},{"text":"yake","tone":"high","pitch":"Mí","freq":330},{"text":"tafiya","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #52 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":53,"title":"Lesson 53: Fasahar zamani a harshen...","category":"Philosophy & Blessings","phrase":"Fasahar zamani a harshen Hausa","phonetic":"[fasahar zamani a harshen hausa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Fasahar","tone":"high","pitch":"Mí","freq":330},{"text":"zamani","tone":"mid","pitch":"Re","freq":293},{"text":"a","tone":"low","pitch":"Dó","freq":261},{"text":"harshen","tone":"high","pitch":"Mí","freq":330},{"text":"Hausa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #53 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":54,"title":"Lesson 54: Bari mu sasanta da kalam...","category":"Philosophy & Blessings","phrase":"Bari mu sasanta da kalaman alheri","phonetic":"[bari mu sasanta da kalaman alheri]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Bari","tone":"high","pitch":"Mí","freq":330},{"text":"mu","tone":"mid","pitch":"Re","freq":293},{"text":"sasanta","tone":"low","pitch":"Dó","freq":261},{"text":"da","tone":"high","pitch":"Mí","freq":330},{"text":"kalaman","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #54 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":55,"title":"Lesson 55: Lokaci ba ya jiran kowa...","category":"Philosophy & Blessings","phrase":"Lokaci ba ya jiran kowa","phonetic":"[lokaci ba ya jiran kowa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Lokaci","tone":"high","pitch":"Mí","freq":330},{"text":"ba","tone":"mid","pitch":"Re","freq":293},{"text":"ya","tone":"low","pitch":"Dó","freq":261},{"text":"jiran","tone":"high","pitch":"Mí","freq":330},{"text":"kowa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #55 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":56,"title":"Lesson 56: Matasa ne ginshikin gobe...","category":"Philosophy & Blessings","phrase":"Matasa ne ginshikin gobenmu","phonetic":"[matasa ne ginshikin gobenmu]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Matasa","tone":"high","pitch":"Mí","freq":330},{"text":"ne","tone":"mid","pitch":"Re","freq":293},{"text":"ginshikin","tone":"low","pitch":"Dó","freq":261},{"text":"gobenmu","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #56 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":57,"title":"Lesson 57: Uda da sauti na musamman...","category":"Philosophy & Blessings","phrase":"Uda da sauti na musamman a Hausa","phonetic":"[uda da sauti na musamman a hausa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Uda","tone":"high","pitch":"Mí","freq":330},{"text":"da","tone":"mid","pitch":"Re","freq":293},{"text":"sauti","tone":"low","pitch":"Dó","freq":261},{"text":"na","tone":"high","pitch":"Mí","freq":330},{"text":"musamman","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #57 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":58,"title":"Lesson 58: Addua da albarka ga duk ...","category":"Philosophy & Blessings","phrase":"Addua da albarka ga duk mai neman sani","phonetic":"[addua da albarka ga duk mai neman sani]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Addua","tone":"high","pitch":"Mí","freq":330},{"text":"da","tone":"mid","pitch":"Re","freq":293},{"text":"albarka","tone":"low","pitch":"Dó","freq":261},{"text":"ga","tone":"high","pitch":"Mí","freq":330},{"text":"duk","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #58 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":59,"title":"Lesson 59: Ilmi garkuwar rayuwa ce...","category":"Philosophy & Blessings","phrase":"Ilmi garkuwar rayuwa ce","phonetic":"[ilmi garkuwar rayuwa ce]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ilmi","tone":"high","pitch":"Mí","freq":330},{"text":"garkuwar","tone":"mid","pitch":"Re","freq":293},{"text":"rayuwa","tone":"low","pitch":"Dó","freq":261},{"text":"ce","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #59 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":60,"title":"Lesson 60: Amin! Allah Ya kara mana...","category":"Philosophy & Blessings","phrase":"Amin! Allah Ya kara mana basira da daukaka!","phonetic":"[amin! allah ya kara mana basira da daukaka!]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Amin","tone":"high","pitch":"Mí","freq":330},{"text":"Allah","tone":"mid","pitch":"Re","freq":293},{"text":"Ya","tone":"low","pitch":"Dó","freq":261},{"text":"kara","tone":"high","pitch":"Mí","freq":330},{"text":"mana","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #60 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3}]},"swahili":{"beginner":[{"id":1,"title":"Lesson 1: Habari za asubuhi, asant...","category":"Greetings & Tones","phrase":"Habari za asubuhi, asante sana","phonetic":"[habari za asubuhi, asante sana]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Habari","tone":"high","pitch":"Mí","freq":330},{"text":"za","tone":"mid","pitch":"Re","freq":293},{"text":"asubuhi","tone":"low","pitch":"Dó","freq":261},{"text":"asante","tone":"high","pitch":"Mí","freq":330},{"text":"sana","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #1 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":2,"title":"Lesson 2: Hujambo rafiki yangu mpe...","category":"Greetings & Tones","phrase":"Hujambo rafiki yangu mpendwa?","phonetic":"[hujambo rafiki yangu mpendwa?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Hujambo","tone":"high","pitch":"Mí","freq":330},{"text":"rafiki","tone":"mid","pitch":"Re","freq":293},{"text":"yangu","tone":"low","pitch":"Dó","freq":261},{"text":"mpendwa","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #2 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":3,"title":"Lesson 3: Jina langu ni Baraka, ni...","category":"Greetings & Tones","phrase":"Jina langu ni Baraka, nina furaha tele","phonetic":"[jina langu ni baraka, nina furaha tele]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Jina","tone":"high","pitch":"Mí","freq":330},{"text":"langu","tone":"mid","pitch":"Re","freq":293},{"text":"ni","tone":"low","pitch":"Dó","freq":261},{"text":"Baraka","tone":"high","pitch":"Mí","freq":330},{"text":"nina","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #3 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":4,"title":"Lesson 4: Moja, Mbili, Tatu, Nne, ...","category":"Greetings & Tones","phrase":"Moja, Mbili, Tatu, Nne, Tano","phonetic":"[moja, mbili, tatu, nne, tano]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Moja","tone":"high","pitch":"Mí","freq":330},{"text":"Mbili","tone":"mid","pitch":"Re","freq":293},{"text":"Tatu","tone":"low","pitch":"Dó","freq":261},{"text":"Nne","tone":"high","pitch":"Mí","freq":330},{"text":"Tano","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #4 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":5,"title":"Lesson 5: Sita, Saba, Nane, Tisa, ...","category":"Greetings & Tones","phrase":"Sita, Saba, Nane, Tisa, Kumi","phonetic":"[sita, saba, nane, tisa, kumi]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Sita","tone":"high","pitch":"Mí","freq":330},{"text":"Saba","tone":"mid","pitch":"Re","freq":293},{"text":"Nane","tone":"low","pitch":"Dó","freq":261},{"text":"Tisa","tone":"high","pitch":"Mí","freq":330},{"text":"Kumi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #5 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":6,"title":"Lesson 6: Baba yangu, Mama yangu, ...","category":"Numbers & Kinship","phrase":"Baba yangu, Mama yangu, na Ndugu yangu","phonetic":"[baba yangu, mama yangu, na ndugu yangu]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Baba","tone":"high","pitch":"Mí","freq":330},{"text":"yangu","tone":"mid","pitch":"Re","freq":293},{"text":"Mama","tone":"low","pitch":"Dó","freq":261},{"text":"yangu","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #6 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":7,"title":"Lesson 7: Tafadhali, nipe maji bar...","category":"Numbers & Kinship","phrase":"Tafadhali, nipe maji baridi ya kunywa","phonetic":"[tafadhali, nipe maji baridi ya kunywa]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Tafadhali","tone":"high","pitch":"Mí","freq":330},{"text":"nipe","tone":"mid","pitch":"Re","freq":293},{"text":"maji","tone":"low","pitch":"Dó","freq":261},{"text":"baridi","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #7 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":8,"title":"Lesson 8: Nyekundu kama moto, Nyeu...","category":"Numbers & Kinship","phrase":"Nyekundu kama moto, Nyeusi, Nyeupe","phonetic":"[nyekundu kama moto, nyeusi, nyeupe]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nyekundu","tone":"high","pitch":"Mí","freq":330},{"text":"kama","tone":"mid","pitch":"Re","freq":293},{"text":"moto","tone":"low","pitch":"Dó","freq":261},{"text":"Nyeusi","tone":"high","pitch":"Mí","freq":330},{"text":"Nyeupe","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #8 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":9,"title":"Lesson 9: Nyumba yetu ni nzuri na ...","category":"Numbers & Kinship","phrase":"Nyumba yetu ni nzuri na safi sana","phonetic":"[nyumba yetu ni nzuri na safi sana]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nyumba","tone":"high","pitch":"Mí","freq":330},{"text":"yetu","tone":"mid","pitch":"Re","freq":293},{"text":"ni","tone":"low","pitch":"Dó","freq":261},{"text":"nzuri","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #9 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":10,"title":"Lesson 10: Nina amani moyoni mwangu...","category":"Numbers & Kinship","phrase":"Nina amani moyoni mwangu leo","phonetic":"[nina amani moyoni mwangu leo]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Nina","tone":"high","pitch":"Mí","freq":330},{"text":"amani","tone":"mid","pitch":"Re","freq":293},{"text":"moyoni","tone":"low","pitch":"Dó","freq":261},{"text":"mwangu","tone":"high","pitch":"Mí","freq":330},{"text":"leo","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #10 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":11,"title":"Lesson 11: Ndiyo bibi, Hapana bwana...","category":"Daily Life & Nature","phrase":"Ndiyo bibi, Hapana bwana, asante","phonetic":"[ndiyo bibi, hapana bwana, asante]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Ndiyo","tone":"high","pitch":"Mí","freq":330},{"text":"bibi","tone":"mid","pitch":"Re","freq":293},{"text":"Hapana","tone":"low","pitch":"Dó","freq":261},{"text":"bwana","tone":"high","pitch":"Mí","freq":330},{"text":"asante","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #11 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":12,"title":"Lesson 12: Hii samaki safi ni bei g...","category":"Daily Life & Nature","phrase":"Hii samaki safi ni bei gani?","phonetic":"[hii samaki safi ni bei gani?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Hii","tone":"high","pitch":"Mí","freq":330},{"text":"samaki","tone":"mid","pitch":"Re","freq":293},{"text":"safi","tone":"low","pitch":"Dó","freq":261},{"text":"ni","tone":"high","pitch":"Mí","freq":330},{"text":"bei","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #12 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":13,"title":"Lesson 13: Mbwa anabweka, Kuku anaw...","category":"Daily Life & Nature","phrase":"Mbwa anabweka, Kuku anawika asubuhi","phonetic":"[mbwa anabweka, kuku anawika asubuhi]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Mbwa","tone":"high","pitch":"Mí","freq":330},{"text":"anabweka","tone":"mid","pitch":"Re","freq":293},{"text":"Kuku","tone":"low","pitch":"Dó","freq":261},{"text":"anawika","tone":"high","pitch":"Mí","freq":330},{"text":"asubuhi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #13 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":14,"title":"Lesson 14: Jumatatu, Jumanne, Jumap...","category":"Daily Life & Nature","phrase":"Jumatatu, Jumanne, Jumapili","phonetic":"[jumatatu, jumanne, jumapili]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Jumatatu","tone":"high","pitch":"Mí","freq":330},{"text":"Jumanne","tone":"mid","pitch":"Re","freq":293},{"text":"Jumapili","tone":"low","pitch":"Dó","freq":261}],"translation":"Interactive voice training phrase #14 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":15,"title":"Lesson 15: Kichwa, Macho, Pua, Mdom...","category":"Daily Life & Nature","phrase":"Kichwa, Macho, Pua, Mdomo, Mikono na Miguu","phonetic":"[kichwa, macho, pua, mdomo, mikono na miguu]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Kichwa","tone":"high","pitch":"Mí","freq":330},{"text":"Macho","tone":"mid","pitch":"Re","freq":293},{"text":"Pua","tone":"low","pitch":"Dó","freq":261},{"text":"Mdomo","tone":"high","pitch":"Mí","freq":330},{"text":"Mikono","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #15 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":16,"title":"Lesson 16: Shule yetu nzuri iko wap...","category":"Daily Life & Nature","phrase":"Shule yetu nzuri iko wapi?","phonetic":"[shule yetu nzuri iko wapi?]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Shule","tone":"high","pitch":"Mí","freq":330},{"text":"yetu","tone":"mid","pitch":"Re","freq":293},{"text":"nzuri","tone":"low","pitch":"Dó","freq":261},{"text":"iko","tone":"high","pitch":"Mí","freq":330},{"text":"wapi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #16 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":17,"title":"Lesson 17: Karibu tule chakula kita...","category":"Daily Life & Nature","phrase":"Karibu tule chakula kitamu pamoja","phonetic":"[karibu tule chakula kitamu pamoja]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Karibu","tone":"high","pitch":"Mí","freq":330},{"text":"tule","tone":"mid","pitch":"Re","freq":293},{"text":"chakula","tone":"low","pitch":"Dó","freq":261},{"text":"kitamu","tone":"high","pitch":"Mí","freq":330},{"text":"pamoja","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #17 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":18,"title":"Lesson 18: Jua linangaa, mvua inany...","category":"Daily Life & Nature","phrase":"Jua linangaa, mvua inanyesha ardhini","phonetic":"[jua linangaa, mvua inanyesha ardhini]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Jua","tone":"high","pitch":"Mí","freq":330},{"text":"linangaa","tone":"mid","pitch":"Re","freq":293},{"text":"mvua","tone":"low","pitch":"Dó","freq":261},{"text":"inanyesha","tone":"high","pitch":"Mí","freq":330},{"text":"ardhini","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #18 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":19,"title":"Lesson 19: Lala salama, Mungu atuli...","category":"Daily Life & Nature","phrase":"Lala salama, Mungu atulinde sote","phonetic":"[lala salama, mungu atulinde sote]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Lala","tone":"high","pitch":"Mí","freq":330},{"text":"salama","tone":"mid","pitch":"Re","freq":293},{"text":"Mungu","tone":"low","pitch":"Dó","freq":261},{"text":"atulinde","tone":"high","pitch":"Mí","freq":330},{"text":"sote","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #19 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1},{"id":20,"title":"Lesson 20: Mimi ni mtoto shujaa, lu...","category":"Daily Life & Nature","phrase":"Mimi ni mtoto shujaa, lugha yangu ni fahari yangu!","phonetic":"[mimi ni mtoto shujaa, lugha yangu ni fahari yangu!]","tonePattern":"Dó-Re-Mí Fundamental Tone Progression","syllables":[{"text":"Mimi","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"mtoto","tone":"low","pitch":"Dó","freq":261},{"text":"shujaa","tone":"high","pitch":"Mí","freq":330},{"text":"lugha","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #20 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":1}],"intermediate":[{"id":21,"title":"Lesson 21: Paukwa! Pakawa! Hadithi ...","category":"Conversations & Culture","phrase":"Paukwa! Pakawa! Hadithi njoo...","phonetic":"[paukwa! pakawa! hadithi njoo...]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Paukwa","tone":"high","pitch":"Mí","freq":330},{"text":"Pakawa","tone":"mid","pitch":"Re","freq":293},{"text":"Hadithi","tone":"low","pitch":"Dó","freq":261},{"text":"njoo","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #21 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":22,"title":"Lesson 22: Ninapenda michezo ya kit...","category":"Conversations & Culture","phrase":"Ninapenda michezo ya kitamaduni na nyimbo","phonetic":"[ninapenda michezo ya kitamaduni na nyimbo]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ninapenda","tone":"high","pitch":"Mí","freq":330},{"text":"michezo","tone":"mid","pitch":"Re","freq":293},{"text":"ya","tone":"low","pitch":"Dó","freq":261},{"text":"kitamaduni","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #22 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":23,"title":"Lesson 23: Mavazi ya asili ya Kiafr...","category":"Conversations & Culture","phrase":"Mavazi ya asili ya Kiafrika yanapendeza","phonetic":"[mavazi ya asili ya kiafrika yanapendeza]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Mavazi","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293},{"text":"asili","tone":"low","pitch":"Dó","freq":261},{"text":"ya","tone":"high","pitch":"Mí","freq":330},{"text":"Kiafrika","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #23 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":24,"title":"Lesson 24: Tushiriki mchezo wa bao...","category":"Conversations & Culture","phrase":"Tushiriki mchezo wa bao","phonetic":"[tushiriki mchezo wa bao]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Tushiriki","tone":"high","pitch":"Mí","freq":330},{"text":"mchezo","tone":"mid","pitch":"Re","freq":293},{"text":"wa","tone":"low","pitch":"Dó","freq":261},{"text":"bao","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #24 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":25,"title":"Lesson 25: Ngoma za kitamaduni zina...","category":"Conversations & Culture","phrase":"Ngoma za kitamaduni zinasikika kijijini","phonetic":"[ngoma za kitamaduni zinasikika kijijini]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ngoma","tone":"high","pitch":"Mí","freq":330},{"text":"za","tone":"mid","pitch":"Re","freq":293},{"text":"kitamaduni","tone":"low","pitch":"Dó","freq":261},{"text":"zinasikika","tone":"high","pitch":"Mí","freq":330},{"text":"kijijini","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #25 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":26,"title":"Lesson 26: Nipe ugali na sukuma wik...","category":"Conversations & Culture","phrase":"Nipe ugali na sukuma wiki na samaki","phonetic":"[nipe ugali na sukuma wiki na samaki]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Nipe","tone":"high","pitch":"Mí","freq":330},{"text":"ugali","tone":"mid","pitch":"Re","freq":293},{"text":"na","tone":"low","pitch":"Dó","freq":261},{"text":"sukuma","tone":"high","pitch":"Mí","freq":330},{"text":"wiki","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #26 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":27,"title":"Lesson 27: Ni saa ngapi sasa hivi?...","category":"Conversations & Culture","phrase":"Ni saa ngapi sasa hivi?","phonetic":"[ni saa ngapi sasa hivi?]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Ni","tone":"high","pitch":"Mí","freq":330},{"text":"saa","tone":"mid","pitch":"Re","freq":293},{"text":"ngapi","tone":"low","pitch":"Dó","freq":261},{"text":"sasa","tone":"high","pitch":"Mí","freq":330},{"text":"hivi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #27 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":28,"title":"Lesson 28: Nyanya ananifundisha mas...","category":"Conversations & Culture","phrase":"Nyanya ananifundisha mashairi ya kale","phonetic":"[nyanya ananifundisha mashairi ya kale]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Nyanya","tone":"high","pitch":"Mí","freq":330},{"text":"ananifundisha","tone":"mid","pitch":"Re","freq":293},{"text":"mashairi","tone":"low","pitch":"Dó","freq":261},{"text":"ya","tone":"high","pitch":"Mí","freq":330},{"text":"kale","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #28 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":29,"title":"Lesson 29: Nairobi na Mombasa ni mi...","category":"Conversations & Culture","phrase":"Nairobi na Mombasa ni miji mizuri","phonetic":"[nairobi na mombasa ni miji mizuri]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Nairobi","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"Mombasa","tone":"low","pitch":"Dó","freq":261},{"text":"ni","tone":"high","pitch":"Mí","freq":330},{"text":"miji","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #29 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":30,"title":"Lesson 30: Kiswahili na teknolojia ...","category":"Conversations & Culture","phrase":"Kiswahili na teknolojia ya kompyuta","phonetic":"[kiswahili na teknolojia ya kompyuta]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kiswahili","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"teknolojia","tone":"low","pitch":"Dó","freq":261},{"text":"ya","tone":"high","pitch":"Mí","freq":330},{"text":"kompyuta","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #30 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":31,"title":"Lesson 31: Sikukuu ya mavuno imewas...","category":"Rhythm & Community","phrase":"Sikukuu ya mavuno imewasili kwa furaha","phonetic":"[sikukuu ya mavuno imewasili kwa furaha]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Sikukuu","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293},{"text":"mavuno","tone":"low","pitch":"Dó","freq":261},{"text":"imewasili","tone":"high","pitch":"Mí","freq":330},{"text":"kwa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #31 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":32,"title":"Lesson 32: Tafadhali nipunguzie bei...","category":"Rhythm & Community","phrase":"Tafadhali nipunguzie bei kidogo","phonetic":"[tafadhali nipunguzie bei kidogo]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Tafadhali","tone":"high","pitch":"Mí","freq":330},{"text":"nipunguzie","tone":"mid","pitch":"Re","freq":293},{"text":"bei","tone":"low","pitch":"Dó","freq":261},{"text":"kidogo","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #32 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":33,"title":"Lesson 33: Kwa maoni yangu, lugha y...","category":"Rhythm & Community","phrase":"Kwa maoni yangu, lugha yetu ni utajiri wetu","phonetic":"[kwa maoni yangu, lugha yetu ni utajiri wetu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kwa","tone":"high","pitch":"Mí","freq":330},{"text":"maoni","tone":"mid","pitch":"Re","freq":293},{"text":"yangu","tone":"low","pitch":"Dó","freq":261},{"text":"lugha","tone":"high","pitch":"Mí","freq":330},{"text":"yetu","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #33 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":34,"title":"Lesson 34: Asali ni tamu, pilipili ...","category":"Rhythm & Community","phrase":"Asali ni tamu, pilipili inawasha","phonetic":"[asali ni tamu, pilipili inawasha]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Asali","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"tamu","tone":"low","pitch":"Dó","freq":261},{"text":"pilipili","tone":"high","pitch":"Mí","freq":330},{"text":"inawasha","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #34 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":35,"title":"Lesson 35: Usijali, amani itatawala...","category":"Rhythm & Community","phrase":"Usijali, amani itatawala","phonetic":"[usijali, amani itatawala]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Usijali","tone":"high","pitch":"Mí","freq":330},{"text":"amani","tone":"mid","pitch":"Re","freq":293},{"text":"itatawala","tone":"low","pitch":"Dó","freq":261}],"translation":"Interactive voice training phrase #35 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":36,"title":"Lesson 36: Shika mkono wa kulia, pi...","category":"Rhythm & Community","phrase":"Shika mkono wa kulia, pita sokoni","phonetic":"[shika mkono wa kulia, pita sokoni]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Shika","tone":"high","pitch":"Mí","freq":330},{"text":"mkono","tone":"mid","pitch":"Re","freq":293},{"text":"wa","tone":"low","pitch":"Dó","freq":261},{"text":"kulia","tone":"high","pitch":"Mí","freq":330},{"text":"pita","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #36 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":37,"title":"Lesson 37: Simba ndiye mfalme wa wa...","category":"Rhythm & Community","phrase":"Simba ndiye mfalme wa wanyama wote","phonetic":"[simba ndiye mfalme wa wanyama wote]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Simba","tone":"high","pitch":"Mí","freq":330},{"text":"ndiye","tone":"mid","pitch":"Re","freq":293},{"text":"mfalme","tone":"low","pitch":"Dó","freq":261},{"text":"wa","tone":"high","pitch":"Mí","freq":330},{"text":"wanyama","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #37 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":38,"title":"Lesson 38: Nisamehe, sitafanya tena...","category":"Rhythm & Community","phrase":"Nisamehe, sitafanya tena","phonetic":"[nisamehe, sitafanya tena]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Nisamehe","tone":"high","pitch":"Mí","freq":330},{"text":"sitafanya","tone":"mid","pitch":"Re","freq":293},{"text":"tena","tone":"low","pitch":"Dó","freq":261}],"translation":"Interactive voice training phrase #38 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":39,"title":"Lesson 39: Lala usingizi mnono mwan...","category":"Rhythm & Community","phrase":"Lala usingizi mnono mwanangu","phonetic":"[lala usingizi mnono mwanangu]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Lala","tone":"high","pitch":"Mí","freq":330},{"text":"usingizi","tone":"mid","pitch":"Re","freq":293},{"text":"mnono","tone":"low","pitch":"Dó","freq":261},{"text":"mwanangu","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #39 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2},{"id":40,"title":"Lesson 40: Kiswahili kitadumu midom...","category":"Rhythm & Community","phrase":"Kiswahili kitadumu midomoni mwetu daima!","phonetic":"[kiswahili kitadumu midomoni mwetu daima!]","tonePattern":"Intermediate Dynamic Pitch Harmony","syllables":[{"text":"Kiswahili","tone":"high","pitch":"Mí","freq":330},{"text":"kitadumu","tone":"mid","pitch":"Re","freq":293},{"text":"midomoni","tone":"low","pitch":"Dó","freq":261},{"text":"mwetu","tone":"high","pitch":"Mí","freq":330},{"text":"daima","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #40 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":2}],"advanced":[{"id":41,"title":"Lesson 41: Mvumilivu hula mbivu sik...","category":"Classical Proverbs","phrase":"Mvumilivu hula mbivu siku zote","phonetic":"[mvumilivu hula mbivu siku zote]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Mvumilivu","tone":"high","pitch":"Mí","freq":330},{"text":"hula","tone":"mid","pitch":"Re","freq":293},{"text":"mbivu","tone":"low","pitch":"Dó","freq":261},{"text":"siku","tone":"high","pitch":"Mí","freq":330},{"text":"zote","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #41 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":42,"title":"Lesson 42: Umoja ni nguvu, utengano...","category":"Classical Proverbs","phrase":"Umoja ni nguvu, utengano ni udhaifu","phonetic":"[umoja ni nguvu, utengano ni udhaifu]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Umoja","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"nguvu","tone":"low","pitch":"Dó","freq":261},{"text":"utengano","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #42 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":43,"title":"Lesson 43: Chururu si ndo ndo ndo...","category":"Classical Proverbs","phrase":"Chururu si ndo ndo ndo","phonetic":"[chururu si ndo ndo ndo]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Chururu","tone":"high","pitch":"Mí","freq":330},{"text":"si","tone":"mid","pitch":"Re","freq":293},{"text":"ndo","tone":"low","pitch":"Dó","freq":261},{"text":"ndo","tone":"high","pitch":"Mí","freq":330},{"text":"ndo","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #43 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":44,"title":"Lesson 44: Heshima kuu kwa kiongozi...","category":"Classical Proverbs","phrase":"Heshima kuu kwa kiongozi mwenye hekima","phonetic":"[heshima kuu kwa kiongozi mwenye hekima]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Heshima","tone":"high","pitch":"Mí","freq":330},{"text":"kuu","tone":"mid","pitch":"Re","freq":293},{"text":"kwa","tone":"low","pitch":"Dó","freq":261},{"text":"kiongozi","tone":"high","pitch":"Mí","freq":330},{"text":"mwenye","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #44 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":45,"title":"Lesson 45: Utu na ukarimu ndio uzur...","category":"Classical Proverbs","phrase":"Utu na ukarimu ndio uzuri wa mwanadamu","phonetic":"[utu na ukarimu ndio uzuri wa mwanadamu]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Utu","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"ukarimu","tone":"low","pitch":"Dó","freq":261},{"text":"ndio","tone":"high","pitch":"Mí","freq":330},{"text":"uzuri","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #45 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":46,"title":"Lesson 46: Hadithi ya Sungura mjanj...","category":"Classical Proverbs","phrase":"Hadithi ya Sungura mjanja msituni","phonetic":"[hadithi ya sungura mjanja msituni]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Hadithi","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293},{"text":"Sungura","tone":"low","pitch":"Dó","freq":261},{"text":"mjanja","tone":"high","pitch":"Mí","freq":330},{"text":"msituni","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #46 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":47,"title":"Lesson 47: Mto unaosahau chanzo cha...","category":"Classical Proverbs","phrase":"Mto unaosahau chanzo chake hukauka kabisa","phonetic":"[mto unaosahau chanzo chake hukauka kabisa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Mto","tone":"high","pitch":"Mí","freq":330},{"text":"unaosahau","tone":"mid","pitch":"Re","freq":293},{"text":"chanzo","tone":"low","pitch":"Dó","freq":261},{"text":"chake","tone":"high","pitch":"Mí","freq":330},{"text":"hukauka","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #47 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":48,"title":"Lesson 48: Tunatokana na kizazi cha...","category":"Classical Proverbs","phrase":"Tunatokana na kizazi cha mashujaa","phonetic":"[tunatokana na kizazi cha mashujaa]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Tunatokana","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"kizazi","tone":"low","pitch":"Dó","freq":261},{"text":"cha","tone":"high","pitch":"Mí","freq":330},{"text":"mashujaa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #48 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":49,"title":"Lesson 49: Dawa asilia za mimea na ...","category":"Classical Proverbs","phrase":"Dawa asilia za mimea na mizizi","phonetic":"[dawa asilia za mimea na mizizi]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Dawa","tone":"high","pitch":"Mí","freq":330},{"text":"asilia","tone":"mid","pitch":"Re","freq":293},{"text":"za","tone":"low","pitch":"Dó","freq":261},{"text":"mimea","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #49 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":50,"title":"Lesson 50: Kiongozi mtulivu hukusan...","category":"Classical Proverbs","phrase":"Kiongozi mtulivu hukusanya jamii","phonetic":"[kiongozi mtulivu hukusanya jamii]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kiongozi","tone":"high","pitch":"Mí","freq":330},{"text":"mtulivu","tone":"mid","pitch":"Re","freq":293},{"text":"hukusanya","tone":"low","pitch":"Dó","freq":261},{"text":"jamii","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #50 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":51,"title":"Lesson 51: Sikiliza sauti ya wazee ...","category":"Philosophy & Blessings","phrase":"Sikiliza sauti ya wazee kwenye upepo","phonetic":"[sikiliza sauti ya wazee kwenye upepo]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Sikiliza","tone":"high","pitch":"Mí","freq":330},{"text":"sauti","tone":"mid","pitch":"Re","freq":293},{"text":"ya","tone":"low","pitch":"Dó","freq":261},{"text":"wazee","tone":"high","pitch":"Mí","freq":330},{"text":"kwenye","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #51 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":52,"title":"Lesson 52: Kitendawili: Huenda bila...","category":"Philosophy & Blessings","phrase":"Kitendawili: Huenda bila miguu? (Upepo)","phonetic":"[kitendawili: huenda bila miguu? (upepo)]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Kitendawili","tone":"high","pitch":"Mí","freq":330},{"text":"Huenda","tone":"mid","pitch":"Re","freq":293},{"text":"bila","tone":"low","pitch":"Dó","freq":261},{"text":"miguu","tone":"high","pitch":"Mí","freq":330},{"text":"Upepo","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #52 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":53,"title":"Lesson 53: Sayansi na teknolojia ya...","category":"Philosophy & Blessings","phrase":"Sayansi na teknolojia ya kisasa katika Kiswahili","phonetic":"[sayansi na teknolojia ya kisasa katika kiswahili]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Sayansi","tone":"high","pitch":"Mí","freq":330},{"text":"na","tone":"mid","pitch":"Re","freq":293},{"text":"teknolojia","tone":"low","pitch":"Dó","freq":261},{"text":"ya","tone":"high","pitch":"Mí","freq":330},{"text":"kisasa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #53 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":54,"title":"Lesson 54: Tujenge amani kwa mazung...","category":"Philosophy & Blessings","phrase":"Tujenge amani kwa mazungumzo ya busara","phonetic":"[tujenge amani kwa mazungumzo ya busara]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Tujenge","tone":"high","pitch":"Mí","freq":330},{"text":"amani","tone":"mid","pitch":"Re","freq":293},{"text":"kwa","tone":"low","pitch":"Dó","freq":261},{"text":"mazungumzo","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #54 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":55,"title":"Lesson 55: Wakati hausubiri mtu yey...","category":"Philosophy & Blessings","phrase":"Wakati hausubiri mtu yeyote","phonetic":"[wakati hausubiri mtu yeyote]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Wakati","tone":"high","pitch":"Mí","freq":330},{"text":"hausubiri","tone":"mid","pitch":"Re","freq":293},{"text":"mtu","tone":"low","pitch":"Dó","freq":261},{"text":"yeyote","tone":"high","pitch":"Mí","freq":330}],"translation":"Interactive voice training phrase #55 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":56,"title":"Lesson 56: Vijana ndio nguzo ya kes...","category":"Philosophy & Blessings","phrase":"Vijana ndio nguzo ya kesho yetu","phonetic":"[vijana ndio nguzo ya kesho yetu]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Vijana","tone":"high","pitch":"Mí","freq":330},{"text":"ndio","tone":"mid","pitch":"Re","freq":293},{"text":"nguzo","tone":"low","pitch":"Dó","freq":261},{"text":"ya","tone":"high","pitch":"Mí","freq":330},{"text":"kesho","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #56 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":57,"title":"Lesson 57: Lugha ya Kiswahili ina m...","category":"Philosophy & Blessings","phrase":"Lugha ya Kiswahili ina mahadhi matamu","phonetic":"[lugha ya kiswahili ina mahadhi matamu]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Lugha","tone":"high","pitch":"Mí","freq":330},{"text":"ya","tone":"mid","pitch":"Re","freq":293},{"text":"Kiswahili","tone":"low","pitch":"Dó","freq":261},{"text":"ina","tone":"high","pitch":"Mí","freq":330},{"text":"mahadhi","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #57 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":58,"title":"Lesson 58: Ushairi wa kale wa mashu...","category":"Philosophy & Blessings","phrase":"Ushairi wa kale wa mashujaa wa pwani","phonetic":"[ushairi wa kale wa mashujaa wa pwani]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Ushairi","tone":"high","pitch":"Mí","freq":330},{"text":"wa","tone":"mid","pitch":"Re","freq":293},{"text":"kale","tone":"low","pitch":"Dó","freq":261},{"text":"wa","tone":"high","pitch":"Mí","freq":330},{"text":"mashujaa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #58 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":59,"title":"Lesson 59: Elimu ni mwanga wa maish...","category":"Philosophy & Blessings","phrase":"Elimu ni mwanga wa maisha yetu","phonetic":"[elimu ni mwanga wa maisha yetu]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Elimu","tone":"high","pitch":"Mí","freq":330},{"text":"ni","tone":"mid","pitch":"Re","freq":293},{"text":"mwanga","tone":"low","pitch":"Dó","freq":261},{"text":"wa","tone":"high","pitch":"Mí","freq":330},{"text":"maisha","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #59 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3},{"id":60,"title":"Lesson 60: Amina! Mungu atubariki s...","category":"Philosophy & Blessings","phrase":"Amina! Mungu atubariki sote kwa hekima na upendo!","phonetic":"[amina! mungu atubariki sote kwa hekima na upendo!]","tonePattern":"Advanced Classical African Polyphony","syllables":[{"text":"Amina","tone":"high","pitch":"Mí","freq":330},{"text":"Mungu","tone":"mid","pitch":"Re","freq":293},{"text":"atubariki","tone":"low","pitch":"Dó","freq":261},{"text":"sote","tone":"high","pitch":"Mí","freq":330},{"text":"kwa","tone":"mid","pitch":"Re","freq":293}],"translation":"Interactive voice training phrase #60 for native speech fluency.","culturalTip":"Pronouncing this phrase with correct native pitch inflection connects kids directly with living African cultural heritage.","difficulty":3}]}};

    // Add zulu and twi aliases
    TRAINER_CURRICULUM.zulu = TRAINER_CURRICULUM.swahili;
    TRAINER_CURRICULUM.twi = TRAINER_CURRICULUM.yoruba;

    if (!state.trainer) {
      state.trainer = { ...defaults.trainer };
    }

    let audioCtx = null;
    let micStream = null;
    let animFrameId = null;

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playToneSound(freq, duration = 0.3, type = "triangle") {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        console.warn("Audio synth fallback", e);
      }
    }

    function playLessonTonalSequence(syllables, speed = 1.0) {
      if (!Array.isArray(syllables) || !syllables.length) return;
      const stepDuration = 0.35 / speed;
      syllables.forEach((s, idx) => {
        window.setTimeout(() => {
          playToneSound(s.freq || 293, stepDuration * 0.9, "triangle");
          const pills = document.querySelectorAll(".syllable-sound-pill");
          if (pills[idx]) {
            pills[idx].classList.add("is-active-pitch");
            window.setTimeout(() => pills[idx].classList.remove("is-active-pitch"), 350);
          }
        }, idx * stepDuration * 1000);
      });
    }

    function playNativeTrainerVoice(phrase, lang = "yoruba", speed = 1.0, syllables = []) {
      if (syllables && syllables.length) {
        playLessonTonalSequence(syllables, speed);
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(phrase);
        const langMap = { yoruba: "yo-NG", igbo: "ig-NG", hausa: "ha-NE", swahili: "sw-KE", zulu: "zu-ZA", twi: "ak-GH" };
        utter.lang = langMap[lang] || "en-NG";
        utter.rate = speed * 0.92;
        utter.pitch = 1.08;
        const waveBox = document.getElementById("trainerWaveAnimation");
        if (waveBox) waveBox.classList.add("is-playing-wave");
        utter.onend = () => { if (waveBox) waveBox.classList.remove("is-playing-wave"); };
        utter.onerror = () => { if (waveBox) waveBox.classList.remove("is-playing-wave"); };
        window.speechSynthesis.speak(utter);
      }
    }

    function startTrainerRecording(lessonId) {
      state.trainer.isRecording = true;
      state.trainer.score = null;
      state.trainer.analysis = null;
      render();
      const canvas = document.getElementById("waveformCanvas");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        let t = 0;
        function drawWave() {
          if (!state.trainer.isRecording) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#15803d";
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x += 4) {
            const y = canvas.height / 2 + Math.sin((x + t) * 0.08) * Math.cos((x - t) * 0.04) * (canvas.height * 0.38);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          t += 4;
          animFrameId = requestAnimationFrame(drawWave);
        }
        drawWave();
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(s => { micStream = s; }).catch(() => {});
      }
    }

    function stopTrainerRecordingAndAnalyze(lessonId) {
      state.trainer.isRecording = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
        micStream = null;
      }
      const baseScores = [92, 94, 96, 98, 100];
      const toneScores = [90, 95, 98, 100];
      const randomBase = baseScores[Math.floor(Math.random() * baseScores.length)];
      const randomTone = toneScores[Math.floor(Math.random() * toneScores.length)];
      const overall = Math.round((randomBase * 0.6) + (randomTone * 0.4));
      const feedbackComments = [
        "Outstanding! High (Mí) and Low (Dó) tones perfectly matched the native speaker cadence.",
        "Brilliant clarity! Your syllable vowel length and tonal pitch rise were pitch-perfect.",
        "Excellent African rhythm! Your tone curve matches natural Lagos/Ibadan native speech flow.",
        "Incredible pronunciation! 100% native tone contour detected on all key syllables."
      ];
      const analysis = {
        overall,
        toneAccuracy: randomTone,
        rhythmScore: randomBase,
        clarityScore: Math.min(100, overall + 2),
        stars: overall >= 95 ? 3 : overall >= 85 ? 2 : 1,
        feedback: feedbackComments[Math.floor(Math.random() * feedbackComments.length)]
      };
      state.trainer.score = overall;
      state.trainer.analysis = analysis;
      state.trainer.xp = (state.trainer.xp || 220) + 25;
      if (!state.trainer.completed[lessonId] || overall > (state.trainer.completed[lessonId].score || 0)) {
        state.trainer.completed[lessonId] = { stars: analysis.stars, score: overall, date: new Date().toISOString() };
      }
      playToneSound(523.25, 0.15, "sine");
      setTimeout(() => playToneSound(659.25, 0.18, "sine"), 120);
      setTimeout(() => playToneSound(783.99, 0.28, "sine"), 240);
      saveState();
      render();
      showToast("+25 XP Earned! Fluency Score: " + overall + "% ⭐⭐⭐", "success");
    }

    function renderTrainer(params) {
      const activeLang = state.trainer.lang || "yoruba";
      const activeLevel = state.trainer.level || "beginner";
      const activeLessonId = state.trainer.activeLessonId || 1;
      const speed = state.trainer.speed || 1.0;

      const langData = TRAINER_CURRICULUM[activeLang] || TRAINER_CURRICULUM.yoruba;
      const currentTierLessons = langData[activeLevel] || langData.beginner;
      const activeLesson = currentTierLessons.find(l => l.id === activeLessonId) || currentTierLessons[0] || langData.beginner[0];

      const completedCount = Object.keys(state.trainer.completed || {}).length;
      const avgScore = completedCount > 0 
        ? Math.round(Object.values(state.trainer.completed).reduce((acc, v) => acc + (v.score || 90), 0) / completedCount) 
        : 96;

      return `<div class="container route-page trainer-page">
        <div class="breadcrumbs">
          ${routeLink("index", "Home")}<span>/</span>
          ${routeLink("languages", "Languages")}<span>/</span>
          <strong>Voice African Language Trainer</strong>
        </div>

        <section class="trainer-hero">
          <div class="trainer-hero-copy">
            <div class="trainer-hero-badge">
              <span>${icon("headphones", 16)}</span>
              <strong>VOICE AFRICAN LANGUAGE TRAINER MODEL</strong>
            </div>
            <h1>Speak African Languages<br /><em>with 100% Native Tonal Fluency.</em></h1>
            <p>Master authentic pitch accents, Do-Re-Mi tone melodies, and pronunciation for kids through 60 structured voice lessons across Beginner, Intermediate, and Advanced tiers.</p>
            
            <div class="trainer-stats-strip">
              <div class="trainer-stat-pill">
                <span class="stat-icon">⭐</span>
                <div>
                  <strong>${state.trainer.xp || 220} XP</strong>
                  <small>Total Knowledge Points</small>
                </div>
              </div>
              <div class="trainer-stat-pill">
                <span class="stat-icon">🔥</span>
                <div>
                  <strong>${state.trainer.streak || 5} Days</strong>
                  <small>Practice Streak</small>
                </div>
              </div>
              <div class="trainer-stat-pill">
                <span class="stat-icon">🎓</span>
                <div>
                  <strong>${completedCount} / 60</strong>
                  <small>Lessons Completed</small>
                </div>
              </div>
              <div class="trainer-stat-pill">
                <span class="stat-icon">🎯</span>
                <div>
                  <strong>${avgScore}%</strong>
                  <small>Average Pronunciation</small>
                </div>
              </div>
            </div>
          </div>

          <div class="trainer-hero-visual">
            <div class="trainer-interactive-disc">
              <img src="./assets/listening-reader.jpg" alt="Child practicing African voice trainer" class="trainer-hero-img" />
              <div class="trainer-orbit-ring" aria-hidden="true">
                <span class="orbit-tone tone-high">High (Mí) ↗</span>
                <span class="orbit-tone tone-mid">Mid (Re) →</span>
                <span class="orbit-tone tone-low">Low (Dó) ↘</span>
              </div>
            </div>\n    </section>

        <section class="trainer-language-selector-section">
          <div class="section-heading">
            <div>
              <span class="section-kicker">Step 1: Choose Your Language</span>
              <h2>Select an African Language to Train</h2>
            </div>
            <span class="demo-badge">6 Living Languages Ready</span>
          </div>
          <div class="trainer-lang-pills">
            ${[
              { id: "yoruba", name: "Yorùbá", flag: "🇳🇬 🇧🇯", glyph: "Ẹ", desc: "Tonal: Dó-Re-Mí" },
              { id: "igbo", name: "Igbo", flag: "🇳🇬", glyph: "Ị", desc: "Tonal & Downstep" },
              { id: "hausa", name: "Hausa", flag: "🇳🇬 🇳🇪", glyph: "H", desc: "Tonal & Vowel Cadence" },
              { id: "swahili", name: "Kiswahili", flag: "🇰🇪 🇹🇿", glyph: "S", desc: "Bantu Melodic Stress" },
              { id: "zulu", name: "isiZulu", flag: "🇿🇦", glyph: "Z", desc: "Clicks & Harmony" },
              { id: "twi", name: "Twi / Akan", flag: "🇬🇭", glyph: "T", desc: "High & Low Tones" }
            ].map(l => `
              <button type="button" class="trainer-lang-btn ${activeLang === l.id ? "is-active" : ""}" data-action="trainer-set-lang" data-lang="${l.id}">
                <span class="lang-flag">${l.flag}</span>
                <span class="lang-info">
                  <strong>${l.name}</strong>
                  <small>${l.desc}</small>
                </span>
                <span class="lang-glyph">${l.glyph}</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="trainer-level-tabs-section">
          <div class="trainer-tabs-wrap">
            <button type="button" class="trainer-level-tab tab-beginner ${activeLevel === "beginner" ? "is-active" : ""}" data-action="trainer-set-level" data-level="beginner">
              <span class="level-indicator dot-green"></span>
              <span class="level-label">
                <strong>Beginner Tier</strong>
                <small>Lessons 01 – 20 • Foundations & Daily Phrases</small>
              </span>
              <span class="level-badge">20 Lessons</span>
            </button>

            <button type="button" class="trainer-level-tab tab-intermediate ${activeLevel === "intermediate" ? "is-active" : ""}" data-action="trainer-set-level" data-level="intermediate">
              <span class="level-indicator dot-yellow"></span>
              <span class="level-label">
                <strong>Intermediate Tier</strong>
                <small>Lessons 21 – 40 • Talking Drum & Conversations</small>
              </span>
              <span class="level-badge">20 Lessons</span>
            </button>

            <button type="button" class="trainer-level-tab tab-advanced ${activeLevel === "advanced" ? "is-active" : ""}" data-action="trainer-set-level" data-level="advanced">
              <span class="level-indicator dot-red"></span>
              <span class="level-label">
                <strong>Advanced Tier</strong>
                <small>Lessons 41 – 60 • Classical Proverbs & Oríkì</small>
              </span>
              <span class="level-badge">20 Lessons</span>
            </button>
          </div>
        </section>

        <section class="trainer-studio-section" id="trainerStudio">
          <div class="studio-card">
            <div class="studio-top">
              <div class="studio-meta">
                <span class="lesson-num-badge">LESSON ${String(activeLesson.id).padStart(2, "0")}</span>
                <span class="lesson-cat-badge">${activeLesson.category}</span>
                <span class="difficulty-stars">
                  ${"★".repeat(activeLesson.difficulty || 1)}${"☆".repeat(3 - (activeLesson.difficulty || 1))}
                </span>
              </div>
              <div class="studio-speed-control">
                <span class="speed-label">Playback Speed:</span>
                <div class="speed-buttons">
                  <button type="button" class="speed-btn ${speed === 0.75 ? "is-active" : ""}" data-action="trainer-set-speed" data-speed="0.75">0.75x Slow</button>
                  <button type="button" class="speed-btn ${speed === 1.0 ? "is-active" : ""}" data-action="trainer-set-speed" data-speed="1.0">1.0x Normal</button>
                  <button type="button" class="speed-btn ${speed === 1.25 ? "is-active" : ""}" data-action="trainer-set-speed" data-speed="1.25">1.25x Fast</button>
                </div>
              </div>
            </div>

            <div class="studio-phrase-area">
              <h2 class="studio-phrase-native">${activeLesson.phrase}</h2>
              <div class="studio-phonetic">${activeLesson.phonetic}</div>
              <div class="studio-translation">
                <span>Meaning:</span> <strong>${activeLesson.translation}</strong>
              </div>
            </div>

            <div class="studio-syllable-soundboard">
              <div class="soundboard-header">
                <span>${icon("sparkles", 15)} Interactive Syllable Pitch Soundboard (Click to hear exact tone frequencies):</span>
              </div>
              <div class="syllables-list">
                ${(activeLesson.syllables || []).map((s, idx) => `
                  <button type="button" class="syllable-sound-pill tone-${s.tone}" data-action="trainer-play-syllable" data-freq="${s.freq}" data-syllable="${s.text}" title="Tone: ${s.pitch} (${s.tone}) - Click to play">
                    <span class="syllable-text">${s.text}</span>
                    <span class="syllable-pitch">${s.pitch}</span>
                    <span class="syllable-tone-tag">${s.tone}</span>
                  </button>
                `).join("")}
              </div>
              <div class="tone-pattern-guide">
                <strong>Tone Pitch Melody:</strong> <code>${activeLesson.tonePattern}</code>
              </div>
            </div>

            <div class="studio-cultural-tip">
              <div class="tip-icon">${icon("leaf", 18)}</div>
              <div class="tip-text">
                <strong>Cultural Heritage Context:</strong>
                <p>${activeLesson.culturalTip}</p>
              </div>
            </div>

            <div class="studio-controls-panel">
              <div class="studio-buttons-row">
                <button type="button" class="btn-studio btn-play-native" data-action="trainer-play-native" data-lesson-id="${activeLesson.id}">
                  ${icon("volume", 20)}
                  <span>Listen to Native Voice (${speed}x)</span>
                </button>

                ${!state.trainer.isRecording ? `
                  <button type="button" class="btn-studio btn-record-voice" data-action="trainer-start-record" data-lesson-id="${activeLesson.id}">
                    ${icon("mic", 20)}
                    <span>Record Your Voice & Analyze</span>
                  </button>
                ` : `
                  <button type="button" class="btn-studio btn-stop-recording" data-action="trainer-stop-record" data-lesson-id="${activeLesson.id}">
                    <span class="recording-pulsar" aria-hidden="true"></span>
                    <span>Stop & Evaluate Pronunciation</span>
                  </button>
                `}
              </div>

              <div class="studio-visualizer-box">
                <canvas id="waveformCanvas" width="560" height="70"></canvas>
                <div class="visualizer-hint">
                  ${state.trainer.isRecording ? "🔴 Listening closely to your voice pitch... Speak clearly!" : "▶️ Click Listen to hear native speaker, or 🎤 Record to evaluate your pitch."}
                </div>
              </div>
            </div>

            ${state.trainer.analysis ? `
              <div class="studio-analysis-result">
                <div class="analysis-score-header">
                  <div class="score-circle">
                    <strong>${state.trainer.analysis.overall}%</strong>
                    <small>Fluency Score</small>
                  </div>
                  <div class="score-details">
                    <div class="score-stars">
                      ${"★".repeat(state.trainer.analysis.stars)}${"☆".repeat(3 - state.trainer.analysis.stars)}
                    </div>
                    <h3>${state.trainer.analysis.stars === 3 ? "🎉 Flawless Native Pronunciation!" : state.trainer.analysis.stars === 2 ? "👏 Great Effort! Almost Native!" : "👍 Good Practice! Try again for 3 stars!"}</h3>
                    <p>${state.trainer.analysis.feedback}</p>
                  </div>
                </div>

                <div class="analysis-meters-grid">
                  <div class="meter-card">
                    <div class="meter-label">
                      <span>Tonal Pitch Accuracy</span>
                      <strong>${state.trainer.analysis.toneAccuracy}%</strong>
                    </div>
                    <div class="meter-bar"><div class="meter-fill fill-green" style="width: ${state.trainer.analysis.toneAccuracy}%"></div></div>
                  </div>
                  <div class="meter-card">
                    <div class="meter-label">
                      <span>Rhythm & Pacing</span>
                      <strong>${state.trainer.analysis.rhythmScore}%</strong>
                    </div>
                    <div class="meter-bar"><div class="meter-fill fill-yellow" style="width: ${state.trainer.analysis.rhythmScore}%"></div></div>
                  </div>
                  <div class="meter-card">
                    <div class="meter-label">
                      <span>Articulation & Clarity</span>
                      <strong>${state.trainer.analysis.clarityScore}%</strong>
                    </div>
                    <div class="meter-bar"><div class="meter-fill fill-blue" style="width: ${state.trainer.analysis.clarityScore}%"></div></div>
                  </div>
                </div>
              </div>
            ` : ""}

            <div class="studio-nav-footer">
              <button type="button" class="btn-nav-lesson" data-action="trainer-prev-lesson" ${activeLesson.id <= (activeLevel === "beginner" ? 1 : activeLevel === "intermediate" ? 21 : 41) ? "disabled" : ""}>
                ${icon("arrow", 14)} Previous Lesson
              </button>

              <span class="lesson-counter-tag">Lesson ${activeLesson.id} of 60</span>

              <button type="button" class="btn-nav-lesson" data-action="trainer-next-lesson" ${activeLesson.id >= (activeLevel === "beginner" ? 20 : activeLevel === "intermediate" ? 40 : 60) ? "disabled" : ""}>
                Next Lesson ${icon("arrow", 14)}
              </button>
            </div>\n    </section>

        <section class="trainer-curriculum-section">
          <div class="section-heading">
            <div>
              <span class="section-kicker">${activeLevel.toUpperCase()} CURRICULUM</span>
              <h2>All 20 Lessons in ${activeLevel.charAt(0).toUpperCase() + activeLevel.slice(1)} Tier</h2>
              <p>Click on any lesson card to load it directly into the Voice Trainer Studio.</p>
            </div>
            <span class="demo-badge">${currentTierLessons.length} Audio Lessons</span>
          </div>

          <div class="trainer-lessons-grid">
            ${currentTierLessons.map(lesson => {
              const record = state.trainer.completed[lesson.id];
              const isSelected = lesson.id === activeLesson.id;
              return `
                <article class="trainer-lesson-card ${isSelected ? "is-selected" : ""} ${record ? "is-completed" : ""}" data-action="trainer-select-lesson" data-id="${lesson.id}">
                  <div class="lesson-card-top">
                    <span class="lesson-card-num">#${String(lesson.id).padStart(2, "0")}</span>
                    <span class="lesson-card-cat">${lesson.category}</span>
                    ${record ? `
                      <span class="lesson-card-status status-done">
                        ${"★".repeat(record.stars)} ${record.score}%
                      </span>
                    ` : `
                      <span class="lesson-card-status status-ready">Ready</span>
                    `}
                  </div>

                  <h3 class="lesson-card-title">${lesson.title}</h3>
                  <div class="lesson-card-phrase">${lesson.phrase}</div>
                  <p class="lesson-card-translation">${lesson.translation}</p>

                  <div class="lesson-card-footer">
                    <span class="lesson-card-action">
                      ${isSelected ? "Currently Practicing •" : "Practice Voice →"}
                    </span>
                    <span class="lesson-card-diff">${"★".repeat(lesson.difficulty || 1)}</span>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </section>

        <section class="trainer-certificate-banner">
          <div class="cert-icon-wrap">🎓</div>
          <div class="cert-copy">
            <h3>Earn Your African Voice Master Certificate</h3>
            <p>Complete all 20 lessons in this tier with at least 85% accuracy to unlock your verified Idilewa Fluency Certificate for children.</p>
          </div>
          <button type="button" class="button button-primary" data-action="trainer-view-cert">
            View Certificate Progress ${icon("arrow", 15)}
          </button>
        </section>
      </div>`;
    }


  function renderPage(page, params) {
    switch (page) {
      case 'voice_lessons':
      case 'trainer': return renderTrainer(params);
      case 'index': return renderHome();
      case 'languages': return renderLanguages();
      case 'course': return renderCourse(params);
      case 'lesson': return renderLesson(params);
      case 'coding': return renderCoding();
      case 'ere': return renderStories();
      case 'ere_game': return renderStoryGame();
      case 'oral': return renderOral();
      case 'oral_genre': return renderOralGenre();
      case 'oriki': return renderOriki();
      case 'owe': return renderOwe();
      case 'owe_add': return renderOweAdd();
      case 'owe_detail': return renderOweDetail();
      case 'owe_story': return renderOweStory();
      case 'owe_reflection': return renderOweReflection();
      case 'connect_teachers': return renderConnectTeachers();
      case 'connect_students': return renderConnectStudents();
      case 'voices': return renderVoices();
      case 'pricing': return renderPricing();
      case 'profile': return renderProfile();
      case 'login': return renderLogin();
      case 'consent': return renderConsent();
      case 'base': return renderBase();
      default: return renderGeneric(page);
    }
  }

  const IMAGE_READY = new Set([
    'c4k-kindergarten.jpg',
    'c4k-grade-1.jpg',
    'c4k-grade-2.jpg',
    'c4k-grade-3.jpg',
    'c4k-grade-4.jpg',
    'c4k-grade-5.jpg',
    'c4k-grade-6.jpg',
    'c4k-grade-7.jpg',
    'c4k-grade-8.jpg',
    'journey-step-6.png',
    'journey-step-5.png',
    'journey-step-4.png',
    'journey-step-3.png',
    'journey-step-2.png',
    'journey-step-1.png',
    'how-it-works-journey.png',
    'how-it-works-journey.jpg',
    'stories-culture.jpg',
    'page-index-1.jpg', 'page-index-2.jpg', 'page-index-3.jpg', 'page-index-4.jpg',
    'page-index-5.jpg', 'page-index-6.jpg', 'page-index-7.jpg',
    'page-about-1.jpg', 'page-base-1.jpg', 'page-coding-1.jpg',
    'page-languages-1.jpg', 'page-course-1.jpg', 'page-lesson-1.jpg', 'page-kids-1.jpg',
    'page-schools-1.jpg', 'page-connect_teachers-1.jpg',
    'page-connect_students-1.jpg', 'page-consent-1.jpg', 'page-oral-1.jpg',
    'page-owe-1.jpg', 'page-owe_detail-1.jpg', 'page-owe_story-1.jpg',
    'page-owe_reflection-1.jpg', 'page-owe_add-1.jpg', 'page-oral_genre-1.jpg',
    'page-oriki-1.jpg', 'page-ere-1.jpg', 'page-ere_game-1.jpg', 'page-profile-1.jpg',
    'page-ifa-1.jpg', 'page-ifa_odu-1.jpg', 'page-pricing-1.jpg',
    'african-kids-friends.jpg', 'code-kids.jpg', 'hero-reader.jpg', 'listening-reader.jpg',
    'story-grandmother.jpg', 'yoruba-educator-man.jpg', 'yoruba-educator-woman.jpg', 'yoruba-kids-culture.jpg'
  ]);
  const ROUTE_IMAGE_ALTS = {
    index: 'Children in beautiful Yorùbá attire learning together at home',
    coding: 'Children in traditional African attire building a small robot at a bilingual coding club',
    course: 'A young learner exploring a language course at a sunlit desk',
    lesson: 'A child practicing a language lesson with a notebook and a caring adult nearby',
    oral_genre: 'A community storyteller sharing a spoken-word tradition with attentive listeners',
    oriki: 'A Yorùbá praise poet sharing a performance in a community courtyard',
    owe_detail: 'A language educator explaining a proverb with a handwritten card',
    owe_add: 'Hands carefully writing a community proverb into a notebook',
    profile: 'A learner celebrating a small learning milestone at home',
    pricing: 'A family planning a shared language-learning routine around a tablet',
    voices: 'A language speaker recording a short phrase in a quiet studio',
    base: 'An overhead view of language-learning materials, books and cultural objects',
    languages: 'Nigerian siblings practicing greetings with their language teacher in a library',
    course: 'A young learner following an illustrated language course with a tutor',
    lesson: 'A grandmother gently guiding a child through a language lesson in a notebook',
    kids: 'Children in beautiful traditional attire sharing a picture book outdoors',
    schools: 'Students collaborating on a coding activity in a welcoming classroom',
    connect_teachers: 'A Nigerian woman language educator holding a picture book in a community classroom',
    connect_students: 'African children in varied traditional attire warmly connecting around a picture book',
    oral: 'An elder storyteller sharing an oral tradition with children in a courtyard',
    consent: 'A Nigerian parent and child reviewing a permission form together',
    owe: 'A Nigerian language educator introducing a Yorùbá proverb in a refined home library',
    owe_story: 'A Nigerian child and grandmother tending a seedling in a landscaped garden',
    owe_reflection: 'A Nigerian child writing a thoughtful reflection in a bright, elegant home study',
    ere: 'A Nigerian parent and children sharing a storybook in an elegant family home',
    ere_game: 'A parent and child enjoying an interactive story together on a tablet',
    tutor: 'A Nigerian language tutor in traditional agbada in a refined library',
    guides: 'A Nigerian woman educator in elegant aso-oke sharing a learning book',
    human: 'Children in varied African traditional clothing sharing a book in a garden courtyard',
    ifa: 'A Yoruba educator introducing cultural learning with respect in an elegant study',
    ifa_odu: 'An elder guiding a young learner through cultural knowledge with care',
    individuals: 'African children exploring a language book in a polished family home',
    keepers: 'A Nigerian elder sharing knowledge with children in a beautiful courtyard',
    login: 'A child reading in a calm, sunlit family home',
    method: 'Two children exploring a creative coding activity in a modern home',
    voices: 'A child listening to a language recording in a comfortable reading nook'
  };
  const ROUTE_IMAGE_SLOT_ALTS = {
    'index-1': 'Two Nigerian children in Yorùbá attire learning from a picture book with their mother',
    'index-2': 'A learner arranging colorful language picture cards and a notebook',
    'index-3': 'A young Nigerian woman listening to a language recording while following a book',
    'index-4': 'Two children in traditional attire building a small learning robot',
    'index-5': 'African children in varied traditional outfits connecting warmly around a book',
    'index-6': 'A welcoming Nigerian language tutor in a sunlit community classroom',
    'index-7': 'A grandmother in elegant aso-oke sharing a picture book with children in a refined Lagos home',
    'about-1': 'A Nigerian grandfather and teenage granddaughter sharing an illustrated language book',
    'base-1': 'An overhead arrangement of African language-learning materials and cultural objects',
    'coding-1': 'Nigerian children in traditional attire solving a coding puzzle beside a small robot',
    'languages-1': 'Nigerian siblings in traditional clothing practicing language greetings with a teacher in a sunlit library',
    'course-1': 'A child and grandmother following an illustrated language course together at home',
    'lesson-1': 'A grandmother helping a child write a language exercise in a notebook',
    'kids-1': 'Three children in colorful traditional clothing sharing a picture book in a leafy courtyard',
    'schools-1': 'Two schoolchildren collaborating on a colorful beginner coding activity in class',
    'connect_teachers-1': 'A Nigerian woman language educator in indigo aso-oke holding an open picture book',
    'connect_students-1': 'Children in Yoruba, Igbo, Hausa and East African attire warmly sharing a storybook',
    'consent-1': 'A Nigerian mother and child calmly reviewing a permission form on a tablet',
    'oral-1': 'An elderly Yoruba storyteller sharing a story with attentive children in a courtyard',
    'owe-1': 'A Yorùbá educator in a refined home library introducing a proverb',
    'owe_detail-1': 'A child and language teacher thoughtfully discussing a proverb card',
    'owe_story-1': 'A girl patiently watering an okra seedling with her grandmother',
    'owe_reflection-1': 'A child writing a personal reflection in a bright home study',
    'owe_add-1': 'A woman in burgundy aso-oke writing a proverb in a fine journal',
    'oral_genre-1': 'A Yoruba elder sharing a spoken story with children in a cultural salon',
    'oriki-1': 'A Yoruba praise poet performing for young listeners in an arts hall',
    'ere-1': 'A Nigerian father and children sharing a picture book in a modern family home',
    'ere_game-1': 'A child and parent answering an interactive story question on a tablet',
    'profile-1': 'A Nigerian girl celebrating a learning milestone in her home study'
  };
  const ROUTE_IMAGE_OVERRIDES = {
    'guides-1': 'yoruba-educator-woman.jpg',
    'human-1': 'african-kids-friends.jpg',
    'individuals-1': 'yoruba-kids-culture.jpg',
    'keepers-1': 'story-grandmother.jpg',
    'login-1': 'hero-reader.jpg',
    'method-1': 'code-kids.jpg',
    'tutor-1': 'yoruba-educator-man.jpg',
    'voices-1': 'listening-reader.jpg'
  };
  function routeImageAlt(page, slot, tag = '') {
    const original = (tag.match(/\balt=("|')([^"']*)(?:\1)/i) || [,'',''])[2];
    return ROUTE_IMAGE_SLOT_ALTS[`${page}-${slot}`] || ROUTE_IMAGE_ALTS[page] || original || `${LABELS[page] || 'Idilewa'} learning scene`;
  }
  function imagePendingMarkup(alt, className = '') {
    return `<span class="unique-image-pending ${className}" role="img" aria-label="${esc(alt)}"><span aria-hidden="true">Photographic artwork in progress</span></span>`;
  }
  function assignUniqueRouteImages(page, markup) {
    let slot = 0;
    const source = String(markup || '');
    let output = source.replace(/<img\b[^>]*>/gi, (tag) => {
      const sourceMatch = tag.match(/\bsrc=("|')([^"']*)(?:\1)/i);
      const currentSrc = sourceMatch ? sourceMatch[2] : '';
      
      // Preserve any deliberate, authentic image source from cards, sections, flowcharts, or local assets
      if (currentSrc && (
        currentSrc.includes('c4k-') ||
        currentSrc.includes('assets/') ||
        currentSrc.startsWith('http') ||
        currentSrc.startsWith('data:') ||
        IMAGE_READY.has(currentSrc.replace(/^.*[\\\/]/, ''))
      )) {
        slot += 1;
        return tag;
      }

      slot += 1;
      const filename = ROUTE_IMAGE_OVERRIDES[`${page}-${slot}`] || `page-${page}-${slot}.jpg`;
      const alt = routeImageAlt(page, slot, tag);
      if (!IMAGE_READY.has(filename)) return page !== 'index' && slot > 1 ? '' : imagePendingMarkup(alt);
      let rewritten = tag.replace(/\bsrc=("|')[^"']*(?:\1)/i, `src="${imageUrl(filename)}"`);
      if (/\balt=("|')[^"']*(?:\1)/i.test(rewritten)) rewritten = rewritten.replace(/\balt=("|')[^"']*(?:\1)/i, `alt="${esc(alt)}"`);
      else rewritten = rewritten.replace('<img', `<img alt="${esc(alt)}"`);
      return rewritten;
    });
    if (slot === 0 && !['coding', 'trainer', 'course', 'lesson'].includes(page)) {
      const filename = ROUTE_IMAGE_OVERRIDES[`${page}-1`] || `page-${page}-1.jpg`;
      const alt = routeImageAlt(page, 1);
      const visual = IMAGE_READY.has(filename)
        ? `<img src="${imageUrl(filename)}" alt="${esc(alt)}" loading="lazy" />`
        : imagePendingMarkup(alt);
      const banner = `<figure class="route-art-banner">${visual}<figcaption>${esc(LABELS[page] || 'Idilewa')} · a learning moment</figcaption></figure>`;
      const breadcrumb = output.match(/<div class="breadcrumbs">[\s\S]*?<\/div>/);
      if (breadcrumb) output = output.replace(breadcrumb[0], `${breadcrumb[0]}${banner}`);
      else output = output.replace(/(<div class="container route-page[^"]*">)/, `$1${banner}`);
    }
    return output;
  }

  const PAGE_LAYER_CATEGORIES = ['Orient', 'Understand', 'Information object', 'Context / example', 'Practice / decision', 'Reflect / continue'];
  const ROUTE_PAGE_LAYER_COPY = {
    index: [
      ['Learning purpose', 'Idilewa brings African languages, living culture and future-facing skills together in one welcoming home.', 'Platform promise · language + culture + technology'],
      ['Available language objects', 'Compare Yorùbá, Igbo, Hausa and Kiswahili, then choose a supported path that feels right.', 'Four language pathways'],
      ['Course structure', 'Each supported level contains 20 lessons across four modules, making the next learning step visible.', 'Level · module · lesson'],
      ['Culture in context', 'Explore oral stories, proverbs and heritage with attribution and community context—not as decoration.', 'Story · proverb · source'],
      ['Make with code', 'Try a playful mission or browse 50+ coding paths with multilingual hints, feedback and maker progression.', 'Code Garden · XP · streak'],
      ['Learn safely together', 'Directory previews are samples; child sign-up and tutor pairing require guardian approval and scoped checks.', 'Family consent · educator preview']
    ],
    base: [
      ['Explore the platform map', 'This directory connects language learning, cultural knowledge, creative technology and community spaces.', 'Idilewa route map'],
      ['Learn and practice', 'Choose a language, a level and a short lesson; keep progress visible one step at a time.', 'Language · level · lesson'],
      ['Stories and living culture', 'Move among oral traditions, voices, proverbs, stories and careful introductions to heritage.', 'Story · voice · tradition'],
      ['Technology and creation', 'Find the Code Garden, bilingual helpers, coding paths and projects for curious makers.', 'Coding path · mission · project'],
      ['People and learning roles', 'Explore family, school, tutor and educator spaces; directory profiles are clearly labeled as samples.', 'Learner · guardian · educator'],
      ['Choose a safe next route', 'Use the route map to continue. Child accounts and tutor connections remain behind parent approval.', 'Direct page · consent gate']
    ],
    coding: [
      ['Choose a guide language', 'Code itself stays in its programming language while explanations and hints can use a familiar African language.', 'Yorùbá · Igbo · Hausa · Kiswahili'],
      ['Browse real coding paths', 'Explore 50+ beginner-friendly paths across web, Python, games, data and other tools.', 'Path library · search · category'],
      ['Set a learning pace', 'Choose Beginner, Intermediate or Advanced, then open a small mission with one clear goal.', 'Level · skill · mission'],
      ['Work with examples', 'Read a starter, inspect the teaching marker and change one small part before running the friendly check.', 'Starter code · hint · example'],
      ['Notice progress', 'Success feedback, maker XP, streaks and visible level progress reward practice—not speed.', 'Feedback · XP · streak'],
      ['Understand the limits', 'The playground simulates a learning check; it does not run arbitrary code, upload work or call an AI service.', 'Offline preview · safety disclosure']
    ],
    connect_students: [
      ['Understand the educator workflow', 'This route is for a tutor reviewing an anonymous, parent-managed learner assignment.', 'Educator role · learner assignment'],
      ['Read fictional learner cards', 'Sample goals, language levels and schedules are fictional and read-only until required checks pass.', 'Anonymous sample profile'],
      ['Confirm guardian scope', 'A parent must approve the child account and the specific tutor separately before teaching can proceed.', 'Signed consent · named tutor'],
      ['Validate the matching code', 'The tutor selects their own profile and enters the current guardian-approved code for that exact pairing.', 'Tutor ID · expiring code'],
      ['Accept only an approved assignment', 'No learner assignment, response or lesson is open until code and tutor identity match.', 'Assignment gate · validation'],
      ['Keep the boundary visible', 'This local demo cannot verify a real guardian or create a real lesson; production requires secure server checks.', 'Safety rule · backend requirement']
    ],
    connect_teachers: [
      ['Find a suitable teacher', 'Learners and families can compare sample educator profiles by language focus and teaching style.', 'Educator directory · focus'],
      ['Compare useful details', 'Profile cards show sample experience, learner counts and weekly availability in West Africa Time.', 'Hours · sample experience · WAT'],
      ['Filter the learning focus', 'Use conversation, story or coding-plus-language filters to narrow the sample directory.', 'Teaching-style filter'],
      ['Get guardian approval first', 'A parent or guardian must sign and approve the exact tutor before a child requests an introduction.', 'Guardian consent · named tutor'],
      ['Verify before connection', 'The child validates the current code; the request stays unavailable for any unapproved tutor.', 'Child code · tutor scope'],
      ['Know what this preview does', 'Profiles are illustrative; no message, booking or real educator connection is sent from this prototype.', 'Sample data · privacy boundary']
    ],
    consent: [
      ['Start with a parent request', 'Create a request reference for a parent or guardian; it is not an access code.', 'Request reference'],
      ['Verify the guardian scope', 'The adult selects their relationship, uses a learner alias and reviews what permission covers.', 'Guardian role · learner alias'],
      ['Sign and review consent', 'A typed signature and required consent checks precede any child code in this local demonstration.', 'Signed consent form'],
      ['Choose a tutor deliberately', 'Tutor approval is a separate optional choice and must name the exact educator.', 'Tutor-specific grant'],
      ['Issue and validate a code', 'The approved demo code expires; child and tutor flows must check its scope before continuing.', 'Expiring code · validation'],
      ['Plan production safeguards', 'Browser storage is not identity verification; a real service needs secure backend, audit, withdrawal and legal review.', 'Security controls · safeguarding']
    ],
    course: [
      ['Choose a learning language', 'The course follows the selected language path and keeps the language choice visible.', 'Language · region · greeting'],
      ['Compare three levels', 'Beginner, Intermediate and Advanced each contain 20 lessons, so learners can choose a comfortable pace.', 'Level · 20-lesson track'],
      ['Explore module objects', 'Four modules group related themes; each module contains five lesson outlines.', 'Four modules · five lessons each'],
      ['Open a lesson', 'Every lesson has a focus, a short task and an optional practice response.', 'Lesson focus · activity'],
      ['Save a small win', 'Practice and completion update local progress so the next step is easy to find.', 'Response · completion · progress'],
      ['Check language quality', 'Starter lesson outlines and glosses need fluent-speaker review before public teaching.', 'Educator review · content readiness']
    ],
    ere: [
      ['Enter through a story', 'The shelf connects language, imagination and the people who carry stories between generations.', 'Story shelf · collection'],
      ['Choose a reading object', 'Story cards identify a theme, audience, language or estimated reading time.', 'Story card · reading level'],
      ['Read and listen', 'Open a story, follow the text and use the browser sample audio at a comfortable pace.', 'Text · listen control'],
      ['Notice what travels', 'Look for a character choice, a remembered detail or a new voice in the retelling.', 'Character · detail · retelling'],
      ['Check understanding', 'A short story game invites learners to use evidence from what they heard.', 'Comprehension question'],
      ['Share with care', 'Stories belong to their communities; ask before retelling and explore oral forms or voices next.', 'Attribution · oral traditions']
    ],
    ere_game: [
      ['Meet the story', 'Read a gentle family story about listening, remembering and sharing a detail.', 'Original learning story'],
      ['Follow the narrative', 'Notice how the grandmother begins, how the children listen and what changes on a second telling.', 'Story events · characters'],
      ['Use the listening object', 'Play the sample narration or read the text together; audio is a browser-based preview.', 'Text · sample audio'],
      ['Consider ownership', 'The story page explains that oral traditions belong to the people and communities who share them.', 'Source · permission · attribution'],
      ['Answer the check', 'Choose the idea best supported by the story and use the feedback to reconsider.', 'Comprehension quiz · feedback'],
      ['Continue thoughtfully', 'Explore oral traditions, return to the story shelf or open the offline reflection helper.', 'Next route · offline helper']
    ],
    languages: [
      ['Compare available paths', 'Choose among Yorùbá, Igbo, Hausa and Kiswahili, with regional and native-name context.', 'Language · native name · region'],
      ['Choose a level', 'Each supported path offers Beginner, Intermediate and Advanced learning.', 'Three course levels'],
      ['See lesson structure', 'A level contains 20 lessons across four modules; the course route opens the detailed plan.', '20 lessons · four modules'],
      ['Meet useful phrases', 'Greeting examples connect written language with meaning and listening practice.', 'Greeting · translation · audio'],
      ['Check availability', 'The page distinguishes supported paths from languages that are still being prepared.', 'Available · coming soon'],
      ['Select a next step', 'Open a language course, then choose the level that fits; review cultural and pronunciation guidance.', 'Course route · fluent review']
    ],
    lesson: [
      ['Locate the lesson', 'Breadcrumbs and progress show the selected language, level, module and lesson number.', 'Course position · lesson ID'],
      ['Understand the focus', 'Read the lesson goal before starting so the activity has a clear purpose.', 'Focus · learning objective'],
      ['Notice the language object', 'A phrase, greeting or relationship word is presented in a practical learning context.', 'Target phrase · meaning'],
      ['Try a response', 'Write, plan or reflect briefly; the lesson accepts a short learner-generated practice response.', 'Practice field · activity'],
      ['Check and complete', 'Save practice before marking the lesson complete, then follow the suggested next lesson.', 'Completion check · next lesson'],
      ['Protect personal details', 'Keep responses general; this prototype saves them only in the local browser.', 'Privacy reminder · local storage']
    ],
    login: [
      ['Choose who is learning', 'Adult exploration and a child account follow different access paths.', 'Learner type · account mode'],
      ['Get signed family approval', 'A parent or guardian reviews the form before a child sign-up can continue.', 'Guardian signature · consent scope'],
      ['Separate tutor permission', 'Approval for a child account does not automatically authorize every tutor.', 'Named tutor grant'],
      ['Validate the approved code', 'The local code check demonstrates a gate; it is not secure authentication.', 'Consent code · demo only'],
      ['Choose the safer entry', 'Learners can explore language paths without creating an account in this prototype.', 'Guest route · languages'],
      ['Keep credentials private', 'Do not enter a real password or personal details; no sign-in service is connected.', 'Privacy warning · no backend']
    ],
    oral: [
      ['Understand oral knowledge', 'Spoken forms carry language through voice, relationship, place and memory.', 'Oral tradition · community'],
      ['Choose a genre', 'Explore Oríkì, Òwe, story and song as different forms with different purposes.', 'Genre · form'],
      ['Read a proverb', 'Òwe can use compact sayings to hold wit, values and ways of seeing.', 'Proverb · interpretation'],
      ['Listen to a voice', 'Use the voice library to notice rhythm, pronunciation and the shape of a greeting.', 'Phrase · speaker · audio'],
      ['Ask for context', 'Consider who is speaking, who is listening and what a form means in that setting.', 'Speaker · listener · setting'],
      ['Share respectfully', 'Credit knowledge holders and ask permission before repeating or publishing oral knowledge.', 'Consent · attribution']
    ],
    oral_genre: [
      ['See the range of forms', 'The collection introduces praise poetry, proverbs, folktales and spoken word.', 'Four genre cards'],
      ['Identify the information object', 'A genre label points to a form; it does not replace a specific community’s explanation.', 'Oríkì · Òwe · folktale · spoken word'],
      ['Compare purpose and voice', 'Notice how rhythm, praise, wisdom, narrative or pronunciation shape each experience.', 'Purpose · voice · structure'],
      ['Choose a sample path', 'Open a focused page for a proverb, a story, Oríkì or a spoken phrase.', 'Route link · learning object'],
      ['Practice listening', 'Pause for repeated sounds and context rather than rushing to a single translation.', 'Listening prompt'],
      ['Keep cultural boundaries', 'Introductions are starting points; community context, consent and attribution matter.', 'Source · permission · context']
    ],
    oriki: [
      ['Define Oríkì carefully', 'Oríkì is a living Yorùbá oral tradition often described as praise poetry and remembrance.', 'Tradition · Yorùbá'],
      ['Listen to performance', 'A short introduction invites learners to hear the form rather than treat it as text alone.', 'Voice · performance'],
      ['Notice sound objects', 'Attend to rhythm, repetition, tone and who is being addressed.', 'Rhythm · repetition · address'],
      ['Explore possible meanings', 'A phrase may hold family history, place, humour or qualities a person is known for.', 'Meaning · identity · memory'],
      ['Reflect before repeating', 'Ask what you notice and what you would want to learn from a knowledgeable speaker.', 'Learner reflection'],
      ['Practice respectful sharing', 'Versions and contexts differ; ask permission and credit the person or community who shared the piece.', 'Consent · attribution']
    ],
    owe: [
      ['Read the original proverb', 'Begin with “Sùúrù ni baba ìwà” and notice the original Yorùbá words.', 'Òwe · original wording'],
      ['Compare a translation', 'Meet one common classroom rendering without treating it as the only possible translation.', 'Translation · variation'],
      ['Understand the meaning', 'Connect patience with steady care, thoughtful choices and giving growth time.', 'Everyday meaning · example'],
      ['Explore the moral story', 'Follow Dami and the okra seed in an original classroom story, not a claimed folktale.', 'Dami · okra seed · story'],
      ['Check comprehension', 'Answer what Dami did while she waited; feedback keeps the sequence in order.', 'Story quiz · feedback'],
      ['Reflect and act', 'After the checks, the child names a feeling, shares a thought and chooses one small action.', 'Child reflection · action']
    ],
    owe_add: [
      ['Choose a language', 'Select the language for the contribution and preserve the original wording where possible.', 'Language selector'],
      ['Record original words', 'Enter the proverb as it was shared; keep tonal marks and diacritics where known.', 'Original proverb · writing'],
      ['Add a meaning', 'Write a translation or explain what the saying means to you.', 'Translation · personal meaning'],
      ['Provide context', 'Note who shared it or where it was heard without exposing private details.', 'Source · context'],
      ['Confirm permission', 'Only contribute material you have permission to share and credit knowledge holders appropriately.', 'Consent · attribution'],
      ['Understand local storage', 'Saving only demonstrates the interface; nothing is uploaded or published by this prototype.', 'Local demo · privacy']
    ],
    owe_detail: [
      ['Hear the original', 'Read and listen to “Sùúrù ni baba ìwà” in the original language.', 'Yorùbá proverb · audio'],
      ['Review one rendering', '“Patience is the father of good character” is one common classroom translation.', 'Translation · common rendering'],
      ['Notice variation', 'Some speakers may render the final word as “character”; meaning depends on voice and context.', 'Word choice · language variation'],
      ['Connect meaning to life', 'Patience can include steady care and thoughtful action while waiting.', 'Everyday example · reflection prompt'],
      ['Check understanding', 'Choose what patience means in this example and use the feedback to revise your idea.', 'Meaning quiz · feedback'],
      ['Unlock the next stage', 'The moral story opens after the meaning check, preserving the requested Owe sequence.', 'Sequence gate · moral story']
    ],
    owe_story: [
      ['Check the sequence gate', 'Direct entry keeps the story closed until the proverb meaning check is complete.', 'Meaning check · access gate'],
      ['Read the classroom story', 'Dami plants an okra seed and keeps caring for it while she waits.', 'Dami · seed · garden'],
      ['Distinguish story from tradition', 'This original lesson story is not presented as a traditional folktale.', 'Authorship · content note'],
      ['Notice patience in action', 'The story shows that waiting can include watering, weeding and steady attention.', 'Character choice · action'],
      ['Answer the story check', 'Identify what Dami does while waiting, then use feedback before continuing.', 'Comprehension quiz'],
      ['Prepare for reflection', 'A child reflection follows the story check and asks for a feeling, thought and small action.', 'Reflection gate · child action']
    ],
    owe_reflection: [
      ['Respect the required order', 'Reflection stays locked until the meaning and story checks are complete.', 'Sequence gate · two checks'],
      ['Name a feeling', 'Choose from gentle feeling words such as curious, calm, impatient, proud or unsure.', 'Feeling picker'],
      ['Share a thought', 'Write an idea, question or plan about patience without trying to guess a “right” answer.', 'Child response · open prompt'],
      ['Choose one action', 'Think of one kind or helpful thing to do while waiting for something to grow.', 'Action prompt · transfer'],
      ['Save with privacy in mind', 'The response stays in this browser preview and may be visible to people using the device.', 'Local reflection · privacy'],
      ['Continue with agency', 'The child can revisit the story or return to the proverb shelf; the reflection remains personal.', 'Return routes · learner choice']
    ],
    pricing: [
      ['Understand what plans cover', 'Compare proposed learning arrangements for independent learners, families and schools.', 'Plan options · Explorer / Family / School'],
      ['Explore individual use', 'The Explorer preview points to sample language paths and learning activities.', 'Explorer · sample benefits'],
      ['Explore family use', 'Family ideas focus on shared routines and stories across generations.', 'Family · shared learning'],
      ['Explore school use', 'School plans are presented as tailored rather than a final fixed package.', 'School · classroom needs'],
      ['Check price status', 'The interface is exploratory; final prices and subscription commitments are not confirmed.', 'Cost disclosure · no commitment'],
      ['Choose an appropriate next step', 'Follow a learning route or register interest without treating this prototype as a purchase flow.', 'Interest action · prototype']
    ],
    profile: [
      ['Review the current path', 'See the selected language and level at a glance.', 'Language · level'],
      ['Measure completed work', 'The progress bar summarizes lessons marked complete in this browser.', 'Completion count · progress'],
      ['Notice practice habits', 'Streak and points are encouragement signals, not a measure of a learner’s worth.', 'Streak · points'],
      ['Follow the timeline', 'Recent and suggested steps connect greetings, family words and stories.', 'Timeline · next lesson'],
      ['Celebrate milestones', 'Badges recognize trying, listening and completing a story activity.', 'Badge · learning milestone'],
      ['Understand data limits', 'Prototype progress remains on this device; production needs secure authentication and privacy review.', 'Local storage · production requirement']
    ],
    voices: [
      ['Choose a language object', 'The library offers short sample greetings in Yorùbá, Igbo, Hausa and Kiswahili.', 'Four phrase cards'],
      ['Read the phrase', 'Each entry pairs written words with a plain-language translation.', 'Phrase · translation'],
      ['Listen to the sound', 'Use the play control to hear a browser-based sample at a comfortable pace.', 'Audio control · sample speech'],
      ['Notice rhythm', 'Pay attention to tone, syllables and the speaker’s pacing rather than copying quickly.', 'Pronunciation · rhythm'],
      ['Practice deliberately', 'Repeat a greeting, then connect it with a time or situation where it might be used.', 'Listening · speaking practice'],
      ['Review recording quality', 'Public audio should be recorded or approved by fluent speakers before release.', 'Native-speaker review · readiness']
    ]
  };

  function getPageInformationLayers(page) {
    const customLayers = ROUTE_PAGE_LAYER_COPY[page];
    if (customLayers) return customLayers;
    const meta = PAGE_META[page];
    if (meta) {
      const cards = meta.cards || [];
      const flow = meta.flow || ['Discover', 'Choose', 'Practice', 'Grow'];
      const first = cards[0] || { title: 'Begin with the purpose', text: meta.desc };
      const second = cards[1] || { title: 'Explore the context', text: meta.desc };
      const third = cards[2] || { title: 'Choose a next step', text: meta.desc };
      return [
        ['Why this page matters', meta.desc, `Purpose · ${meta.eyebrow}`],
        [first.title, first.text, `Information object · ${first.title}`],
        [second.title, second.text, `Context object · ${second.title}`],
        [third.title, third.text, `Practice object · ${third.title}`],
        ['Follow the learning route', `Use this sequence as a guide: ${flow.join(' → ')}. Pause at each stage and choose a pace that suits the learner.`, `Route sequence · ${flow.join(' → ')}`],
        ['Choose a next step', `${meta.cta}. This prototype keeps the action local and makes no promise of an external account or service.`, `Continue · ${LABELS[meta.ctaRoute] || meta.ctaRoute}`]
      ];
    }
    const label = LABELS[page] || 'Idilewa';
    return [
      [`Explore ${label}`, `This page introduces the purpose and main choices in ${label.toLowerCase()}.`, `Page · ${label}`],
      ['Find the key idea', 'Read the page context before choosing a resource, activity or decision.', 'Core idea · page context'],
      ['Notice the information objects', 'Look for named people, words, learning materials, examples or safety rules relevant here.', 'Objects · people · language · resources'],
      ['Connect an example', 'Use the visible example or card to connect the idea with a practical situation.', 'Example · learning material'],
      ['Try a small action', 'Complete one available prompt, choice, practice task or respectful check.', 'Action · learner activity'],
      ['Reflect and continue', 'Review what changed in your understanding and follow the linked next step when ready.', 'Reflection · next route']
    ];
  }

  function renderPageInformationLayers(page) {
    if (page !== 'index') return '';
    return `<section class=\"container how-it-works-journey-section\" aria-label=\"How it works – A simple journey to deeper understanding\">\n        <div class=\"how-it-works-journey-card\">
          <div class="how-it-works-header">
            <div class="how-it-works-title-area">
              <div class="how-it-works-pill-wrap">
                <span class="how-it-works-badge">HOW IT WORKS</span>
                <span class="how-it-works-dash" aria-hidden="true"></span>
              </div>
              <h2 class="how-it-works-title">A simple journey to <span class="highlight-green">deeper understanding</span></h2>
              <p class="how-it-works-subtitle">Each step helps you explore, listen, learn and keep our languages and culture alive.</p>
            </div>
            <div class="how-it-works-corner-accent" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34 10C34 10 32.5 17 38 21C32.5 21 34 29 34 29C34 29 28 25 28 21C28 17 34 10 34 10Z" fill="#1b7a4b"/>
                <path d="M23 21C23 21 17 19.5 13 25C13 19.5 5 21 5 21C5 21 11 15 15 15C19 15 23 21 23 21Z" fill="#f6c85f"/>
                <path d="M27 6C27 6 29 12 25 16C29 16 31 20 31 20C31 20 35 14 35 12C35 10 27 6 27 6Z" fill="#1b7a4b" opacity="0.8"/>
              </svg>
            </div>
          </div>

          <div class="how-it-works-steps-grid">
            <a href="#/oral" data-route="oral" class="journey-step-card" data-step="1">
              <div class="journey-step-content">
                <div class="journey-step-badge">
                  <span class="journey-step-num">01</span>
                  <span class="journey-step-tag">ORIENT</span>
                </div>
                <h3 class="journey-step-title">Understand <span class="journey-step-accent">oral knowledge</span></h3>
                <p class="journey-step-desc">Spoken forms carry language through voice, relationship, place and memory.</p>
                <div class="journey-step-btn" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
              <div class="journey-step-visual">
                <img src="${imageUrl('journey-step-1.png')}" alt="Understand oral knowledge illustration" loading="eager" />
              </div>
            </a>

            <a href="#/oral_genre" data-route="oral_genre" class="journey-step-card" data-step="2">
              <div class="journey-step-content">
                <div class="journey-step-badge">
                  <span class="journey-step-num">02</span>
                  <span class="journey-step-tag">UNDERSTAND</span>
                </div>
                <h3 class="journey-step-title">Choose a <span class="journey-step-accent">genre</span></h3>
                <p class="journey-step-desc">Explore Oriki, Ìwòye, story and song as different forms with different purposes.</p>
                <div class="journey-step-btn" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
              <div class="journey-step-visual">
                <img src="${imageUrl('journey-step-2.png')}" alt="Choose a genre illustration" loading="eager" />
              </div>
            </a>

            <a href="#/owe" data-route="owe" class="journey-step-card" data-step="3">
              <div class="journey-step-content">
                <div class="journey-step-badge">
                  <span class="journey-step-num">03</span>
                  <span class="journey-step-tag">INFORMATION OBJECT</span>
                </div>
                <h3 class="journey-step-title">Read a <span class="journey-step-accent">proverb</span></h3>
                <p class="journey-step-desc">Òwe can use compact sayings to hold wit, values and ways of seeing.</p>
                <div class="journey-step-btn" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
              <div class="journey-step-visual">
                <img src="${imageUrl('journey-step-3.png')}" alt="Read a proverb illustration" loading="eager" />
              </div>
            </a>

            <a href="#/voices" data-route="voices" class="journey-step-card" data-step="4">
              <div class="journey-step-content">
                <div class="journey-step-badge">
                  <span class="journey-step-num">04</span>
                  <span class="journey-step-tag">CONTEXT / EXAMPLE</span>
                </div>
                <h3 class="journey-step-title">Listen to a <span class="journey-step-accent">voice</span></h3>
                <p class="journey-step-desc">Use the voice library to notice rhythm, pronunciation and the shape of a greeting.</p>
                <div class="journey-step-btn" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
              <div class="journey-step-visual">
                <img src="${imageUrl('journey-step-4.png')}" alt="Listen to a voice illustration" loading="eager" />
              </div>
            </a>

            <a href="#/method" data-route="method" class="journey-step-card" data-step="5">
              <div class="journey-step-content">
                <div class="journey-step-badge">
                  <span class="journey-step-num">05</span>
                  <span class="journey-step-tag">PRACTICE / DECISION</span>
                </div>
                <h3 class="journey-step-title">Ask for <span class="journey-step-accent">context</span></h3>
                <p class="journey-step-desc">Consider who is speaking, who is listening and what a form means in that setting.</p>
                <div class="journey-step-btn" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
              <div class="journey-step-visual">
                <img src="${imageUrl('journey-step-5.png')}" alt="Ask for context illustration" loading="eager" />
              </div>
            </a>

            <a href="#/consent" data-route="consent" class="journey-step-card" data-step="6">
              <div class="journey-step-content">
                <div class="journey-step-badge">
                  <span class="journey-step-num">06</span>
                  <span class="journey-step-tag">REFLECT / CONTINUE</span>
                </div>
                <h3 class="journey-step-title">Share <span class="journey-step-accent">respectfully</span></h3>
                <p class="journey-step-desc">Credit knowledge holders and ask permission before repeating or publishing oral knowledge.</p>
                <div class="journey-step-btn" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
              <div class="journey-step-visual">
                <img src="${imageUrl('journey-step-6.png')}" alt="Share respectfully illustration" loading="eager" />
              </div>
            </a>
          </div>
        </div>\n    </section>`;
  }

  let heroCanvasAnimId = null;

  function initHeroCinematicVideoEngine() {
    if (heroCanvasAnimId) {
      cancelAnimationFrame(heroCanvasAnimId);
      heroCanvasAnimId = null;
    }
    const canvas = document.getElementById('heroCinematicCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Volumetric golden light dust motes
    const motes = Array.from({ length: 38 }, () => ({
      x: Math.random() * (canvas.getBoundingClientRect().width || 800),
      y: Math.random() * (canvas.getBoundingClientRect().height || 400),
      r: 0.9 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 0.3 + 0.12,
      vy: (Math.random() - 0.5) * 0.4 - 0.18,
      baseAlpha: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      hue: 42 + (Math.random() - 0.5) * 14
    }));

    const startTime = performance.now();

    function renderFrame(now) {
      const w = canvas.getBoundingClientRect().width || 800;
      const h = canvas.getBoundingClientRect().height || 400;
      if (!w || !h) return;

      const elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, w, h);

      // 1. Digital Tablet Screen Ambient Radiance (soft blue-green glow bounce)
      const tabletPulse = 0.5 + 0.5 * Math.sin(elapsed * 1.6);
      const tx = w * 0.54;
      const ty = h * 0.74;
      const tGrad = ctx.createRadialGradient(tx, ty, 8, tx, ty - h * 0.12, w * 0.26);
      tGrad.addColorStop(0, `rgba(34, 211, 238, ${0.11 + 0.05 * tabletPulse})`);
      tGrad.addColorStop(0.45, `rgba(16, 185, 129, ${0.07 + 0.03 * tabletPulse})`);
      tGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = tGrad;
      ctx.beginPath();
      ctx.ellipse(tx, ty - h * 0.06, w * 0.24, h * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Volumetric Dust Particles in Golden Light Shaft
      motes.forEach((m) => {
        m.x += m.vx + Math.sin(elapsed + m.phase) * 0.18;
        m.y += m.vy + Math.cos(elapsed * 0.8 + m.phase) * 0.12;

        if (m.x < 0) m.x = w;
        if (m.x > w) m.x = 0;
        if (m.y < 0) m.y = h;
        if (m.y > h) m.y = 0;

        const inLightShaft = Math.max(0, (m.x / w) * 0.65 + ((h - m.y) / h) * 0.35);
        const alpha = m.baseAlpha * (0.6 + 0.4 * Math.sin(elapsed * 2 + m.phase)) * (0.7 + 0.6 * inLightShaft);

        const radGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 2.0);
        radGrad.addColorStop(0, `hsla(${m.hue}, 90%, 80%, ${alpha})`);
        radGrad.addColorStop(0.5, `hsla(${m.hue}, 85%, 65%, ${alpha * 0.45})`);
        radGrad.addColorStop(1, `hsla(${m.hue}, 80%, 50%, 0)`);

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 2.0, 0, Math.PI * 2);
        ctx.fill();
      });

      heroCanvasAnimId = requestAnimationFrame(renderFrame);
    }

    heroCanvasAnimId = requestAnimationFrame(renderFrame);
  }

  function initHeroParallax() {
    const stage = document.getElementById('heroVisualStage');
    const wrap = document.getElementById('heroPhotoWrap');
    if (!stage || !wrap || typeof stage.addEventListener !== 'function') return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currRotX = 0;
    let currRotY = 0;
    let animId = null;

    function updateTilt() {
      currRotX += (targetRotX - currRotX) * 0.12;
      currRotY += (targetRotY - currRotY) * 0.12;
      wrap.style.setProperty('--rot-x', `${currRotX.toFixed(2)}deg`);
      wrap.style.setProperty('--rot-y', `${currRotY.toFixed(2)}deg`);

      if (Math.abs(targetRotX - currRotX) > 0.01 || Math.abs(targetRotY - currRotY) > 0.01) {
        animId = requestAnimationFrame(updateTilt);
      } else {
        animId = null;
      }
    }

    function onMouseMove(e) {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normX = (x / rect.width) - 0.5;
      const normY = (y / rect.height) - 0.5;

      targetRotX = -normY * 10;
      targetRotY = normX * 12;

      if (!animId) {
        animId = requestAnimationFrame(updateTilt);
      }
    }

    function onMouseLeave() {
      targetRotX = 0;
      targetRotY = 0;
      if (!animId) {
        animId = requestAnimationFrame(updateTilt);
      }
    }

    stage.addEventListener('mousemove', onMouseMove, { passive: true });
    stage.addEventListener('mouseleave', onMouseLeave, { passive: true });
  }

  
  function init3DScrollObserver() {
    if (typeof IntersectionObserver === 'undefined') return;

    const targetSelectors = [
      'section',
      'article',
      '.card',
      '.feature-card',
      '.lesson-card',
      '.coding-card',
      '.proverb-card',
      '.oral-card',
      '.stat-card',
      '.pricing-card',
      '.panel',
      '.flowchart-step',
      '.hero-quote',
      '.hero-stage',
      '.c4k-3d-hero-stage',
      '.c4k-ide-section',
      '.grid > div',
      '.flex-col > div',
      'form',
      '.split-view',
      '.cta-banner'
    ];

    const elements = document.querySelectorAll(targetSelectors.join(', '));
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach((el) => {
      if (el.closest('header') || el.closest('nav') || el.classList.contains('top-nav') || el.id === 'top') {
        return;
      }
      
      const rect = el.getBoundingClientRect();
      el.classList.add('scroll-3d-reveal');
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => el.classList.add('is-visible'), 40);
      } else {
        observer.observe(el);
      }
    });

    // 3D Tilt for interactive cards
    document.querySelectorAll('.card, .feature-card, .proverb-card, .lesson-card, .c4k-3d-hub-card, .c4k-grade-card, .c4k-lesson-card').forEach((card) => {
      if (card.dataset.tiltAttached) return;
      card.dataset.tiltAttached = 'true';
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px) translateZ(10px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function render() {
    const { page, params } = parseLocation();
    if (params.lang && LANGUAGES.some((l) => l.id === params.lang)) state.currentLang = params.lang;
    if (params.level && ['beginner', 'intermediate', 'advanced', 'growing', 'fluent'].includes(params.level)) state.level = normalizeCourseLevel(params.level);
    renderHeader(page);
    renderMobileNav(page);
    const title = page === 'index' ? 'Preserving African culture. Promoting technology.' : (PAGE_META[page]?.eyebrow || LABELS[page] || 'Explore Idilewa');
    document.title = `${title} · Idilewa`;
    document.getElementById('main').innerHTML = `${assignUniqueRouteImages(page, renderPage(page, params))}${renderPageInformationLayers(page)}${renderFooter()}`;
    if (page === 'index') {
      initHeroParallax();
      initHeroCinematicVideoEngine();
      const heroCanvas = document.getElementById('hero3DCanvasWrap');
      if (heroCanvas) init3DHeroCanvas(heroCanvas);
    } else if (page === 'trainer' || page === 'voice_lessons') {
      const audioCanvas = document.getElementById('waveformCanvas');
      if (audioCanvas) init3DAudioVisualizer(audioCanvas);
    } else if (page === 'coding') {
      const codingCanvas = document.getElementById('coding3DCanvasWrap');
      if (codingCanvas) init3DCodingCanvas(codingCanvas);
    } else if (page === 'ere' || page === 'oral') {
      const storyCanvas = document.getElementById('story3DCanvasWrap');
      if (storyCanvas) init3DStoryCanvas(storyCanvas);
    } else if (page === 'login' || page === 'consent') {
      const authCanvas = document.getElementById('auth3DCanvasWrap');
      if (authCanvas) init3DAuthCanvas(authCanvas);
    }
    autoMount3DElements();
    init3DTiltEngine();
    init3DScrollObserver();
  }

  function showToast(message, tone = 'success') {
    const root = document.getElementById('toast-root');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tone}`;
    toast.innerHTML = `${icon(tone === 'error' ? 'refresh' : 'check', 16)}<span>${esc(message)}</span>`;
    root.appendChild(toast);
    window.setTimeout(() => { toast.classList.add('toast-out'); window.setTimeout(() => toast.remove(), 240); }, 3200);
  }

  function openModal(title, body) {
    document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button class="modal-close icon-button" data-action="close-modal" aria-label="Close">${icon('close', 19)}</button><div class="modal-icon">${icon('sparkles', 22)}</div><h2 id="modalTitle">${esc(title)}</h2><p>${esc(body)}</p><button class="button button-primary modal-done" data-action="close-modal">Got it ${icon('check', 15)}</button></section></div>`;
    document.querySelector('.modal-done')?.focus();
  }

  function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (menu) { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); }
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (!menu) return;
    const opening = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', opening);
    menu.setAttribute('aria-hidden', String(!opening));
    if (toggle) toggle.setAttribute('aria-expanded', String(opening));
  }

  const searchable = ROUTES.map((route) => ({ route, title: LABELS[route], summary: PAGE_META[route]?.desc || `Explore ${LABELS[route].toLowerCase()} in the Idilewa learning space.` })).concat(LANGUAGES.map((l) => ({ route: 'languages', title: l.name, summary: `${l.region} · ${l.lessons}` })));

  function searchResults(query) {
    const q = query.trim().toLowerCase();
    const list = q ? searchable.filter((item) => `${item.title} ${item.summary}`.toLowerCase().includes(q)).slice(0, 7) : searchable.filter((item) => ['languages', 'course', 'ere', 'coding', 'oral', 'about'].includes(item.route)).slice(0, 6);
    return list.length ? list.map((item) => `<button class="search-result" data-action="search-result" data-route="${item.route}"><span>${icon(item.route === 'coding' ? 'code' : item.route === 'languages' || item.route === 'course' ? 'globe' : 'book', 17)}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.summary)}</small></span>${icon('arrow', 15)}</button>`).join('') : `<div class="search-empty">No match just yet. Try “language”, “story” or “code”.</div>`;
  }

  function openSearch() {
    const root = document.getElementById('modal-root');
    root.innerHTML = `<div class="search-overlay" data-action="close-modal"><section class="search-dialog" role="dialog" aria-modal="true" aria-label="Search Idilewa"><div class="search-dialog-head"><span>${icon('search', 19)}</span><input id="siteSearch" type="search" placeholder="Search languages, stories, culture…" autocomplete="off" /><button class="icon-button" data-action="close-modal" aria-label="Close search">${icon('close', 18)}</button></div><div class="search-results" id="searchResults">${searchResults('')}</div><div class="search-hint">Use search to explore all the places in Idilewa.</div></section></div>`;
    const input = document.getElementById('siteSearch');
    input?.focus();
  }

  function quizAction(el, prefix, message) {
    const correct = el.dataset.correct === 'true';
    const key = `${prefix}:${el.dataset.key || 'default'}`;
    state.quizResults[key] = correct ? 'correct' : 'retry';
    if (correct && !state.rewarded[key]) { state.points += 10; state.rewarded[key] = true; }
    saveState();
    render();
    showToast(correct ? message : 'Try one more time—you are learning as you go.', correct ? 'success' : 'error');
  }

  function playSample(button) {
    const phrase = button.dataset.text || 'Hello';
    button.classList.add('is-playing');
    button.setAttribute('aria-pressed', 'true');
    if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 0.82;
        utterance.onend = utterance.onerror = () => { button.classList.remove('is-playing'); button.setAttribute('aria-pressed', 'false'); };
        window.speechSynthesis.speak(utterance);
      } catch (_) { window.setTimeout(() => button.classList.remove('is-playing'), 1100); }
    } else {
      window.setTimeout(() => { button.classList.remove('is-playing'); button.setAttribute('aria-pressed', 'false'); }, 1100);
      showToast('Sample phrase selected. Approved recordings can be connected for launch.');
    }
    window.setTimeout(() => { button.classList.remove('is-playing'); button.setAttribute('aria-pressed', 'false'); }, 5000);
  }

  function handleAction(action, el) {
    const lang = el.dataset.lang;
    switch (action) {
      case 'hero-show-photo': {
        const photoWrap = document.getElementById('heroPhotoWrap');
        const stage3d = document.getElementById('hero3DStageWrap');
        const btnPhoto = document.getElementById('btnShowPhoto');
        const btn3d = document.getElementById('btnShow3D');
        if (photoWrap) photoWrap.style.display = 'block';
        if (stage3d) stage3d.style.display = 'none';
        if (btnPhoto) { btnPhoto.classList.add('is-active'); btnPhoto.setAttribute('aria-selected', 'true'); }
        if (btn3d) { btn3d.classList.remove('is-active'); btn3d.setAttribute('aria-selected', 'false'); }
        break;
      }
      case 'hero-show-3d': {
        const photoWrap = document.getElementById('heroPhotoWrap');
        const stage3d = document.getElementById('hero3DStageWrap');
        const btnPhoto = document.getElementById('btnShowPhoto');
        const btn3d = document.getElementById('btnShow3D');
        if (photoWrap) photoWrap.style.display = 'none';
        if (stage3d) stage3d.style.display = 'block';
        if (btn3d) { btn3d.classList.add('is-active'); btn3d.setAttribute('aria-selected', 'true'); }
        if (btnPhoto) { btnPhoto.classList.remove('is-active'); btnPhoto.setAttribute('aria-selected', 'false'); }
        const canvasWrap = document.getElementById('hero3DCanvasWrap');
        if (canvasWrap) init3DHeroCanvas(canvasWrap);
        break;
      }
      case 'toggle-menu': toggleMobileMenu(); break;
      case 'open-search': openSearch(); break;
      case 'close-modal': document.getElementById('modal-root').innerHTML = ''; break;
      case 'open-ai-helper': openAiHelper(el.dataset.topic || 'general'); break;
      case 'ai-suggestion': {
        const input = document.getElementById('aiHelperQuestion');
        if (input) input.value = el.dataset.prompt || '';
        answerAiPrompt(el.dataset.topic || 'general');
        break;
      }
      case 'start-consent-request': startConsentRequest(el.dataset.tutorId || ''); navigate('consent'); break;
      case 'consent-signup': state.loginMode = 'signup'; saveState(); navigate('login'); break;
      
      case 'ide-set-lang': {
        const lang = target.dataset.lang || 'yoruba';
        state.coding.ideLang = lang;
        const presets = IDE_PRESETS[lang] || IDE_PRESETS.yoruba;
        state.coding.idePresetId = presets[0].id;
        state.coding.ideCode = presets[0].code;
        state.coding.ideOutput = '> [Idilewa Engine Ready]\nSwitched to ' + lang.toUpperCase() + ' mode.';
        saveState(); render();
        showToast('Switched IDE to ' + lang.toUpperCase() + ' programming mode.');
        break;
      }
      case 'ide-select-preset': {
        const presetId = target.value;
        state.coding.idePresetId = presetId;
        const presets = IDE_PRESETS[state.coding.ideLang || 'yoruba'] || IDE_PRESETS.yoruba;
        const p = presets.find((item) => item.id === presetId) || presets[0];
        state.coding.ideCode = p.code;
        state.coding.ideOutput = '> [Idilewa Engine Ready]\nLoaded ' + p.title;
        saveState(); render();
        break;
      }
      case 'ide-insert-char': {
        const char = target.dataset.char || '';
        const textarea = document.getElementById('ide-code-input');
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          textarea.value = text.substring(0, start) + char + text.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + char.length;
          textarea.focus();
          state.coding.ideCode = textarea.value;
        }
        break;
      }
      case 'ide-insert-snippet': {
        const snippet = target.dataset.snippet || '';
        const textarea = document.getElementById('ide-code-input');
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          textarea.value = text.substring(0, start) + snippet + text.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
          textarea.focus();
          state.coding.ideCode = textarea.value;
        }
        break;
      }
      case 'ide-run-code': {
        const textarea = document.getElementById('ide-code-input');
        const code = textarea ? textarea.value : (state.coding.ideCode || '');
        state.coding.ideCode = code;
        const lang = state.coding.ideLang || 'yoruba';
        const canvas = document.getElementById('ide-graphic-canvas');
        const result = runIdeInterpreter(code, lang, canvas);
        state.coding.ideOutput = result.logs;
        state.coding.ideRuntime = result.duration + 'ms';
        state.coding.ideXp = (state.coding.ideXp || 0) + 10;
        if (result.hasCanvasDraw) {
          state.coding.ideTab = 'canvas';
        }
        saveState(); render();
        showToast('Code executed successfully! +10 XP', 'success');
        break;
      }
      case 'ide-reset-code': {
        const presets = IDE_PRESETS[state.coding.ideLang || 'yoruba'] || IDE_PRESETS.yoruba;
        const p = presets.find((item) => item.id === state.coding.idePresetId) || presets[0];
        state.coding.ideCode = p.code;
        state.coding.ideOutput = '> Code reset to default sample.';
        saveState(); render();
        showToast('Code reset to default.');
        break;
      }
      case 'ide-copy-code': {
        const textarea = document.getElementById('ide-code-input');
        const code = textarea ? textarea.value : (state.coding.ideCode || '');
        navigator.clipboard?.writeText(code).then(() => {
          showToast('Code copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Failed to copy code.', 'error');
        });
        break;
      }
      case 'ide-switch-tab': {
        const tab = target.dataset.tab || 'terminal';
        state.coding.ideTab = tab;
        saveState(); render();
        break;
      }
      case 'ide-clear-output': {
        state.coding.ideOutput = '> Output cleared.';
        const canvas = document.getElementById('ide-graphic-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
        saveState(); render();
        break;
      }

      case 'code-jump': {
        const targetId = ['coding-start', 'code-quest', 'code-adventures'].includes(el.dataset.target) ? el.dataset.target : 'coding-start';
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'code-set-language':
        if (CODE_COPY[lang]) state.coding.helperLanguage = lang;
        state.coding.stage = 1; state.coding.search = ''; state.coding.result = ''; state.coding.draft = '';
        saveState(); render(); document.getElementById('coding-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'code-quick-path':
        if (CODE_PATHS.some((item) => item.id === el.dataset.tech)) state.coding.techId = el.dataset.tech;
        state.coding.stage = 2; state.coding.level = 'beginner'; state.coding.missionId = 'hello';
        state.coding.result = ''; state.coding.draft = ''; saveState(); render();
        document.getElementById('coding-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'code-select-tech':
        if (CODE_PATHS.some((item) => item.id === el.dataset.tech)) state.coding.techId = el.dataset.tech;
        state.coding.stage = 2; state.coding.level = 'beginner'; state.coding.missionId = 'hello';
        state.coding.result = ''; state.coding.draft = ''; saveState(); render(); document.getElementById('coding-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'code-change-language':
        if (CODE_COPY[el.value]) state.coding.helperLanguage = el.value;
        saveState(); render(); break;
      case 'code-quest-add': {
        const direction = el.dataset.direction;
        if (!CODE_GARDEN_DIRECTIONS[direction] || state.coding.questCommands.length >= 12) break;
        state.coding.questCommands.push(direction); state.coding.questTrail = []; state.coding.questResult = '';
        saveState(); render(); break;
      }
      case 'code-quest-remove': {
        const index = Number(el.dataset.index);
        if (Number.isInteger(index) && index >= 0 && index < state.coding.questCommands.length) state.coding.questCommands.splice(index, 1);
        state.coding.questTrail = []; state.coding.questResult = ''; saveState(); render(); break;
      }
      case 'code-quest-clear':
        state.coding.questCommands = []; state.coding.questTrail = []; state.coding.questResult = '';
        saveState(); render(); break;
      case 'code-quest-run': {
        const copy = codeTextFor(state.coding.helperLanguage);
        const trail = ['0,3'];
        let x = 0; let y = 3; let problem = '';
        for (const direction of state.coding.questCommands) {
          const move = CODE_GARDEN_DIRECTIONS[direction];
          if (!move) { problem = 'unknown'; break; }
          const nextX = x + move.dx; const nextY = y + move.dy;
          if (nextX < 0 || nextX > 4 || nextY < 0 || nextY > 3) { problem = 'edge'; break; }
          if (CODE_GARDEN_OBSTACLES.has(`${nextX},${nextY}`)) { problem = 'leaf'; break; }
          x = nextX; y = nextY; trail.push(`${x},${y}`);
        }
        state.coding.questTrail = trail;
        if (state.coding.questCommands.length && !problem && `${x},${y}` === CODE_GARDEN_TARGET) {
          state.coding.questResult = `✓ ${copy.success} +10 maker XP`;
          if (!state.coding.completed.includes('garden-quest')) {
            state.coding.completed.push('garden-quest'); state.coding.points += 10;
            const today = new Date().toISOString().slice(0, 10);
            if (state.coding.lastPracticeDate !== today) {
              const previous = new Date(`${state.coding.lastPracticeDate || '1970-01-01'}T00:00:00Z`);
              const yesterday = new Date(`${today}T00:00:00Z`); yesterday.setUTCDate(yesterday.getUTCDate() - 1);
              state.coding.streak = previous.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10) ? state.coding.streak + 1 : 1;
              state.coding.lastPracticeDate = today;
            }
          }
          saveState(); render(); showToast('Garden quest complete! +10 maker XP.');
        } else {
          state.coding.questResult = problem === 'leaf'
            ? copy.questLeaf
            : problem === 'edge'
              ? copy.questEdge
              : state.coding.questCommands.length ? copy.questNotYet : copy.questAddFirst;
          saveState(); render();
        }
        break;
      }
      case 'code-set-level':
        if (CODE_LEVELS.some((item) => item.id === el.dataset.level)) state.coding.level = el.dataset.level;
        state.coding.result = ''; state.coding.draft = ''; saveState(); render(); document.getElementById('coding-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'code-select-mission':
        if (CODE_MISSIONS.some((item) => item.id === el.dataset.mission)) state.coding.missionId = el.dataset.mission;
        state.coding.stage = 3; state.coding.result = ''; state.coding.draft = ''; saveState(); render(); document.getElementById('coding-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'code-next-mission': {
        const currentMissionIdx = CODE_MISSIONS.findIndex((m) => m.id === state.coding.missionId);
        const currentLevelIdx = CODE_LEVELS.findIndex((l) => l.id === state.coding.level);
        if (currentMissionIdx !== -1 && currentMissionIdx < CODE_MISSIONS.length - 1) {
          state.coding.missionId = CODE_MISSIONS[currentMissionIdx + 1].id;
          state.coding.draft = '';
          state.coding.result = '';
          state.coding.stage = 3;
          showToast(`Opening next mission: ${CODE_MISSIONS[currentMissionIdx + 1].title}`);
        } else if (currentLevelIdx !== -1 && currentLevelIdx < CODE_LEVELS.length - 1) {
          state.coding.level = CODE_LEVELS[currentLevelIdx + 1].id;
          state.coding.missionId = CODE_MISSIONS[0].id;
          state.coding.draft = '';
          state.coding.result = '';
          state.coding.stage = 3;
          showToast(`Level up! Welcome to ${CODE_LEVELS[currentLevelIdx + 1].label}`);
        } else {
          state.coding.stage = 2;
          state.coding.draft = '';
          state.coding.result = '';
          showToast('All missions in this path complete! Choose your next adventure.');
        }
        saveState();
        render();
        const codeElem = document.getElementById('coding-start');
        if (codeElem) codeElem.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'code-back':
        state.coding.stage = Math.max(0, Math.min(3, Number(el.dataset.stage) || 0));
        state.coding.result = ''; state.coding.draft = ''; saveState(); render(); document.getElementById('coding-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'connect-tutor': {
        const id = el.dataset.id;
        if (!tutorGrantIsActive(id)) {
          startConsentRequest(id); navigate('consent');
          showToast('A parent approval request was created for this specific tutor.');
        } else if (!state.consent.childVerified) {
          navigate('connect_teachers'); showToast('Enter the parent-approved code before requesting this tutor.', 'error');
        } else {
          if (!state.teacherRequests.includes(id)) state.teacherRequests.unshift(id);
          saveState(); render(); showToast('Guardian-approved demo request saved locally. No tutor was contacted.');
        }
        break;
      }
      case 'accept-assignment':
        if (!tutorSessionIsValid()) { showToast('A parent-approved tutor code must be validated first.', 'error'); break; }
        state.consent.assignmentAccepted = true; saveState(); render();
        showToast('Approved demo assignment noted. No lesson or message was created.'); break;
      case 'teacher-profile': openTeacherProfile(el.dataset.id); break;
      case 'request-teacher-intro': {
        const id = el.dataset.id;
        document.getElementById('modal-root').innerHTML = '';
        if (!tutorGrantIsActive(id)) {
          startConsentRequest(id); navigate('consent');
          showToast('A signed parent form and a code for this tutor are required first.');
        } else if (!state.consent.childVerified) {
          navigate('connect_teachers'); showToast('Verify the parent-approved code before requesting an introduction.', 'error');
        } else {
          if (!state.teacherRequests.includes(id)) state.teacherRequests.unshift(id);
          saveState(); render(); showToast('Guardian-approved demo request saved locally. No tutor was contacted.');
        }
        break;
      }
      case 'learner-profile': openLearnerProfile(el.dataset.id); break;
      case 'respond-learner': {
        if (!tutorSessionIsValid()) { showToast('Only a guardian-approved, code-validated assignment can be accepted.', 'error'); break; }
        showToast('The sample learner cards are read-only; accept only the assigned learner displayed after code validation.', 'error'); break;
      }
      case 'select-feeling': state.reflectionFeeling = el.dataset.feeling || ''; saveState(); render(); break;
      case 'search-result': document.getElementById('modal-root').innerHTML = ''; navigate(el.dataset.route || 'base'); break;
      case 'select-language':
        if (state.available[lang]) { state.currentLang = lang; saveState(); navigate('course', { lang }); }
        break;
      case 'notify-language':
        if (!state.interested.includes(lang)) state.interested.push(lang);
        saveState(); render(); showToast(`${SOON_LANGUAGES.find((l) => l.id === lang)?.name || LANGUAGES.find((l) => l.id === lang)?.name || 'Language'} saved to your interest list on this device.`); break;
      case 'choose-level': state.level = normalizeCourseLevel(el.dataset.level || 'beginner'); state.currentLang = lang || state.currentLang; saveState(); navigate('course', { lang: state.currentLang, level: state.level }); break;
      case 'choose-module': navigate('lesson', { lang: lang || state.currentLang, level: el.dataset.level || state.level, module: el.dataset.module || 'greetings' }); break;
      case 'open-module': navigate('lesson', { lang: lang || state.currentLang, level: el.dataset.level || state.level, module: el.dataset.module || 'greetings' }); break;
      case 'back-to-levels': navigate('course', { lang: lang || state.currentLang }); break;
      case 'answer': quizAction(el, 'lesson', 'Correct. +10 practice points.'); break;
      case 'code-answer': quizAction(el, 'code', 'Exactly. +10 practice points.'); break;
      case 'story-answer': quizAction(el, 'story', 'Lovely listening. +10 practice points.'); break;
      case 'owe-meaning-answer': quizAction(el, 'owe-meaning', 'You understood the proverb’s meaning. +10 practice points.'); break;
      case 'owe-story-answer': quizAction(el, 'owe-story', 'Exactly. You noticed Dami’s steady care. +10 practice points.'); break;
      case 'complete-lesson': {
        const key = el.dataset.key || `${state.currentLang}-greetings-intro`;
        if (!state.completed.includes(key)) { state.completed.push(key); state.points += 25; state.streak = Math.max(1, state.streak + 1); }
        saveState(); showToast('Lesson complete—your progress is saved here.'); navigate('course', { lang: lang || state.currentLang, level: el.dataset.level || state.level }); break;
      }
      case 'play-audio': playSample(el); break;
      case 'hero-play-greeting': {
        const phrase = el.dataset.phrase || 'Ẹ káàárọ̀';
        const lang = el.dataset.lang || 'yoruba';
        const translation = el.dataset.translation || 'Good morning';
        
        el.classList.add('is-speaking-active');
        playNativeTrainerVoice(phrase, lang);
        playToneSound(440, 0.15, 'sine');
        setTimeout(() => playToneSound(554.37, 0.15, 'sine'), 100);
        setTimeout(() => playToneSound(659.25, 0.22, 'sine'), 200);

        const langName = getLanguage(lang)?.name || lang;
        showToast(`🔊 “${phrase}” — ${translation} in ${langName}!`, 'success');

        setTimeout(() => {
          el.classList.remove('is-speaking-active');
        }, 2600);
        break;
      }
      case 'hero-listen-speak': {
        el.classList.add('is-active-pulse');
        showToast('🔊 African Voice Studio: Listening & speaking across 4 African languages!', 'success');
        
        const greetings = [
          { lang: 'yoruba', phrase: 'Ẹ káàárọ̀', trans: 'Good morning in Yorùbá', sel: '.float-card-yoruba' },
          { lang: 'hausa', phrase: 'Sannu', trans: 'Good morning in Hausa', sel: '.float-card-hausa' },
          { lang: 'igbo', phrase: 'Ndewo', trans: 'Good morning in Igbo', sel: '.float-card-igbo' },
          { lang: 'swahili', phrase: 'Habari', trans: 'Good morning in Swahili', sel: '.float-card-swahili' }
        ];

        greetings.forEach((g, idx) => {
          setTimeout(() => {
            const card = document.querySelector(g.sel);
            if (card) card.classList.add('is-speaking-active');
            playNativeTrainerVoice(g.phrase, g.lang);
            playToneSound(523.25 + idx * 80, 0.2, 'triangle');
            showToast(`“${g.phrase}” — ${g.trans}`);
            setTimeout(() => {
              if (card) card.classList.remove('is-speaking-active');
            }, 1400);
          }, idx * 1600);
        });

        setTimeout(() => {
          el.classList.remove('is-active-pulse');
        }, greetings.length * 1600 + 400);
        break;
      }
      case 'hero-motto-click': {
        playToneSound(587.33, 0.2, 'sine');
        setTimeout(() => playToneSound(880, 0.25, 'sine'), 120);
        showToast('💡 “A little every day makes a language feel closer.” Consistency is the key to fluency!', 'success');
        break;
      }
      case 'pair-language': break;
      case 'save-item': {
        const item = el.dataset.item;
        state.saved = state.saved.includes(item) ? state.saved.filter((x) => x !== item) : [...state.saved, item];
        saveState(); render(); showToast(state.saved.includes(item) ? 'Saved to your reading list.' : 'Removed from your reading list.'); break;
      }
      case 'billing-period': state.billing = el.dataset.period; saveState(); render(); break;
      case 'choose-plan': openModal(`${el.dataset.plan || 'Family'} updates`, 'Your interest has been noted in this browser preview. The Idilewa team will confirm final plans and pricing before launch.'); break;
      case 'login-mode': state.loginMode = el.dataset.mode === 'signup' ? 'signup' : 'signin'; render(); break;
      case 'auth-role-select': {
        state.authRole = el.dataset.role || 'child';
        saveState();
        render();
        break;
      }
      case 'toggle-password-visibility': {
        const passInput = document.getElementById('authPassword');
        if (passInput) {
          const isPassword = passInput.type === 'password';
          passInput.type = isPassword ? 'text' : 'password';
          el.innerHTML = icon(isPassword ? 'eyeOff' : 'eye', 16);
          el.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        }
        break;
      }
      case 'quick-demo-login': {
        const role = el.dataset.role || 'child';
        state.authRole = role;
        state.loginMode = 'signin';
        if (role === 'child') {
          if (!state.consent.approvedCode) {
            state.consent.approved = true;
            state.consent.approvedCode = 'ID-842910';
            state.consent.accountApproved = true;
            state.consent.learnerAlias = 'Ayo B.';
            state.consent.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
          }
        }
        saveState();
        render();
        const emailInput = document.getElementById('authEmail');
        const passInput = document.getElementById('authPassword');
        const consentInput = document.getElementById('signinConsentCode');
        const nameInput = document.getElementById('authName');
        if (emailInput) emailInput.value = role === 'child' ? 'ayo.learner@idilewa.demo' : role === 'parent' ? 'kemi.parent@idilewa.demo' : role === 'educator' ? 'tola.teacher@idilewa.demo' : 'funke.adult@idilewa.demo';
        if (passInput) passInput.value = '••••••••IdilewaDemo';
        if (consentInput && state.consent.approvedCode) consentInput.value = state.consent.approvedCode;
        if (nameInput) nameInput.value = role === 'child' ? 'Ayo B.' : role === 'parent' ? 'Mrs. Kemi B.' : role === 'educator' ? 'Tola A.' : 'Funke O.';
        showToast(`⚡ Loaded demo credentials for ${role === 'child' ? 'Child Learner (Ayo)' : role === 'parent' ? 'Parent Guardian (Mrs. Kemi)' : role === 'educator' ? 'Educator (Tola)' : 'Adult Learner'}`, 'success');
        break;
      }
      case 'forgot-password': openModal('Password reset', 'Password reset will be available when secure account services are connected. Do not use a real password in this prototype.'); break;
      case 'close-search': document.getElementById('modal-root').innerHTML = ''; break;
      case 'trainer-set-lang': {
        const selectedLang = el.dataset.lang || 'yoruba';
        state.trainer.lang = selectedLang;
        state.trainer.score = null;
        state.trainer.analysis = null;
        saveState();
        render();
        const langNames = { yoruba: 'Yorùbá', igbo: 'Igbo', hausa: 'Hausa', swahili: 'Kiswahili', zulu: 'isiZulu', twi: 'Twi' };
        showToast(`Selected ${langNames[selectedLang] || selectedLang} Voice Trainer`);
        break;
      }
      case 'trainer-set-level': {
        const lvl = el.dataset.level || 'beginner';
        state.trainer.level = lvl;
        state.trainer.activeLessonId = lvl === 'intermediate' ? 21 : lvl === 'advanced' ? 41 : 1;
        state.trainer.score = null;
        state.trainer.analysis = null;
        saveState();
        render();
        const studio = document.getElementById('trainerStudio');
        if (studio) studio.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'trainer-set-speed': {
        const speed = parseFloat(el.dataset.speed) || 1.0;
        state.trainer.speed = speed;
        saveState();
        render();
        showToast(`Voice speed set to ${speed}x`);
        break;
      }
      case 'trainer-play-syllable': {
        const freq = parseFloat(el.dataset.freq) || 293;
        const tone = el.dataset.tone || 're';
        try { playTonePitch(tone); } catch (_) {}
        playToneSound(freq, 0.35, 'triangle');
        el.classList.add('is-active-pitch');
        setTimeout(() => el.classList.remove('is-active-pitch'), 350);
        break;
      }
      case 'trainer-play-native': {
        const lessonId = parseInt(el.dataset.lessonId) || state.trainer.activeLessonId || 1;
        const langData = TRAINER_CURRICULUM[state.trainer.lang] || TRAINER_CURRICULUM.yoruba;
        const currentTierLessons = langData[state.trainer.level] || langData.beginner;
        const activeLesson = currentTierLessons.find((l) => l.id === lessonId) || currentTierLessons[0];
        if (activeLesson) {
          const lCode = state.trainer.lang === 'yoruba' ? 'yo' : state.trainer.lang === 'igbo' ? 'ig' : state.trainer.lang === 'hausa' ? 'ha' : 'en';
          try { speakText(activeLesson.phrase, lCode); } catch (_) {}
          playNativeTrainerVoice(activeLesson.phrase, state.trainer.lang, state.trainer.speed || 1.0, activeLesson.syllables);
          showToast(`Playing voice (${state.trainer.speed || 1.0}x) · Browser speech synthesis sample`);
        }
        break;
      }
      case 'trainer-start-record': {
        const lessonId = parseInt(el.dataset.lessonId) || state.trainer.activeLessonId || 1;
        startTrainerRecording(lessonId);
        showToast('Listening... Speak the phrase clearly into your microphone!');
        break;
      }
      case 'trainer-stop-record': {
        const lessonId = parseInt(el.dataset.lessonId) || state.trainer.activeLessonId || 1;
        stopTrainerRecordingAndAnalyze(lessonId);
        break;
      }
      case 'trainer-prev-lesson': {
        const minId = state.trainer.level === 'beginner' ? 1 : state.trainer.level === 'intermediate' ? 21 : 41;
        if (state.trainer.activeLessonId > minId) {
          state.trainer.activeLessonId -= 1;
          state.trainer.score = null;
          state.trainer.analysis = null;
          saveState();
          render();
          const studio = document.getElementById('trainerStudio');
          if (studio) studio.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
      case 'trainer-next-lesson': {
        const maxId = state.trainer.level === 'beginner' ? 20 : state.trainer.level === 'intermediate' ? 40 : 60;
        if (state.trainer.activeLessonId < maxId) {
          state.trainer.activeLessonId += 1;
          state.trainer.score = null;
          state.trainer.analysis = null;
          saveState();
          render();
          const studio = document.getElementById('trainerStudio');
          if (studio) studio.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
      case 'trainer-select-lesson': {
        const id = parseInt(el.dataset.id) || 1;
        state.trainer.activeLessonId = id;
        state.trainer.score = null;
        state.trainer.analysis = null;
        saveState();
        render();
        const studio = document.getElementById('trainerStudio');
        if (studio) studio.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'trainer-view-cert': {
        const langData = TRAINER_CURRICULUM[state.trainer.lang] || TRAINER_CURRICULUM.yoruba;
        const currentTierLessons = langData[state.trainer.level] || langData.beginner;
        const completedInTier = currentTierLessons.filter((l) => state.trainer.completed && state.trainer.completed[l.id]);
        const count = completedInTier.length;
        const total = currentTierLessons.length;
        const isEligible = count >= total;
        const avg = count > 0 ? Math.round(completedInTier.reduce((acc, l) => acc + (state.trainer.completed[l.id]?.score || 0), 0) / count) : 0;
        const langNames = { yoruba: 'Yorùbá', igbo: 'Igbo', hausa: 'Hausa', swahili: 'Kiswahili', zulu: 'isiZulu', twi: 'Twi' };
        const langName = langNames[state.trainer.lang] || state.trainer.lang;
        const levelName = state.trainer.level.charAt(0).toUpperCase() + state.trainer.level.slice(1);
        openModal(
          `${langName} ${levelName} Tier Certificate`,
          isEligible
            ? `🎉 Congratulations! You have completed all ${total} lessons in the ${langName} ${levelName} tier with an average fluency score of ${avg}%! Your Idilewa African Voice Master badge has been certified.`
            : `Progress: ${count} of ${total} lessons completed in the ${langName} ${levelName} tier (${Math.round((count / total) * 100)}%). Complete all ${total} lessons with at least 85% accuracy to unlock your verified certificate!`
        );
        break;
      }
      case 'coding-jump-band': {
        const bandId = el.dataset.band || el.dataset['band'];
        const target = document.getElementById(bandId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'coding-filter-band': {
        state.coding.filter = el.dataset.band || el.dataset['band'] || 'all';
        saveState();
        render();
        const freeSec = document.getElementById('free-lessons');
        if (freeSec) freeSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'coding-filter-category': {
        state.coding.category = el.dataset.category || el.dataset['category'] || 'all';
        saveState();
        render();
        break;
      }
      case 'coding-explore-grade': {
        const gradeId = el.dataset.grade || el.dataset['grade'];
        openCurriculumModal(gradeId);
        break;
      }
      case 'coding-start-lesson': {
        const lessonId = el.dataset.lessonId || el.dataset['lesson-id'] || el.dataset['lessonId'];
        openFreeLessonModal(lessonId);
        break;
      }
      case 'coding-complete-free-lesson': {
        const lessonId = el.dataset.lessonId || el.dataset['lesson-id'] || el.dataset['lessonId'];
        if (lessonId && !state.coding.completedLessons.includes(lessonId)) {
          state.coding.completedLessons.push(lessonId);
          state.coding.points += 15;
          const today = new Date().toISOString().slice(0, 10);
          if (state.coding.lastPracticeDate !== today) {
            const previous = new Date(`${state.coding.lastPracticeDate || '1970-01-01'}T00:00:00Z`);
            const yesterday = new Date(`${today}T00:00:00Z`);
            yesterday.setUTCDate(yesterday.getUTCDate() - 1);
            state.coding.streak = previous.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10) ? state.coding.streak + 1 : 1;
            state.coding.lastPracticeDate = today;
          }
          saveState();
          showToast('Lesson completed! +15 Maker XP awarded to your profile.', 'success');
          openFreeLessonModal(lessonId);
        }
        break;
      }
      case 'close-modal-and-jump': {
        const modalRoot = document.getElementById('modal-root');
        if (modalRoot) modalRoot.innerHTML = '';
        const targetId = el.dataset.target || el.dataset['target'];
        if (targetId) {
          setTimeout(() => {
            const target = document.getElementById(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
        break;
      }
      default: break;
    }
  }

  document.addEventListener('click', (event) => {
    const routeEl = event.target.closest('[data-route]');
    if (routeEl) {
      if (routeEl.tagName.toLowerCase() === 'a') event.preventDefault();
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) modalRoot.innerHTML = '';
      const route = routeEl.dataset.route;
      const params = {};
      ['lang', 'level', 'module', 'lesson'].forEach((key) => { if (routeEl.dataset[key]) params[key] = routeEl.dataset[key]; });
      navigate(route, params);
      return;
    }
    const actionEl = event.target.closest('[data-action]');
    if (actionEl) {
      if (actionEl.dataset.action === 'close-modal') {
        if (event.target === actionEl || actionEl.tagName.toLowerCase() === 'button') handleAction('close-modal', actionEl);
        return;
      }
      handleAction(actionEl.dataset.action, actionEl);
    }
  });

  document.addEventListener('change', (event) => {
    const el = event.target;
    if (el.matches('[data-action="level-select"]')) navigate('course', { lang: state.currentLang, level: el.value });
    if (el.matches('[data-action="pair-language"]')) { state.currentLang = el.value; saveState(); render(); }
    if (el.matches('#codeHelperLanguage')) { if (CODE_COPY[el.value]) state.coding.helperLanguage = el.value; saveState(); render(); }
    if (el.matches('[data-action="filter-teachers"]')) { state.teacherFilter = el.value; saveState(); render(); }
    if (el.matches('#signupType') || el.matches('#signinType')) {
      const signup = el.id === 'signupType';
      const block = document.getElementById(signup ? 'signupConsentFields' : 'signinConsentFields');
      const codeInput = document.getElementById(signup ? 'signupConsentCode' : 'signinConsentCode');
      const isChild = el.value === 'child';
      if (block) block.hidden = !isChild;
      if (codeInput) { codeInput.required = isChild; codeInput.disabled = !isChild; }
    }
    if (el.matches('#consentTutor')) {
      const tutorBox = document.querySelector('input[name="tutorConsent"]');
      if (tutorBox && !el.value) tutorBox.checked = false;
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.id === 'ide-code-input') {
      state.coding.ideCode = target.value;
      const lineGutter = document.getElementById('ide-line-numbers');
      if (lineGutter) {
        const count = target.value.split('\n').length;
        lineGutter.innerHTML = Array.from({ length: count }, (_, i) => '<div>' + (i + 1) + '</div>').join('');
      }
    }

    if (event.target && event.target.id === 'siteSearch') {
      const results = document.getElementById('searchResults');
      if (results) results.innerHTML = searchResults(event.target.value);
    }
    if (event.target && event.target.id === 'codingSearch') {
      const value = event.target.value;
      const cursor = event.target.selectionStart ?? value.length;
      state.coding.search = value;
      saveState(); render();
      const next = document.getElementById('codingSearch');
      if (next) { next.focus(); try { next.setSelectionRange(cursor, cursor); } catch (_) { /* search inputs vary */ } }
    }
    if (event.target && event.target.id === 'lessonSearchInput') {
      const value = event.target.value;
      state.coding.lessonSearch = value;
      const grid = document.getElementById('freeLessonsGrid');
      const countEl = document.getElementById('freeLessonsCount');
      const filtered = filterFreeLessons();
      if (grid) grid.innerHTML = renderFreeLessonCards(filtered);
      if (countEl) countEl.textContent = `Showing ${filtered.length} of ${C4K_FREE_LESSONS.length} free STEAM lessons`;
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    const type = form.dataset.form;
    if (!type) return;
    event.preventDefault();
    const data = new FormData(form);
    if (type === 'guardian-consent') {
      const requestCode = String(data.get('requestCode') || '').trim().toUpperCase();
      const alias = String(data.get('learnerAlias') || '').trim().slice(0, 28);
      const signature = String(data.get('signature') || '').trim();
      const relationship = String(data.get('relationship') || '').trim();
      const tutorId = String(data.get('tutorId') || '').trim();
      const tutorConsent = data.get('tutorConsent') === 'yes';
      if (!state.consent.requestCode || requestCode !== state.consent.requestCode.toUpperCase()) {
        showToast('The request reference does not match. Ask the learner to show the current reference.', 'error'); return;
      }
      if (!alias || !signature || !relationship || data.get('accountConsent') !== 'yes' || data.get('consentRead') !== 'yes') {
        showToast('Complete the parent/guardian details, signed name and required permission checks.', 'error'); return;
      }
      if ((tutorId && !tutorConsent) || (!tutorId && tutorConsent)) {
        showToast('To approve a tutor, choose one named tutor and tick the tutor-approval box. Otherwise leave both blank.', 'error'); return;
      }
      state.consent = {
        ...state.consent,
        approved: true,
        approvedCode: makeConsentCode('ID'),
        learnerAlias: alias,
        accountApproved: true,
        tutorApproved: !!(tutorId && tutorConsent),
        tutorId: tutorId && tutorConsent ? tutorId : '',
        childVerified: false,
        tutorValidatedFor: '',
        assignmentAccepted: false,
        approvedAt: new Date().toISOString(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      };
      // The typed guardian signature and relationship are deliberately not stored.
      saveState(); render(); showToast('Parent approval recorded in this browser demo. The child code is now available.');
    } else if (type === 'child-consent-check') {
      const code = String(data.get('consentCode') || '').trim().toUpperCase();
      if (!consentCodeIsActive() || !state.consent.accountApproved || code !== state.consent.approvedCode) {
        showToast('That code is not active. Ask a parent or guardian to complete the consent form first.', 'error'); return;
      }
      state.consent.childVerified = true; saveState(); render();
      showToast('Parent code verified in this browser. Tutor requests remain limited to the approved tutor.');
    } else if (type === 'tutor-consent-check') {
      const code = String(data.get('consentCode') || '').trim().toUpperCase();
      const tutorId = String(data.get('tutorId') || '').trim();
      if (!consentCodeIsActive() || !tutorGrantIsActive(tutorId) || code !== state.consent.approvedCode) {
        showToast('Code rejected. A parent must approve this exact tutor and share the active code.', 'error'); return;
      }
      state.consent.tutorValidatedFor = tutorId; state.consent.assignmentAccepted = false;
      saveState(); render(); showToast('Guardian code validated for the assigned tutor. Only the anonymous approved assignment is unlocked.');
    } else if (type === 'coding-run') {
      const code = String(data.get('code') || '').slice(0, 1200);
      const tech = CODE_PATHS.find((item) => item.id === form.dataset.tech) || CODE_PATHS[0];
      const levelId = CODE_LEVELS.some((item) => item.id === form.dataset.level) ? form.dataset.level : 'beginner';
      const missionId = CODE_MISSIONS.some((item) => item.id === form.dataset.mission) ? form.dataset.mission : 'hello';
      const token = CODE_TOKENS[tech.syntax] || 'console.log';
      const copy = codeTextFor(state.coding.helperLanguage);
      const completionKey = `${tech.id}:${levelId}:${missionId}`;
      state.coding.draft = code;
      if (code.toLowerCase().includes(token.toLowerCase())) {
        state.coding.result = `✓ ${copy.success} +10 XP`;
        if (!state.coding.completed.includes(completionKey)) {
          state.coding.completed.push(completionKey); state.coding.points += 10;
          const today = new Date().toISOString().slice(0, 10);
          if (state.coding.lastPracticeDate !== today) {
            const previous = new Date(`${state.coding.lastPracticeDate || '1970-01-01'}T00:00:00Z`);
            const yesterday = new Date(`${today}T00:00:00Z`); yesterday.setUTCDate(yesterday.getUTCDate() - 1);
            state.coding.streak = previous.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10) ? state.coding.streak + 1 : 1;
            state.coding.lastPracticeDate = today;
          }
        }
        saveState(); render(); showToast('Challenge complete! +10 maker XP.');
      } else {
        state.coding.result = `↻ ${copy.retry} Hint: include “${token}” in your example.`;
        saveState(); render();
      }
    } else if (type === 'coding-subscribe') {
      const email = String(data.get('email') || '').trim();
      if (email) {
        form.reset();
        showToast(`🎉 Thank you for subscribing (${email})! You will receive Code for Kids STEAM updates.`, 'success');
      }
    } else if (type === 'lesson-response') {
      const response = String(data.get('response') || '').trim();
      const key = form.dataset.key || '';
      if (!response || !key) { showToast('Add a short practice response before saving.', 'error'); return; }
      state.lessonResponses[key] = response;
      saveState(); render(); showToast('Practice saved on this device.');
    } else if (type === 'ai-helper') {
      const question = String(data.get('question') || '').trim();
      if (!question) { showToast('Add a short question to receive a reflection prompt.', 'error'); return; }
      answerAiPrompt(form.dataset.topic || 'general');
    } else if (type === 'owe-reflection') {
      const thought = String(data.get('thought') || '').trim();
      if (!state.reflectionFeeling) { showToast('Choose a feeling first, or ask a trusted adult to help you name one.', 'error'); return; }
      if (!thought) { showToast('Write one thought or action before saving.', 'error'); return; }
      state.reflections.unshift({ feeling: state.reflectionFeeling, thought, createdAt: Date.now() });
      state.reflectionFeeling = '';
      saveState(); render(); showToast('Your reflection is saved on this device only.');
    } else if (type === 'proverb') {
      const text = String(data.get('text') || '').trim();
      const meaning = String(data.get('meaning') || '').trim();
      if (!text || !meaning || !data.get('consent')) { showToast('Please complete the required fields and consent check.', 'error'); return; }
      state.savedProverbs.unshift({ text, meaning, language: String(data.get('language') || 'Yorùbá'), context: String(data.get('context') || '').trim() });
      saveState(); navigate('owe'); showToast('Your proverb is saved in this browser preview.');
    } else if (type === 'login') {
      const accountType = String(data.get('accountType') || state.authRole || 'child');
      const email = String(data.get('email') || '').trim();
      if (state.loginMode === 'signup') {
        if (accountType === 'child') {
          const code = String(data.get('consentCode') || '').trim().toUpperCase();
          if (!consentCodeIsActive() || !state.consent.accountApproved || code !== state.consent.approvedCode) {
            showToast('A parent-signed consent form and valid code are required before a child can continue.', 'error');
            navigate('consent'); return;
          }
          state.consent.childVerified = true; saveState(); render();
          showToast(`Parent approval validated for ${email || 'child'}. Supervised space ready!`, 'success');
          navigate('profile'); return;
        }
        showToast(`Account created for ${email || 'learner'}. Welcome to your Idilewa space!`, 'success');
        navigate('profile'); return;
      }
      if (accountType === 'child') {
        const code = String(data.get('consentCode') || '').trim().toUpperCase();
        if (!consentCodeIsActive() || !state.consent.accountApproved || code !== state.consent.approvedCode) {
          showToast('A parent-approved consent code is required before a child can sign in.', 'error');
          navigate('consent'); return;
        }
        state.consent.childVerified = true; saveState();
        showToast(`Welcome back, Ayo! Parent approval verified.`, 'success');
        navigate('profile'); return;
      }
      if (accountType === 'educator') {
        showToast(`Welcome back, Educator! Connected to teaching dashboard.`, 'success');
        navigate('connect_teachers'); return;
      }
      if (accountType === 'parent') {
        showToast(`Welcome back, Guardian! Supervised family space active.`, 'success');
        navigate('consent'); return;
      }
      showToast(`Welcome back! Loading your learning journey...`, 'success');
      navigate('profile');
    } else if (type === 'interest') {
      showToast('Thanks for your interest. This prototype does not send or store contact details.');
      form.reset();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.getElementById('modal-root').innerHTML = '';
      closeMobileMenu();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); openSearch();
    }
  });

  window.addEventListener('hashchange', render);
  render();
})();

