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

  function readState() {
    try {
      const stored = JSON.parse(localStorage.getItem('idilewa-demo-state') || '{}');
      return {
        ...defaults,
        ...stored,
        available: { ...defaults.available, ...(stored.available || {}) },
        consent: { ...defaults.consent, ...(stored.consent || {}) },
        coding: {
          ...defaults.coding,
          ...(stored.coding || {}),
          completed: Array.isArray(stored.coding?.completed) ? stored.coding.completed : [],
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
        completed: Array.isArray(stored.completed) ? stored.completed : defaults.completed.slice(),
        interested: Array.isArray(stored.interested) ? stored.interested : []
      };
    } catch (_) { return { ...defaults, available: { ...defaults.available } }; }
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
    const menu = NAV.map((item) => `<a class="mobile-menu-link ${currentGroup === item.group ? 'active' : ''}" href="#/${item.route}" data-route="${item.route}">${icon(item.group === 'home' ? 'home' : item.group === 'learn' ? 'book' : item.group === 'read' ? 'headphones' : item.group === 'code' ? 'code' : item.group === 'stories' ? 'quote' : item.group === 'community' ? 'people' : 'sparkles', 19)}<span>${item.label}</span>${icon('arrow', 16)}</a>`).join('');
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
          <a class="button button-small button-primary header-cta" href="#/languages" data-route="languages">Get started ${icon('arrow', 15)}</a>
          <button class="icon-button menu-toggle" type="button" data-action="toggle-menu" aria-label="Open navigation" aria-expanded="false">${icon('menu', 21)}</button>
        </div>
      </div>
      <div id="mobile-menu" class="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-head"><span>Explore Idilewa</span><button class="icon-button" type="button" data-action="toggle-menu" aria-label="Close navigation">${icon('close', 20)}</button></div>
        <div class="mobile-menu-list">${menu}</div>
        <div class="mobile-menu-bottom"><a class="button button-primary" href="#/languages" data-route="languages">Start learning ${icon('arrow', 16)}</a><a href="#/login" data-route="login">Sign in to your space</a></div>
      </div>`;
  }

  function renderMobileNav(page) {
    const items = [
      { route: 'index', label: 'Home', ico: 'home' },
      { route: 'languages', label: 'Learn', ico: 'book' },
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
        <div class="footer-links"><h3>Learn</h3>${routeLink('languages', 'Choose a language')}${routeLink('course', 'Learning paths')}${routeLink('coding', 'Code in your language')}</div>
        <div class="footer-links"><h3>Discover</h3>${routeLink('oral', 'Read & listen')}${routeLink('ere', 'Stories')}${routeLink('ifa', 'Culture & heritage')}</div>
        <div class="footer-links"><h3>Idilewa</h3>${routeLink('about', 'Our story')}${routeLink('families', 'For families')}${routeLink('schools', 'For schools')}${routeLink('connect_teachers', 'Connect with teachers')}${routeLink('connect_students', 'Connect with students')}${routeLink('base', 'Explore all pages')}</div>
      </div>
      <div class="container footer-bottom"><span>© Idilewa · A learning space for languages, culture and technology</span><span class="footer-note">A thoughtful beginning, built to grow.</span></div>
    </footer>`;
  }

  function pill(text, tone = 'soft') { return `<span class="pill pill-${tone}">${text}</span>`; }

  function renderHome() {
    const featureCards = [
      { title: 'Learn languages', desc: 'Speak, listen, read and practice.', icon: 'globe', route: 'languages', tone: 'blue', tag: 'Start here', image: 'yoruba-kids-culture.jpg' },
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
              ${routeLink('about', `${icon('play', 15)} Our story`, 'button button-outline')}
            </div>
            <div class="hero-social-proof"><div class="mini-avatars"><span>A</span><span>Ẹ</span><span>Ụ</span><span>✳</span></div><span>For curious learners, families<br class="desktop-only" /> and the next generation</span></div>
          </div>
          <div class="hero-visual">
            <div class="hero-photo-wrap"><img src="./assets/yoruba-kids-culture.jpg" alt="Children in Yorùbá attire learning together" class="hero-photo" /></div>
            <div class="floating-chip chip-blue"><span class="chip-icon">${icon('volume', 17)}</span><span>Listen & speak</span></div>
            <div class="floating-chip chip-green"><span>Ẹ káàárọ̀</span><span class="chip-small">Good morning</span></div>
            <div class="floating-chip chip-coral">${icon('book', 16)} Stories that stay</div>
            <div class="hero-sticker">${icon('sparkles', 17)}<span>Learn<br />with joy</span></div>
            <div class="hero-caption">A little every day makes a language feel closer.</div>
          </div>
        </div>
        <div class="container hero-language-row"><span class="tiny-label">Four languages. One welcoming home.</span><div class="hero-lang-pills">${LANGUAGES.map((l) => `<span>${l.name}</span>`).join('')}</div>${routeLink('languages', 'See all languages ' + icon('arrow', 14), 'text-link')}</div>
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
          </div>
        </div>
      </section>

      <section class="container section language-section">
        <div class="section-heading"><div><span class="section-kicker">Start with a language</span><h2>Which one feels like home?</h2><p>Four learning paths are ready to explore, with more voices on the way.</p></div>${routeLink('languages', 'All languages ' + icon('arrow', 15), 'text-link')}</div>
        <div class="language-grid home-language-grid">${LANGUAGES.map((l) => `<button type="button" class="language-card lang-${l.tint}" data-action="${state.available[l.id] ? 'select-language' : 'notify-language'}" data-lang="${l.id}"><span class="language-glyph">${l.glyph}</span><span class="language-info"><strong>${l.name}</strong><small>${l.region}</small></span><span class="language-go">${icon('arrow', 16)}</span></button>`).join('')}</div>
        <div class="coming-soon-line"><span class="coming-soon-dot"></span>Coming soon: ${SOON_LANGUAGES.map((l) => l.name).join(' · ')} ${routeLink('languages', 'Get curious ' + icon('arrow', 13), 'text-link text-link-small')}</div>
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
          <a class="audience-card audience-family" href="#/families" data-route="families"><span class="audience-icon">${icon('heart', 21)}</span><span class="audience-kicker">For families</span><strong>Keep language close.</strong><small>Build a shared learning rhythm at home.</small>${icon('arrow', 16)}</a>
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
      <section class="language-page-hero"><div class="language-page-copy"><span class="section-kicker">The first step is yours</span><h1>Find a language<br /><em>that feels like home.</em></h1><p>Choose an available language path. Each is built to grow with you—from a first greeting to stories, culture and more.</p><div class="language-page-badges"><span>${icon('shield', 16)} Designed to grow</span><span>${icon('volume', 16)} Listen as you learn</span></div></div><div class="language-page-art"><img src="./assets/yoruba-kids-culture.jpg" alt="Children in beautiful Yorùbá attire reading together" /><div class="art-note">Words connect us <span>✦</span></div></div></section>
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
    const header = `<section class="course-top"><div><span class="section-kicker">Your learning path · ${lang.name}</span><h1>${lang.name}, <em>one good step at a time.</em></h1><p>Choose Beginner, Intermediate or Advanced. Each level contains 20 lessons across four modules.</p></div><div class="course-language-chip"><span class="language-glyph lang-${lang.tint}">${lang.glyph}</span><div><small>Learning language</small><strong>${lang.name}</strong><button data-route="languages">Change language</button></div></div></section>`;
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
  function renderCoding() {
    const flow = state.coding;
    const localeId = CODE_COPY[flow.helperLanguage] ? flow.helperLanguage : 'yoruba';
    const copy = codeTextFor(localeId);
    const level = CODE_LEVELS.find((item) => item.id === flow.level) || CODE_LEVELS[0];
    const tech = CODE_PATHS.find((item) => item.id === flow.techId) || CODE_PATHS[0];
    const mission = CODE_MISSIONS.find((item) => item.id === flow.missionId) || CODE_MISSIONS[0];
    const greeting = copy.greeting;
    const sample = sampleCodeFor(tech, greeting);
    const makerLevel = Math.floor(Math.max(0, flow.points) / 50) + 1;
    const xpInLevel = Math.max(0, flow.points) % 50;
    const levelProgress = Math.min(100, Math.round((xpInLevel / 50) * 100));
    const makerRank = makerLevel >= 8 ? 'Canopy Creator' : makerLevel >= 5 ? 'Trailblazer' : makerLevel >= 3 ? 'Pathfinder' : 'Seedling Coder';
    const streakBadge = flow.streak >= 7 ? 'Canopy Creator' : flow.streak >= 3 ? 'Growing Builder' : flow.streak >= 1 ? 'Bright Sprout' : 'New Explorer';
    const progress = Math.min(100, Math.round((flow.completed.length / Math.max(1, CODE_PATHS.length * CODE_LEVELS.length * CODE_MISSIONS.length)) * 100));
    const stepLabels = ['Choose a guide', 'Pick an adventure', 'Choose a level', 'Play & celebrate'];
    const stageSelect = (selected) => LANGUAGES.map((lang) => `<option value="${lang.id}" ${selected === lang.id ? 'selected' : ''}>${lang.name}</option>`).join('');
    const questRobot = flow.questTrail.length ? flow.questTrail[flow.questTrail.length - 1] : '0,3';
    const questTrail = new Set(flow.questTrail);
    const questSolved = flow.completed.includes('garden-quest');
    const questTiles = Array.from({ length: 20 }, (_, index) => {
      const x = index % 5; const y = Math.floor(index / 5); const cell = `${x},${y}`;
      const isRobot = cell === questRobot; const isGoal = cell === CODE_GARDEN_TARGET;
      const isBush = CODE_GARDEN_OBSTACLES.has(cell); const isTrail = questTrail.has(cell);
      const label = isRobot ? (isGoal ? 'Robot at the star' : 'Robot') : isGoal ? 'Star goal' : isBush ? 'Leafy obstacle' : isTrail ? 'Robot trail' : 'Garden path';
      const glyph = isRobot ? (isGoal ? '🤖⭐' : '🤖') : isGoal ? '⭐' : isBush ? '🌿' : isTrail ? '·' : '';
      return `<span class="code-quest-tile ${isRobot ? 'is-robot' : ''} ${isGoal ? 'is-goal' : ''} ${isBush ? 'is-bush' : ''} ${isTrail ? 'is-trail' : ''}" role="gridcell" aria-label="${label}">${glyph}</span>`;
    }).join('');
    const questCommandList = flow.questCommands.length
      ? flow.questCommands.map((direction, i) => {
        const move = CODE_GARDEN_DIRECTIONS[direction];
        const directionText = copy.directions[move?.labelIndex ?? 0];
        return `<button type="button" class="code-quest-block" data-action="code-quest-remove" data-index="${i}" aria-label="Remove step ${i + 1}: ${esc(directionText)}"><span>${move?.glyph || '·'}</span><small>${esc(directionText)}</small><b aria-hidden="true">×</b></button>`;
      }).join('')
      : `<span class="code-quest-empty">Your code blocks will appear here.</span>`;
    const questControls = Object.entries(CODE_GARDEN_DIRECTIONS).map(([direction, move]) => {
      const label = copy.directions[move.labelIndex];
      return `<button type="button" class="code-quest-direction" data-action="code-quest-add" data-direction="${direction}" ${flow.questCommands.length >= 12 ? 'disabled' : ''} aria-label="Add ${esc(label)} step"><span>${move.glyph}</span><small>${esc(label)}</small></button>`;
    }).join('');
    let content = '';
    if (flow.stage === 0) {
      content = `<section class="code-step-panel" aria-labelledby="code-language-title"><span class="section-kicker">Step 1 · choose your helper language</span><h2 id="code-language-title">Which language should guide your adventure?</h2><p>Code stays exactly as programmers write it. Friendly explanations, hints and your first greeting can appear alongside the language you know.</p><div class="code-locale-grid">${LANGUAGES.map((lang) => `<button type="button" class="code-locale-card ${localeId === lang.id ? 'is-selected' : ''}" data-action="code-set-language" data-lang="${lang.id}" aria-pressed="${localeId === lang.id}"><span class="language-glyph lang-${lang.tint}">${lang.glyph}</span><strong>${lang.name}</strong><small>${lang.native}</small><span>${localeId === lang.id ? 'Selected · continue' : 'Choose language'}</span></button>`).join('')}</div><p class="code-translation-note">${icon('info', 16)} Starter glosses are learning aids; fluent language educators should review them before public launch.</p></section>`;
    } else if (flow.stage === 1) {
      const query = String(flow.search || '').trim().toLowerCase();
      const visible = CODE_PATHS.filter((item) => !query || `${item.name} ${item.category}`.toLowerCase().includes(query));
      const families = [...new Set(CODE_PATHS.map((item) => item.category))];
      content = `<section class="code-step-panel" aria-labelledby="code-path-title"><div class="code-picker-head"><div><span class="section-kicker">Step 2 · choose a learning path</span><h2 id="code-path-title">Pick a playful place to start.</h2><p>Explore ${CODE_PATHS.length} coding paths—from blocks and websites to Python, games and robots. The highlighted adventures are kid-first; the full library also includes tools for older learners.</p></div><label class="code-search-label">Find a language or tool<input id="codingSearch" type="search" value="${esc(flow.search)}" placeholder="Try Scratch, Python, HTML…" autocomplete="off" /></label></div><div class="code-adventure-grid code-adventure-grid-compact">${CODE_ADVENTURES.map((adventure, i) => `<button type="button" class="code-adventure-card tone-${adventure.tone}" data-action="code-select-tech" data-tech="${adventure.tech}"><span class="code-adventure-number">0${i + 1}</span><span class="code-adventure-icon">${icon(adventure.icon, 20)}</span><small>${adventure.label}</small><strong>${adventure.title}</strong><span class="code-adventure-go">Start this path ${icon('arrow', 14)}</span></button>`).join('')}</div><details class="code-all-paths" ${query ? 'open' : ''}><summary><span>Explore every coding path</span><strong>${CODE_PATHS.length} paths · ${CODE_LANGUAGE_IDS.size}+ languages & tools</strong></summary><div class="code-category-counts">${families.map((family) => `<span>${esc(family)} · ${CODE_PATHS.filter((item) => item.category === family).length}</span>`).join('')}</div><div class="code-path-grid">${visible.map((item) => `<button type="button" class="code-path-card" data-action="code-select-tech" data-tech="${item.id}"><span class="code-path-icon">${icon('code', 19)}</span><span class="code-path-family">${esc(item.category)}</span><strong>${esc(item.name)}</strong><small>A tiny bilingual starter, a clear example and a challenge you can try.</small><span class="code-path-go">Choose this path ${icon('arrow', 14)}</span></button>`).join('') || `<div class="code-empty">No path matched that search. Try a shorter word such as “web” or “data”.</div>`}</div></details></section>`;
    } else if (flow.stage === 2) {
      content = `<section class="code-step-panel" aria-labelledby="code-level-title"><div class="code-current-tech"><span class="code-path-icon">${icon('code', 20)}</span><div><span class="section-kicker">Step 3 · shape your adventure</span><h2 id="code-level-title">${esc(tech.name)} <small>${esc(tech.category)} · a starter path</small></h2></div><label class="code-helper-select">Guide language<select id="codeHelperLanguage" aria-label="Choose the language for coding hints">${stageSelect(localeId)}</select></label><button type="button" class="text-link" data-action="code-back" data-stage="1">Change path</button></div><p class="code-level-intro">Choose a pace, then pick a tiny mission. You can explore all three levels whenever you’re ready.</p><div class="code-level-grid">${CODE_LEVELS.map((item) => `<button type="button" class="code-level-card ${item.id === level.id ? 'is-selected' : ''}" data-action="code-set-level" data-level="${item.id}" aria-pressed="${item.id === level.id}"><span>${icon(item.icon, 21)}</span><small>${item.badge}</small><strong>${item.label}</strong><p>${item.note}</p><b>${flow.completed.filter((key) => key.startsWith(`${tech.id}:${item.id}:`)).length} wins</b></button>`).join('')}</div><div class="code-missions-head"><div><span class="section-kicker">${level.label} · choose a mission</span><h3>Make one small win your own.</h3></div><span class="code-progress-pill">${flow.completed.length} wins · ${flow.points} XP</span></div><div class="code-mission-grid">${CODE_MISSIONS.map((item, i) => { const done = flow.completed.includes(`${tech.id}:${level.id}:${item.id}`); const mode = i === 0 ? 'Story quest' : i === 3 ? 'Create & remix' : 'Skill practice'; return `<button type="button" class="code-mission-card ${done ? 'is-complete' : ''}" data-action="code-select-mission" data-mission="${item.id}"><span class="mission-num">0${i + 1}</span><span class="mission-icon">${icon(done ? 'check' : item.icon, 18)}</span><small>${mode} · ${item.skill}</small><strong>${item.title}</strong><span>${done ? 'Win saved' : 'Open mini lesson'} ${icon('arrow', 14)}</span></button>`; }).join('')}</div></section>`;
    } else {
      const token = CODE_TOKENS[tech.syntax] || 'console.log';
      const completionKey = `${tech.id}:${level.id}:${mission.id}`;
      const complete = flow.completed.includes(completionKey);
      const previewOutput = tech.syntax === 'blocks' || tech.name === 'Scratch'
        ? `✨ ${greeting}\nYour character waves hello!`
        : tech.syntax === 'markup'
          ? `✨ ${greeting}\nA little webpage is ready.`
          : `✨ ${greeting}\nYour ${tech.name} idea is taking shape.`;
      const challengeText = localeId === 'yoruba'
        ? `Gbìyànjú: lo ${tech.name} láti fi “${greeting}” hàn. Wa àmì yìí nínú àpẹẹrẹ: ${token}`
        : localeId === 'igbo'
          ? `Nwaa: jiri ${tech.name} gosi “${greeting}”. Chọta akara a n'ime ihe atụ: ${token}`
          : localeId === 'hausa'
            ? `Gwada: yi amfani da ${tech.name} don nuna “${greeting}”. Nemo wannan alama a misalin: ${token}`
            : `Jaribu: tumia ${tech.name} kuonyesha “${greeting}”. Tafuta alama hii kwenye mfano: ${token}`;
      
      const currentMissionIdx = CODE_MISSIONS.findIndex((m) => m.id === mission.id);
      const currentLevelIdx = CODE_LEVELS.findIndex((l) => l.id === level.id);
      let nextStepLabel = 'Next mission';
      if (currentMissionIdx !== -1 && currentMissionIdx < CODE_MISSIONS.length - 1) {
        nextStepLabel = `Next: ${CODE_MISSIONS[currentMissionIdx + 1].title}`;
      } else if (currentLevelIdx !== -1 && currentLevelIdx < CODE_LEVELS.length - 1) {
        nextStepLabel = `Next Level: ${CODE_LEVELS[currentLevelIdx + 1].label}`;
      } else {
        nextStepLabel = 'Choose next coding path';
      }
content = `<section class="code-step-panel code-play-panel" aria-labelledby="code-play-title"><div class="code-play-head"><div><span class="section-kicker">Step 4 · ${level.badge} · ${mission.title}</span><h2 id="code-play-title">Let’s make something with ${esc(tech.name)}.</h2><p>${esc(challengeText)}</p></div><div class="code-streak-mini"><span>${icon('sparkles', 18)}</span><strong>${flow.streak} day${flow.streak === 1 ? '' : 's'}</strong><small>${streakBadge}</small></div></div><div class="code-bilingual-callout"><div><small>English</small><p>Code gives the computer clear instructions.</p></div><div><small>${copy.label}</small><p>${copy.code}</p></div><div><small>${copy.label} · ${mission.skill}</small><p>${mission.id === 'sequence' ? copy.sequence : copy.variable}</p></div></div><details class="code-hint"><summary>Need a hint? Tap for a tiny clue.</summary><p>Look for <code>${esc(token)}</code> in the starter. Keep the code as it is and try changing just one small thing.</p></details><div class="code-workbench-grid"><form class="code-editor-card" data-form="coding-run" data-tech="${tech.id}" data-level="${level.id}" data-mission="${mission.id}"><div class="code-editor-title"><span><i></i><i></i><i></i></span><strong>Your code notebook</strong><small>${esc(tech.name)} · guided demo</small></div><label for="codingCode">Try a small edit, then run the friendly check.</label><textarea id="codingCode" name="code" rows="10" maxlength="1200" spellcheck="false" autocapitalize="off" required>${esc(flow.draft || sample)}</textarea><small>This offline preview checks for a lesson marker only. It does not execute code or upload your work.</small><button class="button button-primary code-run-button" type="submit">Run my code ${icon('play', 16)}</button></form><aside class="code-output-card"><span class="section-kicker">A friendly preview</span><h3>${complete ? 'Mission unlocked!' : 'What your idea could do'}</h3><div class="code-output-window"><span class="output-dot"></span><pre>${esc(previewOutput)}</pre></div><div class="code-run-status ${flow.result.includes('✓') ? 'is-success' : flow.result ? 'is-retry' : ''}" role="status">${flow.result ? esc(flow.result) : 'Ready when you are — tiny experiments count.'}</div>${complete ? `<div class="code-success-burst">${icon('trophy', 20)} <strong>+10 maker XP · Mission Complete!</strong><span>${copy.success}</span><button type="button" class="button button-primary code-next-mission-btn" data-action="code-next-mission">${nextStepLabel} ${icon('arrow', 15)}</button></div>` : ''}<div class="code-streak-track"><span>Maker level ${makerLevel} · ${makerRank}</span><strong>${flow.streak} day${flow.streak === 1 ? '' : 's'} · ${streakBadge}</strong><div><i style="width:${levelProgress}%"></i></div><small>${xpInLevel}/50 XP to the next level · ${flow.points} XP total</small></div></aside></div><div class="code-layer-actions">${complete ? `<button type="button" class="button button-primary code-next-mission-btn" data-action="code-next-mission">${nextStepLabel} ${icon('arrow', 15)}</button>` : ''}<button type="button" class="text-link" data-action="code-back" data-stage="2">${icon('arrowUp', 14)} Back to levels & missions</button><button type="button" class="text-link" data-action="code-back" data-stage="1">Pick another code path</button></div></section>`;
    }

    return `<div class="container route-page coding-page redesigned-coding-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Coding for kids</strong></div><section class="code-kids-hero" aria-labelledby="code-kids-title"><div class="code-kids-hero-copy"><span class="code-kids-eyebrow">${icon('sparkles', 16)} IDÍLẸ́WÀ CODE GARDEN · LEARN BY PLAYING</span><h1 id="code-kids-title">Code a little.<br /><em>Imagine a lot.</em></h1><p>Guide a robot through a garden, make a character dance, build a webpage and tell a tiny story with code—one cheerful mission at a time.</p><div class="code-kids-hero-actions"><button type="button" class="code-kids-start-button" data-action="code-jump" data-target="coding-start">Start a free coding adventure ${icon('arrow', 17)}</button><button type="button" class="code-kids-secondary-button" data-action="code-jump" data-target="code-quest">Play the robot garden ${icon('play', 15)}</button></div><div class="code-kids-trust-row"><span>${icon('layers', 15)} ${CODE_PATHS.length} code paths</span><span>${icon('globe', 15)} ${LANGUAGES.length} helper languages</span><span>${icon('smile', 15)} No experience needed</span><span>${icon('check', 15)} Tablet-friendly</span></div></div><div class="code-kids-hero-visual"><img src="./assets/page-coding-1.jpg" alt="Nigerian children in traditional attire sharing a coding activity with a friendly robot" /><span class="code-hero-sticker code-hero-sticker-top">${icon('sparkles', 15)} Small steps · big ideas</span><span class="code-hero-sticker code-hero-sticker-bottom">${icon('trophy', 16)} Earn maker XP as you learn</span></div></section><section class="code-learning-rhythm" aria-label="How coding lessons work"><article><span class="code-rhythm-number">01</span><span class="code-rhythm-icon">${icon('book', 20)}</span><strong>Story quests</strong><p>Give a character a goal and help them solve it.</p></article><article><span class="code-rhythm-number">02</span><span class="code-rhythm-icon">${icon('layers', 20)}</span><strong>Skill practice</strong><p>Try sequences, patterns, loops and choices.</p></article><article><span class="code-rhythm-number">03</span><span class="code-rhythm-icon">${icon('sparkles', 20)}</span><strong>Make it yours</strong><p>Change an example, remix an idea and celebrate.</p></article></section><section class="code-adventures-section" id="code-adventures" aria-labelledby="code-adventures-title"><div class="code-section-heading"><div><span class="section-kicker">Choose your first adventure</span><h2 id="code-adventures-title">What would you like to make?</h2><p>Friendly starting points for curious coders—no experience needed.</p></div><button type="button" class="text-link" data-action="code-jump" data-target="coding-start">Explore all ${CODE_PATHS.length} paths ${icon('arrow', 15)}</button></div><div class="code-adventure-grid">${CODE_ADVENTURES.map((adventure, i) => `<button type="button" class="code-adventure-card tone-${adventure.tone}" data-action="code-quick-path" data-tech="${adventure.tech}"><span class="code-adventure-number">0${i + 1}</span><span class="code-adventure-icon">${icon(adventure.icon, 21)}</span><small>${adventure.label}</small><strong>${adventure.title}</strong><p>${adventure.text}</p><span class="code-adventure-go">Start this adventure ${icon('arrow', 14)}</span></button>`).join('')}</div></section><section class="code-garden-quest" id="code-quest" aria-labelledby="code-quest-title"><div class="code-quest-copy"><span class="code-kids-eyebrow">${icon('star', 16)} TRY A MINI GAME · NO SIGN-UP NEEDED</span><h2 id="code-quest-title">Robot in the baobab garden</h2><p>${esc(copy.questPrompt)}</p><div class="code-quest-instruction"><span>${icon('info', 16)}</span><span>Build a sequence to get around the leafy bushes and reach the star. A correct route earns your first 10 maker XP.</span></div><div class="code-quest-controls"><span class="code-quest-subtitle">Add a movement block</span><div class="code-quest-direction-row">${questControls}</div></div><div class="code-quest-code-label"><strong>Your sequence</strong><small>${flow.questCommands.length}/12 blocks · tap a block to remove it</small></div><div class="code-quest-sequence" aria-label="Your movement code sequence">${questCommandList}</div><div class="code-quest-actions"><button type="button" class="code-quest-run" data-action="code-quest-run">${icon('play', 16)} ${esc(copy.questRun)}</button><button type="button" class="code-quest-undo" data-action="code-quest-remove" data-index="${Math.max(0, flow.questCommands.length - 1)}" ${flow.questCommands.length ? '' : 'disabled'}>${icon('refresh', 15)} Undo</button><button type="button" class="code-quest-undo" data-action="code-quest-clear" ${flow.questCommands.length ? '' : 'disabled'}>${icon('plus', 15)} ${esc(copy.questClear)}</button></div><details class="code-hint code-quest-hint"><summary>Need a hint?</summary><p>${esc(copy.questHint)}</p></details>${flow.questResult ? `<div class="code-quest-result ${flow.questResult.includes('✓') ? 'is-success' : 'is-retry'}" role="status">${icon(flow.questResult.includes('✓') ? 'check' : 'refresh', 17)} ${esc(flow.questResult)}</div>` : ''}${questSolved ? `<div class="code-quest-earned">${icon('trophy', 17)} Garden Explorer badge earned</div>` : ''}</div><div class="code-quest-board-card"><div class="code-quest-board-head"><div><span class="section-kicker">THE PUZZLE MAP</span><strong>Find the star</strong></div><span class="code-quest-badge">${icon('sparkles', 15)} ${questSolved ? 'Complete' : 'Mission 01'}</span></div><div class="code-quest-board" role="grid" aria-label="Robot garden maze with a star goal and leafy obstacles">${questTiles}</div><div class="code-quest-key"><span><i class="key-robot">🤖</i> Your robot</span><span><i class="key-bush">🌿</i> Bush</span><span><i class="key-star">⭐</i> Goal</span></div><p>Think like a coder: plan, run, notice what happened, then try again.</p></div></section><section class="code-start-zone" id="coding-start" aria-labelledby="coding-start-title"><div class="code-start-heading"><div><span class="section-kicker">YOUR MAKER JOURNEY · ${CODE_PATHS.length} paths · ${CODE_LEVELS.length} skill levels</span><h2 id="coding-start-title">Your next tiny win starts here.</h2><p>Choose a guide language, pick a path, then learn by trying. Your local progress stays on this device.</p></div><div class="code-progress-card code-progress-card-fun"><span class="code-progress-spark">${icon('trophy', 22)}</span><div class="code-progress-heading"><small>Level ${makerLevel} · ${makerRank}</small><strong>${flow.points} <em>XP</em></strong></div><div class="code-level-meter"><i style="width:${levelProgress}%"></i></div><span>${xpInLevel}/50 XP to the next level · ${flow.completed.length} challenge wins</span><div class="code-progress-foot"><span>${icon('sparkles', 14)} ${flow.streak} day streak</span><span>${progress}% path progress</span></div></div></div>${renderStepper(stepLabels, flow.stage)}<div class="coding-layer-content">${content}</div></section><section class="code-safety-note">${icon('shield', 16)} This is a local learning prototype: starter code is checked with simple teaching rules, and the garden quest simulates movement blocks. It does not execute arbitrary programs, upload code, or connect to an AI service. Language glosses need fluent-speaker review.</section></div>`;
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
    return `<div class="container route-page story-game-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('ere', 'Stories')}<span>/</span><strong>Story time</strong></div><section class="story-game-layout"><div class="story-game-image"><img src="./assets/story-grandmother.jpg" alt="A grandmother sharing a story with two children" /><span class="story-audio-pill">${icon('volume', 15)} Read aloud together</span></div><div class="story-reading"><span class="section-kicker">A story for the whole family · 4 min</span><h1>The story that<br /><em>travelled.</em></h1><p class="story-subhead">A gentle listening story about how a tale can move from one person to another.</p><button class="listen-inline" data-action="play-audio" data-text="A story travels when someone listens, remembers and shares it with care.">${icon('play', 14)} Listen to this story <span>01:24</span></button><div class="story-text"><p>One evening, a grandmother began a story in the garden. The children leaned closer as the first words settled into the quiet.</p><p>When the story ended, one child asked to hear it again. The next time, they listened for a detail they had missed—and carried that detail into their own retelling.</p><p>By morning, the story had travelled. It was still familiar, and it had room for a new voice.</p></div><div class="story-credit-note">${icon('heart', 16)} Stories belong to the people and communities who share them. Listen with care, and ask before retelling.</div></div></section>${renderStepper(['Choose a story', 'Read', 'Listen', 'Reflect'], 3)}<section class="story-quiz"><div><span class="section-kicker">A little reflection</span><h2>What helped the story travel?</h2><p>Choose the idea that best fits what you heard.</p></div><div class="story-answer-list">${[['Someone listened and shared it with care.', true], ['The story was written down by a stranger.', false], ['The children forgot the details.', false]].map(([label, correct], i) => `<button class="story-answer ${result === 'correct' && correct ? 'answer-correct' : ''}" data-action="story-answer" data-key="comprehension" data-correct="${correct}" ${result === 'correct' ? 'disabled' : ''}><span>${String.fromCharCode(65 + i)}</span>${label}${result === 'correct' && correct ? icon('check', 17) : icon('arrow', 15)}</button>`).join('')}</div>${result ? `<div class="answer-feedback ${result === 'correct' ? 'feedback-correct' : 'feedback-retry'}">${icon(result === 'correct' ? 'check' : 'refresh', 16)} ${result === 'correct' ? 'Lovely listening. Stories grow when people share them with care.' : 'Think about what the children did after hearing the story.'}</div>` : ''}</section><div class="story-related">${routeLink('oral', 'Explore oral traditions ' + icon('arrow', 14), 'text-link')}${routeLink('ere', 'Back to stories ' + icon('arrow', 14), 'text-link')}${aiHelperButton('story')}</div></div>`;
  }

  function renderOral() {
    const genres = [
      { title: 'Oríkì', titleSub: 'Praise poetry', copy: 'Explore poetic praise, identity and remembrance through context and community voices.', icon: 'quote', route: 'oriki', tone: 'peach' },
      { title: 'Òwe', titleSub: 'Proverbs', copy: 'Notice how compact sayings can hold wit, wisdom and ways of seeing the world.', icon: 'sparkles', route: 'owe', tone: 'mint' },
      { title: 'Story & song', titleSub: 'Oral genres', copy: 'Find out how stories, songs and spoken forms carry memory across generations.', icon: 'music', route: 'oral_genre', tone: 'blue' }
    ];
    return `<div class="container route-page oral-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Read & listen</strong></div><section class="oral-hero"><div class="oral-hero-copy"><span class="section-kicker">Voices, memory & meaning</span><h1>Some knowledge is<br /><em>spoken into the room.</em></h1><p>Listen to the forms that carry language through family and community—from praise poetry to proverbs and story.</p><div class="hero-actions">${routeLink('voices', `Hear the voice library ${icon('arrow', 15)}`, 'button button-primary')}${routeLink('ere', `${icon('book', 15)} Read a story`, 'button button-outline')}${aiHelperButton('oral')}</div></div><div class="oral-hero-image"><img src="./assets/story-grandmother.jpg" alt="A grandmother sharing an oral story with children" /><span class="oral-image-note">Listen first. Learn the context.</span></div></section>${renderStepper(['Tradition', 'Genre', 'Piece', 'Reflection'], 0)}<section class="section oral-genres"><div class="section-heading"><div><span class="section-kicker">Choose a doorway</span><h2>Explore oral traditions.</h2><p>Each form has its own voice, purpose and place in community.</p></div></div><div class="oral-genre-grid">${genres.map((g) => `<a class="oral-genre-card tone-${g.tone}" href="#/${g.route}" data-route="${g.route}"><span class="oral-genre-icon">${icon(g.icon, 23)}</span><span class="oral-genre-sub">${g.titleSub}</span><h3>${g.title}</h3><p>${g.copy}</p><span class="oral-genre-arrow">Explore ${icon('arrow', 15)}</span></a>`).join('')}</div></section><section class="oral-quote-band"><span>${icon('quote', 25)}</span><div><strong>Stories are not just content.</strong><p>They are relationships—between speaker, listener, place and memory.</p></div>${routeLink('keepers', 'Meet the keepers ' + icon('arrow', 14), 'text-link')}</section></div>`;
  }

  function renderOralGenre() {
    const cards = [
      { route: 'oriki', title: 'Oríkì', subtitle: 'Praise poetry & identity', icon: 'quote', tone: 'peach', text: 'Learn what praise poetry can express and how to listen for context.' },
      { route: 'owe', title: 'Òwe', subtitle: 'Proverbs & reflection', icon: 'sparkles', tone: 'mint', text: 'Explore short sayings and the ideas people carry through them.' },
      { route: 'ere', title: 'Folktales', subtitle: 'Stories & imagination', icon: 'book', tone: 'blue', text: 'Read a family story and notice what travels between generations.' },
      { route: 'voices', title: 'Spoken word', subtitle: 'Voices & pronunciation', icon: 'headphones', tone: 'yellow', text: 'Hear words spoken and build confidence through listening.' }
    ];
    return `<div class="container route-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span><strong>Genres</strong></div><section class="collection-hero simple-collection-hero"><span class="section-kicker">Oral forms · a guided introduction</span><h1>Many ways to tell<br /><em>what matters.</em></h1><p>Oral traditions are varied and living. Explore a form, listen for its context and follow the voice that leads you in.</p>${renderStepper(['Tradition', 'Genre', 'Example', 'Reflect'], 1)}</section><div class="section-heading collection-heading"><div><span class="section-kicker">Choose a genre</span><h2>Where would you like to begin?</h2></div>${aiHelperButton('oral')}</div><div class="oral-genre-grid">${cards.map((c) => `<a href="#/${c.route}" data-route="${c.route}" class="oral-genre-card tone-${c.tone}"><span class="oral-genre-icon">${icon(c.icon, 23)}</span><span class="oral-genre-sub">${c.subtitle}</span><h3>${c.title}</h3><p>${c.text}</p><span class="oral-genre-arrow">Explore ${icon('arrow', 15)}</span></a>`).join('')}</div><div class="content-note">${icon('shield', 17)} These introductions are a starting point. Community context, consent and attribution should guide how oral knowledge is shared.</div></div>`;
  }

  function renderOriki() {
    return `<div class="container route-page culture-detail-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span>${routeLink('oral_genre', 'Oral genres')}<span>/</span><strong>Oríkì</strong></div><section class="culture-detail-hero"><div><span class="section-kicker">Yorùbá oral tradition · guided introduction</span><h1>Oríkì:<br /><em>praise that remembers.</em></h1><p>Oríkì is often described as praise poetry, but each piece carries the voice, knowledge and context of the people who share it.</p><div class="hero-actions"><button class="button button-primary" data-action="play-audio" data-text="Oriki is a living form of praise and remembrance.">${icon('volume', 17)} Hear a short introduction</button>${aiHelperButton('oriki')}</div></div><div class="culture-detail-art"><img src="./assets/yoruba-educator-woman.jpg" alt="Yorùbá woman educator wearing richly woven aso-oke attire" /><div class="culture-art-caption">Hear the voice.<br />Ask about the meaning.</div></div></section>${renderStepper(['Tradition', 'Genre', 'Piece', 'Reflection'], 2)}<div class="detail-content-grid"><article class="detail-reading"><span class="section-kicker">A way to listen</span><h2>Notice more than the words.</h2><p>Listen for rhythm, repetition and the relationship between the speaker and the person being addressed. A phrase may carry family history, place, humour or a quality someone is known for.</p><p>There is no single version that speaks for everyone. Meaning changes with voice and context, so learn from the people who know the story behind the words.</p><div class="detail-prompt"><strong>Try this reflection</strong><p>What do you notice about the speaker’s tone? What would you want to ask before repeating the words?</p></div><div class="detail-actions">${routeLink('voices', 'Explore voices ' + icon('arrow', 14), 'text-link')}${routeLink('keepers', 'Learn from keepers ' + icon('arrow', 14), 'text-link')}</div></article><aside class="detail-side-card"><span class="side-card-icon">${icon('heart', 21)}</span><span class="section-kicker">Learn with care</span><h3>Context makes listening more meaningful.</h3><p>Ask who is sharing, what the words mean to them and whether the story is theirs to pass on.</p>${aiHelperButton('oriki')}${routeLink('oral_genre', 'More oral forms ' + icon('arrow', 14), 'text-link')}</aside></div></div>`;
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
        <div class="owe-feature-photo"><img src="./assets/yoruba-educator-woman.jpg" alt="Yorùbá woman educator in richly woven aso-oke attire" /><div class="owe-feature-shade"></div><div class="owe-feature-content"><span class="section-kicker">A guided proverb · step one</span><blockquote>Sùúrù ni baba ìwà.</blockquote><p>A common classroom rendering: “Patience is the father of good character.”</p><span class="owe-feature-credit">Translations vary; learn with a fluent speaker.</span></div></div>
      </section>
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
    return `<div class="container route-page voices-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('oral', 'Read & listen')}<span>/</span><strong>Voice library</strong></div><section class="voices-hero"><div><span class="section-kicker">Listen close · speak with confidence</span><h1>Every word has<br /><em>a voice of its own.</em></h1><p>Listen to short sample phrases, notice the rhythm and practice at your own pace.</p></div><div class="voice-orbit"><span class="orbit-core">${icon('volume', 30)}</span><span class="orbit-word orbit-one">Ẹ káàárọ̀</span><span class="orbit-word orbit-two">Ndewo</span><span class="orbit-word orbit-three">Sannu</span><span class="orbit-word orbit-four">Habari</span></div></section>${renderStepper(['Choose a language', 'Hear a phrase', 'Practice', 'Remember'], 1)}<section class="voice-list-section"><div class="section-heading"><div><span class="section-kicker">Try a greeting</span><h2>Choose a phrase and listen.</h2><p>Audio here is a browser-based prototype sample. Production recordings should be approved by native speakers.</p></div><span class="demo-badge">Sample phrases</span></div><div class="voice-list">${voices.map((v) => { const l = getLanguage(v.lang); return `<article class="voice-row"><span class="voice-language-mark lang-${v.tint}">${l.glyph}</span><div class="voice-row-copy"><span class="voice-row-lang">${l.name} · ${v.speaker}</span><strong>${v.phrase}</strong><small>${v.translation}</small></div><div class="voice-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><button class="voice-play" data-action="play-audio" data-text="${esc(v.phrase)}" aria-label="Play ${esc(v.phrase)}">${icon('play', 16)}</button></article>`; }).join('')}</div><div class="voice-access-note">${icon('shield', 16)} Language audio and pronunciation need review by fluent speakers before public release.</div></section></div>`;
  }

  function renderGeneric(key) {
    const meta = PAGE_META[key];
    if (!meta) return renderDirectory();
    const imageSrc = meta.image === 'story' ? './assets/story-grandmother.jpg' : meta.image === 'code' ? './assets/code-kids.jpg' : meta.image === 'kids' ? './assets/yoruba-kids-culture.jpg' : meta.image === 'hero' ? './assets/hero-reader.jpg' : '';
    const cards = meta.cards.map((card) => `<a class="editorial-card tone-${card.tone || 'mint'}" href="#/${card.route}" data-route="${card.route}"><span class="editorial-card-icon">${icon(card.icon, 20)}</span><span class="editorial-card-overline">Explore</span><h3>${card.title}</h3><p>${card.text}</p><span class="editorial-card-go">Learn more ${icon('arrow', 14)}</span></a>`).join('');
    const interestForm = meta.form ? `<form class="interest-form" data-form="interest"><label for="interestEmail">${meta.form === 'school' ? 'Get school updates' : 'Ask about guided learning'}</label><div><input id="interestEmail" name="email" type="email" placeholder="Your email address" required /><button type="submit">${icon('send', 16)} <span>Send interest</span></button></div><small>Prototype only—your details are not sent.</small></form>` : '';
    return `<div class="container route-page editorial-page page-${key}">
      <div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>${meta.eyebrow}</strong></div>
      <section class="editorial-hero"><div class="editorial-copy"><span class="section-kicker">${meta.eyebrow}</span><h1>${meta.title}</h1><p>${meta.desc}</p><div class="editorial-actions">${routeLink(meta.ctaRoute, `${meta.cta} ${icon('arrow', 15)}`, 'button button-primary')}${key !== 'about' ? routeLink('about', 'About Idilewa', 'text-link') : ''}</div><div class="editorial-proof">${icon('shield', 16)} Warm, accessible and built to grow with learners.</div></div><div class="editorial-visual ${meta.image ? 'has-photo' : ''}">${imageSrc ? `<img src="${imageSrc}" alt="${meta.imageAlt}" />` : `<div class="editorial-illustration tone-mint">${icon(meta.icon || 'sparkles', 50)}<span class="editorial-spark">✦</span><span class="editorial-orbit">${meta.eyebrow}</span></div>`}<div class="visual-note">${icon(meta.icon || 'sparkles', 16)} <span>Rooted in language<br />open to the future</span></div></div></section>
      <div class="editorial-body"><div class="editorial-main"><section class="editorial-cards-section"><div class="section-heading"><div><span class="section-kicker">A thoughtful way to begin</span><h2>Explore what matters to you.</h2><p>Choose a next step or follow your curiosity.</p></div></div><div class="editorial-card-grid">${cards}</div></section>${interestForm}<section class="editorial-footer-note"><span>${icon('heart', 18)}</span><p>Idilewa is designed to be welcoming for children and useful for adults—with privacy, consent and cultural context in mind.</p></section></div><aside class="editorial-aside"><div class="aside-path-card"><span class="section-kicker">A clear journey</span><h3>See your next step.</h3>${renderStepper(meta.flow || ['Discover', 'Choose', 'Practice', 'Grow'], meta.active || 0)}<p>Each path keeps the next layer easy to find.</p><a class="text-link" href="#/base" data-route="base">Explore all spaces ${icon('arrow', 14)}</a></div><div class="aside-quote-card"><span>${icon(meta.icon || 'leaf', 19)}</span><p>“Language is a bridge between who we are and what we can imagine.”</p><small>Idilewa learning principle</small></div></aside></div>
    </div>`;
  }

  function renderDirectory() {
    const groups = [
      { title: 'Learn & practice', text: 'Language learning from the first choice to the next small win.', pages: ['index', 'languages', 'course', 'lesson', 'kids', 'individuals', 'families', 'schools', 'tutor', 'profile', 'connect_teachers', 'connect_students'] },
      { title: 'Stories & living culture', text: 'Explore oral traditions, voices, guides and cultural context.', pages: ['ere', 'ere_game', 'oral', 'oral_genre', 'oriki', 'owe', 'owe_add', 'owe_detail', 'owe_story', 'owe_reflection', 'voices', 'ifa', 'ifa_odu', 'guides', 'human', 'keepers'] },
      { title: 'Technology & Idilewa', text: 'Discover bilingual coding, the learning approach and platform spaces.', pages: ['coding', 'about', 'method', 'pricing', 'login', 'consent', 'base'] }
    ];
    return `<div class="container route-page directory-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>Explore all spaces</strong></div><section class="directory-hero"><span class="section-kicker">The Idilewa map</span><h1>One home.<br /><em>Many ways to belong.</em></h1><p>Start with a language, follow a story, explore culture or build something new.</p>${renderStepper(['Language', 'Level', 'Module', 'Lesson'], 0)}</section>${groups.map((g) => `<section class="directory-group"><div class="directory-heading"><div><span class="section-kicker">A learning layer</span><h2>${g.title}</h2><p>${g.text}</p></div><span class="directory-count">${g.pages.length} spaces</span></div><div class="directory-links">${g.pages.map((page) => `<a href="#/${page}" data-route="${page}" class="directory-link"><span>${icon(page === 'coding' ? 'code' : page.includes('oral') || page.includes('ere') || page === 'voices' ? 'book' : page === 'schools' || page === 'tutor' || page === 'families' || page === 'connect_students' || page === 'connect_teachers' ? 'people' : 'sparkles', 17)}</span><strong>${LABELS[page]}</strong>${icon('arrow', 15)}</a>`).join('')}</div></section>`).join('')}<div class="directory-note">${icon('info', 17)} Every named prototype route is connected through this route map and the main navigation.</div></div>`;
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
    const signupFields = signUp ? `<label for="authName">Name to use in your learning space<input id="authName" name="name" autocomplete="name" placeholder="Use a nickname in this demo" required /></label><label for="signupType">Who is learning?<select id="signupType" name="accountType"><option value="child" selected>Child learner</option><option value="adult">Adult learner</option></select></label><div id="signupConsentFields" class="signup-consent-fields"><label for="signupConsentCode">Parent-approved consent code<input id="signupConsentCode" type="text" name="consentCode" maxlength="12" autocomplete="off" placeholder="ID-123456" required /></label><p>${activeGrant ? 'A parent approval is active on this device.' : 'No code yet? A parent or guardian must complete the signed form first.'} ${routeLink('consent', 'Open family consent ' + icon('arrow', 14), 'text-link')}</p></div>` : '';
    const signinFields = !signUp ? `<label for="signinType">Who is learning?<select id="signinType" name="accountType"><option value="child" selected>Child learner</option><option value="adult">Adult learner</option></select></label><div id="signinConsentFields" class="signup-consent-fields"><label for="signinConsentCode">Parent-approved consent code<input id="signinConsentCode" type="text" name="consentCode" maxlength="12" autocomplete="off" placeholder="ID-123456" required /></label><p>${activeGrant ? 'A parent approval is active on this device.' : 'A parent or guardian must approve the child first.'} ${routeLink('consent', 'Start family consent ' + icon('arrow', 14), 'text-link')}</p></div>` : '';
    const signupFooter = signUp ? '<label class="consent-check"><input type="checkbox" name="demoOnly" value="yes" required /><span>I understand this is a prototype; no account or password will be saved.</span></label>' : '<button class="forgot-link" type="button" data-action="forgot-password">Forgot password?</button>';
    const loginJourneyStep = activeGrant ? (signUp ? 2 : 1) : 0;
    const authLayers = [
      { title: 'Choose who is learning', text: 'Adults can explore independently. A child path starts with a parent or guardian, not a child entering personal details.' },
      { title: 'Get signed family approval', text: 'A guardian reviews the request and signs. Approval for a tutor is a separate, named choice.' },
      { title: 'Check the approved code', text: 'The code is a local prototype check only; it is not a real account credential or secure verification service.' },
      { title: 'Continue safely', text: 'You can explore language paths without signing in. Never enter a real password, full name or contact detail here.' }
    ];
    return `<div class="container route-page auth-page"><div class="auth-art"><div class="auth-image"><img src="./assets/hero-reader.jpg" alt="A young learner reading at home" /><div class="auth-art-note">Keep your language<br /><strong>close to your heart.</strong></div></div><div class="auth-quote">“Èdè wa, àṣà wa, ìdílé wa.”<small>Our language. Our culture. Our family.</small></div></div><div class="auth-panel"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span><strong>${signUp ? 'Create an account' : 'Sign in'}</strong></div>${renderStepper(signUp ? ['Choose learner', 'Guardian form', 'Check code', 'Start learning'] : ['Choose learner', 'Verify parent code', 'Open a path', 'Keep growing'], loginJourneyStep)}<span class="section-kicker">Welcome to your learning space</span><h1>${signUp ? 'Let’s make room for what you love.' : 'Good to have you back.'}</h1><p>${signUp ? 'For a child learner, parent approval must be completed before sign-up.' : 'A child must validate a parent-approved consent code before continuing.'}</p><div class="auth-toggle"><button class="${!signUp ? 'active' : ''}" data-action="login-mode" data-mode="signin">Sign in</button><button class="${signUp ? 'active' : ''}" data-action="login-mode" data-mode="signup">Create account</button></div><form class="auth-form" data-form="login"><label for="authEmail">Email address<input id="authEmail" type="email" name="email" autocomplete="email" placeholder="you@example.com" required /></label>${signupFields}${signinFields}<label for="authPassword">Password<input id="authPassword" type="password" name="password" autocomplete="${signUp ? 'new-password' : 'current-password'}" minlength="8" placeholder="At least 8 characters" required /></label>${signupFooter}<button class="button button-primary auth-submit" type="submit">${signUp ? 'Check consent & continue' : 'Sign in'} ${icon('arrow', 15)}</button></form><div class="auth-safe-note">${icon('shield', 16)} Sign-in is not connected. Never enter a real password or personal details in this demo.</div><div class="auth-separator"><span>or explore first</span></div>${routeLink('languages', 'Continue without an account ' + icon('arrow', 14), 'auth-continue')}${routeLink('consent', 'Parent / guardian consent ' + icon('arrow', 14), 'text-link')}<section class="auth-layer-guide" aria-labelledby="auth-layer-title" data-access-check-count="4"><div class="auth-layer-guide-heading"><span class="section-kicker">Family-first access checks</span><h2 id="auth-layer-title">A clear route into learning.</h2><p>Access follows the learner’s age, guardian permission and the choice to keep exploring safely.</p></div><div class="auth-layer-guide-grid">${authLayers.map((layer, index) => `<article class="auth-layer-card"><span>0${index + 1}</span><div><h3>${layer.title}</h3><p>${layer.text}</p></div></article>`).join('')}</div></section></div></div>`;
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
    return `<div class="container route-page connection-page connect-teachers-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('families', 'Community')}<span>/</span><strong>Connect with Teachers</strong></div>
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
    return `<div class="container route-page connection-page connect-students-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('families', 'Community')}<span>/</span><strong>Connect with Students</strong></div>
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
    return `<div class="container route-page consent-page"><div class="breadcrumbs">${routeLink('index', 'Home')}<span>/</span>${routeLink('families', 'Community')}<span>/</span><strong>Parent & guardian consent</strong></div><section class="consent-hero"><div><span class="section-kicker">A clear, family-first safeguard</span><h1>Permission before<br /><em>connection.</em></h1><p>A short guardian-signed form comes first. Only then can the child receive a code—and a tutor must validate that same code before a learner assignment opens.</p><div class="consent-hero-tags"><span>${icon('lock', 15)} No child contact details</span><span>${icon('shield', 15)} Tutor-specific approval</span></div></div><div class="consent-hero-image"><img src="./assets/hero-reader.jpg" alt="A parent and child reviewing a learning activity together" /><span>Illustrative family learning scene.</span></div></section>${renderStepper(['Request code', 'Guardian form', 'Approved code', 'Use & validate'], activeStep)}${body}<div class="consent-four-rules"><article><strong>1. Request</strong><span>A reference is created for the parent to review.</span></article><article><strong>2. Sign</strong><span>Guardian role, permissions and typed signature are required.</span></article><article><strong>3. Issue</strong><span>A child code appears only after the form passes its checks.</span></article><article><strong>4. Validate</strong><span>Signup and a named tutor must validate the approved code.</span></article></div><div class="consent-security-note">${icon('info', 16)} Browser storage is not secure verification. A production service needs a protected backend, guardian identity/authority checks, expiring one-time tokens, audit records, secure account controls and a reviewed child-safeguarding/legal process.</div></div>`;
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

  function renderPage(page, params) {
    switch (page) {
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
    'how-it-works-journey.jpg',
    'stories-culture.jpg',
    'page-index-1.jpg', 'page-index-2.jpg', 'page-index-3.jpg', 'page-index-4.jpg',
    'page-index-5.jpg', 'page-index-6.jpg', 'page-index-7.jpg',
    'page-about-1.jpg', 'page-base-1.jpg', 'page-coding-1.jpg',
    'page-languages-1.jpg', 'page-course-1.jpg', 'page-lesson-1.jpg', 'page-kids-1.jpg',
    'page-families-1.jpg', 'page-schools-1.jpg', 'page-connect_teachers-1.jpg',
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
    families: 'A Nigerian family practicing language together around a breakfast table',
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
    'families-1': 'A Nigerian family sharing picture cards and practicing a phrase at breakfast',
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
      if (page === 'index' && sourceMatch && sourceMatch[2].includes('stories-culture.jpg')) return tag.replace(/\bsrc=("|')[^"']*(?:\1)/i, `src="${imageUrl('stories-culture.jpg')}"`);
      slot += 1;
      const filename = ROUTE_IMAGE_OVERRIDES[`${page}-${slot}`] || `page-${page}-${slot}.jpg`;
      const alt = routeImageAlt(page, slot, tag);
      if (!IMAGE_READY.has(filename)) return page !== 'index' && slot > 1 ? '' : imagePendingMarkup(alt);
      let rewritten = tag.replace(/\bsrc=("|')[^"']*(?:\1)/i, `src="${imageUrl(filename)}"`);
      if (/\balt=("|')[^"']*(?:\1)/i.test(rewritten)) rewritten = rewritten.replace(/\balt=("|')[^"']*(?:\1)/i, `alt="${esc(alt)}"`);
      else rewritten = rewritten.replace('<img', `<img alt="${esc(alt)}"`);
      return rewritten;
    });
    if (slot === 0) {
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
    return `<section class="page-information-layers how-it-works-section" aria-label="How it works · A simple journey to deeper understanding">
      <div class="container how-it-works-container">
        <div class="how-it-works-banner">
          <img src="${imageUrl('how-it-works-journey.jpg')}" alt="How it works: A simple journey to deeper understanding. 01 Orient - Understand oral knowledge; 02 Understand - Choose a genre; 03 Information Object - Read a proverb; 04 Context / Example - Listen to a voice; 05 Practice / Decision - Ask for context; 06 Reflect / Continue - Share respectfully." class="how-it-works-image" loading="lazy" />
        </div>
      </div>
    </section>`;
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
    const list = q ? searchable.filter((item) => `${item.title} ${item.summary}`.toLowerCase().includes(q)).slice(0, 7) : searchable.filter((item) => ['languages', 'course', 'ere', 'coding', 'oral', 'families'].includes(item.route)).slice(0, 6);
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
      case 'pair-language': break;
      case 'save-item': {
        const item = el.dataset.item;
        state.saved = state.saved.includes(item) ? state.saved.filter((x) => x !== item) : [...state.saved, item];
        saveState(); render(); showToast(state.saved.includes(item) ? 'Saved to your reading list.' : 'Removed from your reading list.'); break;
      }
      case 'billing-period': state.billing = el.dataset.period; saveState(); render(); break;
      case 'choose-plan': openModal(`${el.dataset.plan || 'Family'} updates`, 'Your interest has been noted in this browser preview. The Idilewa team will confirm final plans and pricing before launch.'); break;
      case 'login-mode': state.loginMode = el.dataset.mode === 'signup' ? 'signup' : 'signin'; render(); break;
      case 'forgot-password': openModal('Password reset', 'Password reset will be available when secure account services are connected. Do not use a real password in this prototype.'); break;
      case 'close-search': document.getElementById('modal-root').innerHTML = ''; break;
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
      if (state.loginMode === 'signup') {
        const accountType = String(data.get('accountType') || 'child');
        if (accountType === 'child') {
          const code = String(data.get('consentCode') || '').trim().toUpperCase();
          if (!consentCodeIsActive() || !state.consent.accountApproved || code !== state.consent.approvedCode) {
            showToast('A parent-signed consent form and valid code are required before a child can continue.', 'error');
            navigate('consent'); return;
          }
          state.consent.childVerified = true; saveState(); render();
          showToast('Parent approval validated. No account or password was created or stored by this demo.'); return;
        }
        showToast('Adult sign-up is a visual preview only. No account or password was created or stored.'); return;
      }
      const accountType = String(data.get('accountType') || 'child');
      if (accountType === 'child') {
        const code = String(data.get('consentCode') || '').trim().toUpperCase();
        if (!consentCodeIsActive() || !state.consent.accountApproved || code !== state.consent.approvedCode) {
          showToast('A parent-approved consent code is required before a child can sign in.', 'error');
          navigate('consent'); return;
        }
        state.consent.childVerified = true; saveState();
        openModal('Parent approval checked', 'The active guardian-approved code was validated on this device. Real sign-in is not connected, and no account or password was created or stored.'); return;
      }
      openModal('Sign-in is a visual preview', 'No real account service is connected. Never enter a real password or personal details here.');
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

