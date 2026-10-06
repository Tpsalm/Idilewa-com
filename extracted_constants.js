/* Idilewa responsive learning prototype — dependency free, client-side demo. */
(() => {
  'use strict';

  const ROUTES = [
    'index', 'about', 'base', 'coding', 'connect_students', 'connect_teachers', 'consent', 'course',
    'ere', 'ere_game', 'families', 'guides', 'human', 'ifa', 'ifa_odu', 'individuals', 'keepers',
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
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    trophy: '<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0zM7 7H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/>',
    bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.7 9a7 7 0 0 1 12-2L20 12M4 12l2.3 5a7 7 0 0 0 12-2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>'
  };

  const PAGE_META = {
    about: {
      title: 'Culture is not a chapter. It is the whole story.',
      eyebrow: 'About Idilewa',
      desc: 'A welcoming digital home where African languages, living heritage and future-facing skills grow together.',
      icon: 'leaf', image: 'story', imageAlt: 'A grandmother sharing a story with children',
      active: 2, flow: ['Belong', 'Discover', 'Learn', 'Pass it on'],
      cta: 'Explore our approach', ctaRoute: 'method',
      cards: [
        { title: 'Language lives in community', text: 'Learning grows through everyday words, family stories and the voices of people who carry them.', icon: 'people', route: 'families', tone: 'mint' },
        { title: 'Culture belongs in the classroom', text: 'Proverbs, oral traditions and cultural context sit beside language practice—not on the sidelines.', icon: 'book', route: 'oral', tone: 'peach' },
        { title: 'Technology can carry us forward', text: 'Young learners can explore coding while staying rooted in the languages they know.', icon: 'code', route: 'coding', tone: 'blue' }
      ]
    },
    families: {
      title: 'Make room for the language of home.',
      eyebrow: 'For families',
      desc: 'Small shared moments can keep a language close. Build a gentle routine for the whole family, wherever home is.',
      icon: 'heart', image: 'story', imageAlt: 'A family learning together',
      active: 0, flow: ['Choose a language', 'Set a rhythm', 'Learn together', 'Celebrate'],
      cta: 'Start a family path', ctaRoute: 'languages',
      cards: [
        { title: 'A 10-minute routine', text: 'Try a greeting, one new phrase and a story at the end of the day.', icon: 'clock', route: 'course', tone: 'mint' },
        { title: 'Share stories across generations', text: 'Invite a grandparent, auntie or trusted elder to tell a story in their own words.', icon: 'quote', route: 'ere', tone: 'peach' },
        { title: 'Make progress feel joyful', text: 'Collect small wins, build a family streak and celebrate effort over perfection.', icon: 'trophy', route: 'profile', tone: 'yellow' }
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
        { title: 'Creative learners', text: 'Children and adults bring their own questions, ideas and futures.', icon: 'sparkles', route: 'families', tone: 'yellow' }
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
    { label: 'Read & listen', route: 'oral', group: 'read' },
    { label: 'Code', route: 'coding', group: 'code' },
    { label: 'Stories', route: 'ere', group: 'stories' },
    { label: 'Community', route: 'families', group: 'community' },
    { label: 'About', route: 'about', group: 'about' }
  ];

  const NAV_GROUPS = {
    languages: 'learn', course: 'learn', lesson: 'learn', kids: 'learn', individuals: 'learn',
    oral: 'read', oral_genre: 'read', oriki: 'read', owe: 'read', owe_add: 'read',
    owe_detail: 'read', owe_story: 'read', owe_reflection: 'read', voices: 'read',
    connect_students: 'community', connect_teachers: 'community', consent: 'community',
    coding: 'code', ere: 'stories', ere_game: 'stories', ifa: 'culture', ifa_odu: 'culture',
    about: 'about', method: 'about', families: 'community', schools: 'community', tutor: 'community', kids: 'community', individuals: 'community',
    guides: 'culture', human: 'culture', keepers: 'culture'
  };

  const LABELS = Object.fromEntries(ROUTES.map((r) => [r, r === 'index' ? 'Home' : r.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())]));
  LABELS.ere = 'Stories'; LABELS.ere_game = 'Story game'; LABELS.ifa_odu = 'Odu culture note'; LABELS.coding = 'Coding for kids';
  LABELS.owe_add = 'Share a proverb'; LABELS.owe_detail = 'Owe · translation & meaning';
  LABELS.owe_story = 'Owe · moral story'; LABELS.owe_reflection = 'Owe · reflection';
  LABELS.connect_students = 'Connect with Students'; LABELS.connect_teachers = 'Connect with Teachers';
  LABELS.consent = 'Parent & guardian consent';

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
      lastPracticeDate: '', completed: [], draft: '', result: '',
      questCommands: [], questTrail: [], questResult: ''
    }
  };

  