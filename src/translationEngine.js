// Multi-Language Translation & Speech Synthesis Engine (English -> Yorùbá, Igbo, Hausa)

export const DICTIONARY = {
  // Greetings & Courtesies
  'hello': { yo: 'Báwo ni?', ig: 'Kedu?', ha: 'Sannu', phoneticYo: 'BAH-woh nee', toneYo: 'Mí-Re' },
  'hi': { yo: 'Báwo ni', ig: 'Ndewo', ha: 'Sannu', phoneticYo: 'BAH-woh nee', toneYo: 'Mí-Re' },
  'good morning': { yo: 'Ẹ káàárọ̀', ig: 'Ụtụtụ ọma', ha: 'Ina kwana', phoneticYo: 'Eh KAH-ah-raw', toneYo: 'Mid-High-Low' },
  'good afternoon': { yo: 'Ẹ káàsán', ig: 'Ehihie ọma', ha: 'Ina wuni', phoneticYo: 'Eh KAH-ah-sahn', toneYo: 'Mid-High-High' },
  'good evening': { yo: 'Ẹ kúulẹ́', ig: 'Mgbede ọma', ha: 'Barka da yamma', phoneticYo: 'Eh KOO-leh', toneYo: 'Mid-High-High' },
  'good night': { yo: 'O dárọ̀', ig: 'Ka chi foo', ha: 'Mu kwana lafiya', phoneticYo: 'Oh DAH-raw', toneYo: 'Mid-High-Low' },
  'how are you': { yo: 'Báwo ni nǹkan?', ig: 'Kedu ka i mere?', ha: 'Yaya kake / Yaya kike?', phoneticYo: 'BAH-woh nee n-KAHN', toneYo: 'Mí-Re-Dò' },
  'how are you doing': { yo: 'Ṣé àlàáfíà ni?', ig: 'Kedu ka ị mere taa?', ha: 'Yaya aiki?', phoneticYo: 'Sheh ah-lah-FEE-ah nee', toneYo: 'Mí-Dò-Mí-Dò-Re' },
  'i am fine': { yo: 'Mo wà dáadáa', ig: 'Adị m mma', ha: 'Ina lafiya', phoneticYo: 'Moh wah DAH-dah', toneYo: 'Re-Dò-Mí-Mí' },
  'thank you': { yo: 'Ẹ ṣeé púpọ̀', ig: 'Dalu / Imela', ha: 'Nagode sosai', phoneticYo: 'Eh SHEH poo-PAW', toneYo: 'Re-Mí-Re-Dò' },
  'thank you very much': { yo: 'Ẹ ṣeun púpọ̀ gidigidi', ig: 'Dalu nke ukwuu', ha: 'Nagode kwarai da gaske', phoneticYo: 'Eh shay-OON poo-paw gee-dee-gee-dee', toneYo: 'Re-Mí-Re-Dò' },
  'welcome': { yo: 'Ẹ káàbọ̀', ig: 'Nnọọ', ha: 'Barka da zuwa', phoneticYo: 'Eh KAH-ah-baw', toneYo: 'Re-High-Low' },
  'please': { yo: 'Ẹ jọ̀wọ́', ig: 'Biko', ha: 'Don Allah', phoneticYo: 'Eh JAW-waw', toneYo: 'Re-Low-High' },
  'sorry': { yo: 'Pẹ̀lẹ́ o', ig: 'Ndo', ha: 'Kayi hakuri', phoneticYo: 'PEH-leh oh', toneYo: 'Low-High-Re' },
  'yes': { yo: 'Bẹ́ẹ̀ni', ig: 'Ee / Eyaa', ha: 'Eh / Ii', phoneticYo: 'BEH-eh-nee', toneYo: 'High-High-Re' },
  'no': { yo: 'Rárá', ig: 'Mba', ha: 'A\'a', phoneticYo: 'RAH-RAH', toneYo: 'High-High' },
  'excuse me': { yo: 'Ẹ dákun', ig: 'Biko chere', ha: 'Gafara dai', phoneticYo: 'Eh DAH-koon', toneYo: 'Re-High-Re' },
  'goodbye': { yo: 'O dábọ̀', ig: 'Ka omesịa', ha: 'Sai anjima', phoneticYo: 'Oh DAH-baw', toneYo: 'Re-High-Low' },
  'see you later': { yo: 'A ó tún ríra', ig: 'Ka anyị hụ ọzọ', ha: 'Sai mun hadu', phoneticYo: 'Ah oh TOON REE-rah', toneYo: 'Re-High-High-High-Low' },
  'congratulations': { yo: 'Ẹ kú oríire', ig: 'Ekele diri gi', ha: 'Barka', phoneticYo: 'Eh koo oh-REE-ee-reh', toneYo: 'Re-High-Re-High-Re-Re' },

  // Identity & Family
  'what is your name': { yo: 'Kí ni orúkọ rẹ?', ig: 'Gịnị bụ aha gị?', ha: 'Menene sunanka?', phoneticYo: 'KEE nee oh-ROO-kaw reh', toneYo: 'High-Re-Re-High-Re-Re' },
  'my name is': { yo: 'Orúkọ mi ni', ig: 'Aha m bụ', ha: 'Sunana', phoneticYo: 'Oh-ROO-kaw mee nee', toneYo: 'Re-High-Re-Re-Re' },
  'family': { yo: 'Ìdílé', ig: 'Ezinụlọ', ha: 'Iyali', phoneticYo: 'ee-DEE-lay', toneYo: 'Low-High-High' },
  'mother': { yo: 'Ìyá', ig: 'Nne', ha: 'Uwa', phoneticYo: 'ee-YAH', toneYo: 'Low-High' },
  'father': { yo: 'Bàbá', ig: 'Nna', ha: 'Uba', phoneticYo: 'bah-BAH', toneYo: 'Low-High' },
  'child': { yo: 'Ọmọ', ig: 'Nwa', ha: 'Yaro / Yara', phoneticYo: 'aw-MAW', toneYo: 'Re-Re' },
  'children': { yo: 'Àwọn ọmọ', ig: 'Ụmụaka', ha: 'Yara', phoneticYo: 'AH-wawn aw-MAW', toneYo: 'Low-Re-Re-Re' },
  'brother': { yo: 'Arákùnrin', ig: 'Nwanne nwoke', ha: 'Dan uwa', phoneticYo: 'ah-rah-KOON-reen', toneYo: 'Re-High-Low-Re' },
  'sister': { yo: 'Arábìnrin', ig: 'Nwanne nwanyị', ha: 'Yar uwa', phoneticYo: 'ah-rah-BEEN-reen', toneYo: 'Re-High-Low-Re' },
  'friend': { yo: 'Ọ̀rẹ́', ig: 'Enyi', ha: 'Aboki', phoneticYo: 'aw-REH', toneYo: 'Low-High' },
  'teacher': { yo: 'Olùkọ́', ig: 'Onye nkuzi', ha: 'Malami', phoneticYo: 'oh-loo-KAW', toneYo: 'Re-Low-High' },
  'student': { yo: 'Akẹ́kọ̀ọ́', ig: 'Nwa akwụkwọ', ha: 'Dalibi', phoneticYo: 'ah-keh-KAW-aw', toneYo: 'Re-High-Low-High' },
  'home': { yo: 'Ilé', ig: 'Ụlọ', ha: 'Gida', phoneticYo: 'ee-LEH', toneYo: 'Re-High' },
  'school': { yo: 'Ilé-ìwé', ig: 'Ụlọ akwụkwọ', ha: 'Makaranta', phoneticYo: 'ee-LEH ee-WEH', toneYo: 'Re-High-Low-High' },

  // Language & Learning
  'language': { yo: 'Èdè', ig: 'Asụsụ', ha: 'Harshe', phoneticYo: 'eh-DEH', toneYo: 'Low-High' },
  'yoruba language': { yo: 'Èdè Yorùbá', ig: 'Asụsụ Yoruba', ha: 'Harshen Yarabanci', phoneticYo: 'eh-DEH yoh-roo-BAH', toneYo: 'Low-High-Re-Low-High' },
  'igbo language': { yo: 'Asụsụ Igbo', ig: 'Asụsụ Igbo', ha: 'Harshen Igbanci', phoneticYo: 'ah-soo-SOO Eeg-boh', toneYo: 'Re-Low-High' },
  'hausa language': { yo: 'Harshen Hausa', ig: 'Asụsụ Hausa', ha: 'Harshen Hausa', phoneticYo: 'HAHR-shen HOW-sah', toneYo: 'Re-Re-Re' },
  'i want to learn': { yo: 'Mo fẹ́ kọ́ ẹ̀kọ́', ig: 'Achọrọ m ịmụ ihe', ha: 'Ina so in koya', phoneticYo: 'Moh FEH KAW EH-kaw', toneYo: 'Re-High-High-Low-High' },
  'i love my culture': { yo: 'Mo nífẹ̀ẹ́ àṣà mi', ig: 'Ahụrụ m omenala m n\'anya', ha: 'Ina son al\'adata', phoneticYo: 'Moh NEE-feh-eh AH-shah mee', toneYo: 'Re-High-Low-High-Low-Low-Re' },
  'code': { yo: 'Koodu', ig: 'Koodu', ha: 'Lambar kwamfuta', phoneticYo: 'KOH-oh-doo', toneYo: 'High-High-Re' },
  'computer': { yo: 'Kọ̀mpútà', ig: 'Kọmputa', ha: 'Kwamfuta', phoneticYo: 'kawm-POO-tah', toneYo: 'Low-High-Low' },
  'story': { yo: 'Ìtàn', ig: 'Akụkọ', ha: 'Labari', phoneticYo: 'ee-TAHN', toneYo: 'Low-High' },
  'proverb': { yo: 'Òwe', ig: 'Ilu', ha: 'Karin magana', phoneticYo: 'oh-WEH', toneYo: 'Low-High' },
  'music': { yo: 'Orin', ig: 'Egwú', ha: 'Waka', phoneticYo: 'oh-REEN', toneYo: 'Re-Re' },
  'voice': { yo: 'Ohùn', ig: 'Olu', ha: 'Murya', phoneticYo: 'oh-HOON', toneYo: 'Re-Low' },
  'speak': { yo: 'Sọ̀rọ̀', ig: 'Kwuwa okwu', ha: 'Yi magana', phoneticYo: 'SAW-raw', toneYo: 'Low-Low' },
  'listen': { yo: 'Gbọ́', ig: 'Gee ntị', ha: 'Saurara', phoneticYo: 'GBOH', toneYo: 'High' },
  'read': { yo: 'Ka ìwé', ig: 'Gụọ akwụkwọ', ha: 'Karanta', phoneticYo: 'Kah ee-WEH', toneYo: 'Re-Low-High' },
  'write': { yo: 'Kọ̀wé', ig: 'Dee ihe', ha: 'Rubuta', phoneticYo: 'kaw-WEH', toneYo: 'Low-High' },

  // Numbers 1 to 10
  'one': { yo: 'Ọ̀kan (1)', ig: 'Otu (1)', ha: 'Daya (1)', phoneticYo: 'aw-KAHN', toneYo: 'Low-Mid' },
  'two': { yo: 'Èjì (2)', ig: 'Abụọ (2)', ha: 'Biyu (2)', phoneticYo: 'eh-JEE', toneYo: 'Low-High' },
  'three': { yo: 'Ẹ̀ta (3)', ig: 'Atọ (3)', ha: 'Uku (3)', phoneticYo: 'eh-TAH', toneYo: 'Low-Mid' },
  'four': { yo: 'Ẹ̀rin (4)', ig: 'Anọ (4)', ha: 'Hudu (4)', phoneticYo: 'eh-REEN', toneYo: 'Low-Mid' },
  'five': { yo: 'Àrún (5)', ig: 'Ise (5)', ha: 'Biyar (5)', phoneticYo: 'ah-ROON', toneYo: 'Low-High' },
  'six': { yo: 'Ẹ̀fà (6)', ig: 'Isii (6)', ha: 'Shida (6)', phoneticYo: 'eh-FAH', toneYo: 'Low-Low' },
  'seven': { yo: 'Èje (7)', ig: 'Asaa (7)', ha: 'Bakwai (7)', phoneticYo: 'eh-JEH', toneYo: 'Low-Mid' },
  'eight': { yo: 'Ẹ̀jọ (8)', ig: 'Asatọ (8)', ha: 'Takwas (8)', phoneticYo: 'eh-JAW', toneYo: 'Low-Mid' },
  'nine': { yo: 'Ẹ̀sán (9)', ig: 'Itoolu (9)', ha: 'Tara (9)', phoneticYo: 'eh-SAHN', toneYo: 'Low-High' },
  'ten': { yo: 'Ẹ̀wá (10)', ig: 'Iri (10)', ha: 'Goma (10)', phoneticYo: 'eh-WAH', toneYo: 'Low-High' },

  // Nature & Common Objects
  'water': { yo: 'Omi', ig: 'Mmiri', ha: 'Ruwa', phoneticYo: 'oh-MEE', toneYo: 'Re-Mid' },
  'sun': { yo: 'Oòrùn', ig: 'Anwụ', ha: 'Rana', phoneticYo: 'oh-OH-roon', toneYo: 'Re-High-Low' },
  'moon': { yo: 'Oṣùpá', ig: 'Ọnwa', ha: 'Wata', phoneticYo: 'oh-shoo-PAH', toneYo: 'Re-Low-High' },
  'star': { yo: 'Ìràwọ̀', ig: 'Kpakpando', ha: 'Tauraro', phoneticYo: 'ee-rah-WAW', toneYo: 'Low-Low-Low' },
  'tree': { yo: 'Igi', ig: 'Osisi', ha: 'Bishiya', phoneticYo: 'ee-GEE', toneYo: 'Re-Mid' },
  'earth': { yo: 'Ilẹ̀', ig: 'Ala', ha: 'Kasa', phoneticYo: 'ee-LEH', toneYo: 'Re-Low' },
  'food': { yo: 'Oúnjẹ', ig: 'Nri', ha: 'Abinci', phoneticYo: 'oh-OON-jeh', toneYo: 'Re-High-Low' },
  'love': { yo: 'Ìfẹ́', ig: 'Ịhụnanya', ha: 'Kauna', phoneticYo: 'ee-FEH', toneYo: 'Low-High' },
  'peace': { yo: 'Àlàáfíà', ig: 'Udo', ha: 'Lafiya / Zaman lafiya', phoneticYo: 'ah-lah-ah-FEE-ah', toneYo: 'Low-Low-High-High-Low' },
  'joy': { yo: 'Ayọ̀', ig: 'Ọñụ', ha: 'Farin ciki', phoneticYo: 'ah-YAW', toneYo: 'Re-Low' },
  'wisdom': { yo: 'Ọgbọ́n', ig: 'Amamihe', ha: 'Hikima', phoneticYo: 'aw-GBAWN', toneYo: 'Re-High' },
  'strength': { yo: 'Agbára', ig: 'Ike', ha: 'Karfi', phoneticYo: 'ah-GBAH-rah', toneYo: 'Re-High-Re' }
};

// Word-level translation lexicon for assembling sentence translations
const WORD_LEXICON = {
  yo: {
    'i': 'Mo', 'you': 'O / Ẹ', 'he': 'Ó', 'she': 'Ó', 'we': 'A', 'they': 'Wọ́n',
    'am': 'wà', 'is': 'jẹ́', 'are': 'jẹ́', 'have': 'ní', 'will': 'yíò', 'can': 'lè',
    'go': 'lọ', 'come': 'wá', 'eat': 'jẹ', 'drink': 'mu', 'sleep': 'sùn', 'play': 'ṣiré',
    'learn': 'kọ́', 'teach': 'kọ́ni', 'see': 'rí', 'hear': 'gbọ́', 'know': 'mọ̀',
    'good': 'dára', 'bad': 'bàjẹ́', 'big': 'tóbi', 'small': 'kéré', 'beautiful': 'lẹ́wà',
    'happy': 'dùnnú', 'today': 'lónìí', 'tomorrow': 'ọ̀la', 'yesterday': 'àná',
    'in': 'ninu', 'at': 'ní', 'to': 'sí', 'from': 'láti', 'with': 'pẹ̀lú', 'and': 'àti',
    'the': '', 'a': 'kan', 'this': 'yìí', 'that': 'yẹn', 'my': 'mi', 'your': 'rẹ', 'our': 'wa'
  },
  ig: {
    'i': 'M', 'you': 'Gị', 'he': 'Ọ', 'she': 'Ọ', 'we': 'Anyị', 'they': 'Ha',
    'am': 'bụ', 'is': 'bụ', 'are': 'bụ', 'have': 'nwere', 'will': 'ga-', 'can': 'nwere ike',
    'go': 'gaa', 'come': 'bịa', 'eat': 'rie', 'drink': 'ñụọ', 'sleep': 'hie ụra',
    'learn': 'mụọ', 'teach': 'kụzie', 'see': 'hụ', 'hear': 'nụ', 'know': 'mara',
    'good': 'ọma', 'bad': 'ọjọọ', 'big': 'ukwu', 'small': 'obere', 'beautiful': 'mma',
    'today': 'taa', 'tomorrow': 'echi', 'yesterday': 'nyaahụ', 'with': 'na', 'and': 'na'
  },
  ha: {
    'i': 'Ina', 'you': 'Kana / Kina', 'he': 'Yana', 'she': 'Tana', 'we': 'Muna', 'they': 'Suna',
    'am': 'ne', 'is': 'ne', 'are': 'ne', 'have': 'da', 'will': 'zai', 'can': 'iya',
    'go': 'tafi', 'come': 'zo', 'eat': 'ci', 'drink': 'sha', 'sleep': 'kwana',
    'learn': 'koya', 'teach': 'koyar', 'see': 'gani', 'hear': 'ji', 'know': 'sani',
    'good': 'mai kyau', 'bad': 'marar kyau', 'big': 'babba', 'small': 'karami', 'beautiful': 'kyau',
    'today': 'yau', 'tomorrow': 'gobe', 'yesterday': 'jiya', 'with': 'tare da', 'and': 'da'
  }
};

export function translateText(englishText, targetLang = 'yo') {
  if (!englishText || !englishText.trim()) {
    return {
      translated: '',
      phonetic: '',
      tone: '',
      targetLang,
    };
  }

  const clean = englishText.trim().toLowerCase().replace(/[.?!,;:]+$/, '');

  // 1. Direct dictionary exact match
  if (DICTIONARY[clean] && DICTIONARY[clean][targetLang]) {
    return {
      translated: DICTIONARY[clean][targetLang],
      phonetic: DICTIONARY[clean].phoneticYo || '',
      tone: DICTIONARY[clean].toneYo || '',
      targetLang,
    };
  }

  // 2. Phrase contains match
  for (const [key, val] of Object.entries(DICTIONARY)) {
    if (clean === key || clean.startsWith(key + ' ') || clean.endsWith(' ' + key)) {
      if (val[targetLang]) {
        return {
          translated: val[targetLang],
          phonetic: val.phoneticYo || '',
          tone: val.toneYo || '',
          targetLang,
        };
      }
    }
  }

  // 3. Multi-word decomposition
  const words = clean.split(/\s+/);
  const targetLex = WORD_LEXICON[targetLang] || WORD_LEXICON.yo;
  const translatedWords = words.map((w) => {
    const stripped = w.replace(/[^a-z0-9]/g, '');
    if (DICTIONARY[stripped] && DICTIONARY[stripped][targetLang]) {
      return DICTIONARY[stripped][targetLang];
    }
    if (targetLex[stripped]) {
      return targetLex[stripped];
    }
    return w;
  });

  const assembled = translatedWords.join(' ');
  return {
    translated: assembled,
    phonetic: targetLang === 'yo' ? generateApproxPhonetic(assembled) : '',
    tone: targetLang === 'yo' ? 'Àmì Ohùn Yorùbá' : '',
    targetLang,
  };
}

function generateApproxPhonetic(yorubaText) {
  return yorubaText
    .replace(/ẹ/g, 'eh')
    .replace(/ọ/g, 'aw')
    .replace(/ṣ/g, 'sh')
    .replace(/gb/g, 'kp')
    .replace(/([àèìòù])/g, '$1(low)')
    .replace(/([áéíóú])/g, '$1(high)');
}

// Speak translated text using Web Speech API with language phonetic rules
export function speakText(text, lang = 'yo') {
  if (!text || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Choose best matching voice
  const voices = window.speechSynthesis.getVoices();
  const langCode = lang === 'yo' ? 'yo-NG' : lang === 'ig' ? 'ig-NG' : lang === 'ha' ? 'ha-NG' : 'en-US';
  
  const nativeVoice = voices.find((v) => v.lang.toLowerCase().includes(lang) || v.lang.toLowerCase().includes('ng'));
  if (nativeVoice) {
    utterance.voice = nativeVoice;
  }
  
  utterance.lang = langCode;
  utterance.rate = 0.88; // Slightly deliberate for clear tone discernment
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
}

// Tone Frequency Melody Audio (Web Audio API Synthesizer)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTonePitch(toneType) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Dò = 220Hz (Low), Re = 293.66Hz (Mid), Mí = 369.99Hz (High)
    const freqs = {
      low: 220,
      do: 220,
      mid: 293.66,
      re: 293.66,
      high: 369.99,
      mi: 369.99,
    };

    const freq = freqs[String(toneType).toLowerCase()] || 293.66;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.warn('[Tone Synth] Audio Context error:', err);
  }
}
