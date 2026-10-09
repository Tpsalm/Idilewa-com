// Yoruba Code Engine (EdeKoodu - Yoruba Programming Language Interpreter for Kids)

export const YORUBA_KEYWORDS = {
  'tẹ_jade': { en: 'print / output', desc: 'Fi ọ̀rọ̀ tabi nọmba han lori iboju' },
  'te_jade': { en: 'print / output', desc: 'Fi ọ̀rọ̀ tabi nọmba han lori iboju' },
  'kọ': { en: 'write / print', desc: 'Kọ ọ̀rọ̀ jade' },
  'ko': { en: 'write / print', desc: 'Kọ ọ̀rọ̀ jade' },
  'jẹ́': { en: 'let / variable', desc: 'Ṣẹda orúkọ ifipamọ tuntun' },
  'je': { en: 'let / variable', desc: 'Ṣẹda orúkọ ifipamọ tuntun' },
  'bí': { en: 'if condition', desc: 'Ṣayẹwo boya nkan kan jẹ́ òótọ́' },
  'bi': { en: 'if condition', desc: 'Ṣayẹwo boya nkan kan jẹ́ òótọ́' },
  'kò_bá_jẹ́': { en: 'else', desc: 'Ti kò ba ri bẹ́ẹ̀' },
  'ko_ba_je': { en: 'else', desc: 'Ti kò ba ri bẹ́ẹ̀' },
  'bí_kò_bá_jẹ́': { en: 'else if', desc: 'Tabi ti ipo miiran ba ri bẹ́ẹ̀' },
  'bi_ko_ba_je': { en: 'else if', desc: 'Tabi ti ipo miiran ba ri bẹ́ẹ̀' },
  'fún': { en: 'for loop', desc: 'Tun nkan ṣe ni igba pupọ' },
  'fun': { en: 'for loop', desc: 'Tun nkan ṣe ni igba pupọ' },
  'dé': { en: 'to (range)', desc: 'Lati ibẹrẹ de opin' },
  'de': { en: 'to (range)', desc: 'Lati ibẹrẹ de opin' },
  'níwọ̀n_ìgbà': { en: 'while loop', desc: 'Niwọn igba ti ipo ba duro' },
  'niwon_igba': { en: 'while loop', desc: 'Niwọn igba ti ipo ba duro' },
  'iṣẹ́': { en: 'function', desc: 'Akojọ ilana ti a le pe nigbakugba' },
  'ise': { en: 'function', desc: 'Akojọ ilana ti a le pe nigbakugba' },
  'padà': { en: 'return', desc: 'Da abajade pada lati inu iṣẹ́' },
  'pada': { en: 'return', desc: 'Da abajade pada lati inu iṣẹ́' },
  'òótọ́': { en: 'true', desc: 'Ooto / Bẹẹni' },
  'ooto': { en: 'true', desc: 'Ooto / Bẹẹni' },
  'irọ́': { en: 'false', desc: 'Irọ / Rara' },
  'iro': { en: 'false', desc: 'Irọ / Rara' },
  'òfo': { en: 'null / empty', desc: 'Ko si nkan' },
  'ofo': { en: 'null / empty', desc: 'Ko si nkan' },
  // Canvas Graphics commands
  'bẹ̀rẹ̀_àwòrán': { en: 'init canvas', desc: 'Nu iboju ki o bẹrẹ aworan tuntun' },
  'gbe_si_iwaju': { en: 'move forward', desc: 'Gbe pen lọ si iwaju pẹlu iye igbesẹ' },
  'gbe_si_eyin': { en: 'move backward', desc: 'Gbe pen pada sẹyin' },
  'yipada_si_otun': { en: 'turn right', desc: 'Yi igun pen si apa ọtun (degrees)' },
  'yipada_si_osi': { en: 'turn left', desc: 'Yi igun pen si apa osi (degrees)' },
  'yi_awo': { en: 'change color', desc: 'Yi awọ pen (pupa, alawọ-ewe, bulu, ofeefe, dudu, funfun, osan)' },
  'fa_onígun_mẹ́rin': { en: 'draw square', desc: 'Fa apẹrẹ onigun mẹrin' },
  'fa_circle': { en: 'draw circle', desc: 'Fa kẹkẹ / circle' },
  'fa_kẹ́kẹ̀': { en: 'draw circle', desc: 'Fa kẹkẹ / circle' },
  'fa_onígun_mẹ́ta': { en: 'draw triangle', desc: 'Fa apẹrẹ onigun mẹta' },
  'fa_irawo': { en: 'draw star', desc: 'Fa irawo to n tan' },
  'kọ_ọ̀rọ̀': { en: 'draw text', desc: 'Kọ ọrọ si ori canvas' },
  'gbe_pen_soke': { en: 'pen up', desc: 'Gbe pen soke ki o ma fa ila' },
  'fi_pen_sile': { en: 'pen down', desc: 'Fi pen silẹ ki o bẹrẹ si fa ila' }
};

export const YORUBA_COLOR_MAP = {
  'pupa': '#dc2626',
  'red': '#dc2626',
  'alawọ_ewe': '#15764a',
  'alawọ-ewe': '#15764a',
  'green': '#15764a',
  'bulu': '#0284c7',
  'blue': '#0284c7',
  'ofeefe': '#eab308',
  'yellow': '#eab308',
  'dudu': '#18231d',
  'black': '#18231d',
  'funfun': '#ffffff',
  'white': '#ffffff',
  'osan': '#f97316',
  'orange': '#f97316',
  'aro': '#7c3aed',
  'purple': '#7c3aed',
  'wura': '#d97706',
  'gold': '#d97706'
};

export const YORUBA_CODE_LESSONS = [
  {
    id: 'intro_hello',
    grade: 'K–2 · Alákọ̀ọ́bẹ̀rẹ̀',
    level: 'beginner',
    title: 'Ẹkọ 1 · Itẹwọgba si Ede Koodu (Hello World)',
    desc: 'Kọ ọ̀rọ̀ itẹwọgba akọkọ rẹ ni ede Yorùbá pẹlu aṣẹ "tẹ_jade".',
    task: 'Lo "tẹ_jade" lati fi "Kaabo si Idilewa!" han lori iboju.',
    starterCode: `# Ẹkọ 1: Itẹwọgba si Ede Koodu
tẹ_jade("Kaabo si Idilewa!")
tẹ_jade("Orúkọ mi ni Ayọ.")
tẹ_jade("Mo n kọ ẹkọ koodu ni Èdè Yorùbá!")`,
    solutionToken: 'tẹ_jade',
    culturalNote: 'Ni aṣa Yorùbá, ikini ṣe pataki pupọ. Koodu rẹ gbọdọ kọkọ kí gbogbo eniyan!',
    points: 15
  },
  {
    id: 'variables_names',
    grade: 'K–3 · Ọ̀rọ̀ ati Nọmba',
    level: 'beginner',
    title: 'Ẹkọ 2 · Ṣẹda Orúkọ Ifipamọ (Variables)',
    desc: 'Lo ọ̀rọ̀ "jẹ́" lati fi orúkọ, ọjọ́-orí ati orilẹ-ede pamọ sinu koodu.',
    task: 'Ṣẹda orúkọ ati ọjọ́-orí rẹ ki o tẹ ẹ jade pẹlu "tẹ_jade".',
    starterCode: `# Ẹkọ 2: Ṣẹda Orúkọ Ifipamọ pẹlu 'jẹ́'
jẹ́ orúkọ = "Adéwálé"
jẹ́ ọjọ́_orí = 10
jẹ́ ìlú = "Èkó"

tẹ_jade("Orúkọ akẹ́kọ̀ọ́: " + orúkọ)
tẹ_jade("Ọjọ́-orí: " + ọjọ́_orí + " ọdún")
tẹ_jade("Ilú: " + ìlú)`,
    solutionToken: 'jẹ́',
    culturalNote: 'Òwe Yorùbá sọ pe: "Orúkọ rere sàn ju wúrà ati fàdákà lọ."',
    points: 20
  },
  {
    id: 'math_operations',
    grade: 'Grade 3–4 · Ìṣirò',
    level: 'beginner',
    title: 'Ẹkọ 3 · Ìṣirò ati Nọmba (Math & Logic)',
    desc: 'Ṣe ìṣirò àfikún (+), ìyọkúrò (-), ìsọdipúpọ̀ (*) ati ìpín (/) ni Èdè Yorùbá.',
    task: 'Ṣiro iye àgbàdo ti a ko jọ lati oko.',
    starterCode: `# Ẹkọ 3: Ìṣirò Àgbàdo ninu Oko
jẹ́ àgbàdo_àárọ̀ = 25
jẹ́ àgbàdo_ìrọ̀lẹ́ = 15
jẹ́ àpapọ̀ = àgbàdo_àárọ̀ + àgbàdo_ìrọ̀lẹ́

tẹ_jade("Àgbàdo àárọ̀: " + àgbàdo_àárọ̀)
tẹ_jade("Àgbàdo ìrọ̀lẹ́: " + àgbàdo_ìrọ̀lẹ́)
tẹ_jade("Àpapọ̀ gbogbo àgbàdo: " + àpapọ̀)`,
    solutionToken: '+',
    culturalNote: 'Ìṣirò jẹ́ ọ̀nà ti àwọn baba-nla wa fi n ka owó ẹyọ ati èso oko.',
    points: 20
  },
  {
    id: 'conditions_if_else',
    grade: 'Grade 4–5 · Ipinnu',
    level: 'intermediate',
    title: 'Ẹkọ 4 · Ipinnu pẹlu "Bí" ati "Kò bá jẹ́" (If / Else)',
    desc: 'Kọ koodu to n mọ boya akẹ́kọ̀ọ́ ti tóbi to lati wọ kíláàsì àgbà.',
    task: 'Ṣayẹwo ọjọ́-orí pẹlu "bí" ati "kò_bá_jẹ́".',
    starterCode: `# Ẹkọ 4: Yiyan Ipinnu
jẹ́ ọjọ́_orí = 12

bí ọjọ́_orí >= 10 {
    tẹ_jade("Ẹ ku oriire! O ti tóbi to lati kọ koodu àgbà.")
} kò_bá_jẹ́ {
    tẹ_jade("Kíláàsì àwọn kékeré ni o wà loni.")
}`,
    solutionToken: 'bí',
    culturalNote: 'Ọ̀rọ̀ amòye sọ pe: "Bí ojú bá rí, ẹnu a dákẹ́; bí àkókò bá tó, a ó bẹ̀rẹ̀."',
    points: 25
  },
  {
    id: 'loops_counting',
    grade: 'Grade 5–6 · Yipo',
    level: 'intermediate',
    title: 'Ẹkọ 5 · Yipo pẹlu "Fún" (For Loops)',
    desc: 'Ka nọmba lati 1 de 7 ninu ọ̀sẹ̀ pẹlu orúkọ àwọn ọjọ́ ọ̀sẹ̀ Yorùbá.',
    task: 'Tun ọ̀rọ̀ tẹ jade ni igba meje.',
    starterCode: `# Ẹkọ 5: Kika Ọjọ́ Ọ̀sẹ̀ Meje
fún i = 1 dé 7 {
    tẹ_jade("Ọjọ́ kẹ-" + i + " ninu ọ̀sẹ̀: Ẹ ku iṣẹ́ o!")
}`,
    solutionToken: 'fún',
    culturalNote: 'Ọ̀sẹ̀ Yorùbá atijọ ní ọjọ́ mẹrin, ṣugbọn ọ̀sẹ̀ ode-oni ní ọjọ́ meje.',
    points: 25
  },
  {
    id: 'turtle_square',
    grade: 'K–6 · Àwòrán & Visual',
    level: 'intermediate',
    title: 'Ẹkọ 6 · Fa Onígun Mẹ́rin (Turtle Square Canvas)',
    desc: 'Lo àwọn aṣẹ àwòrán lati fa apẹrẹ onígun mẹ́rin alawọ-ewe lori canvas!',
    task: 'Fa apẹrẹ square pẹlu "gbe_si_iwaju" ati "yipada_si_otun".',
    starterCode: `# Ẹkọ 6: Fa Onígun Mẹ́rin lori Canvas
bẹ̀rẹ̀_àwòrán()
yi_awo("alawọ-ewe")

fún i = 1 dé 4 {
    gbe_si_iwaju(100)
    yipada_si_otun(90)
}
kọ_ọ̀rọ̀("Onígun Mẹ́rin Alawọ-Ewe!", 20, 20)`,
    solutionToken: 'gbe_si_iwaju',
    culturalNote: 'Àwọn àpẹẹrẹ adìrẹ Yorùbá kún fun onígun mẹ́rin ati onígun mẹ́ta to lẹwa.',
    points: 30
  },
  {
    id: 'turtle_star_pattern',
    grade: 'Grade 6–8 · Àwòrán Àràbà',
    level: 'advanced',
    title: 'Ẹkọ 7 · Fa Òdòdó ati Ìràwọ̀ (Star & Flower Canvas)',
    desc: 'Lo yipo ati iyipada igun lati fa àpẹẹrẹ òdòdó Adire to yanilẹnu.',
    task: 'Fa ododo alawọ ofeefe ati pupa.',
    starterCode: `# Ẹkọ 7: Fa Òdòdó Adire Aláràbarà
bẹ̀rẹ̀_àwòrán()

fún i = 1 dé 12 {
    yi_awo("ofeefe")
    gbe_si_iwaju(80)
    yipada_si_otun(150)
    yi_awo("pupa")
    gbe_si_iwaju(40)
}
kọ_ọ̀rọ̀("Òdòdó Ìràwọ̀ Adire Yorùbá", 30, 250)`,
    solutionToken: 'bẹ̀rẹ̀_àwòrán',
    culturalNote: 'Aṣa Adire Ẹ̀gbá n lo àwọn apẹrẹ geometry lati ṣafihan ẹwà àdánidá.',
    points: 35
  },
  {
    id: 'custom_function',
    grade: 'Grade 7–8 · Iṣẹ́ Ọlọ́gbọ́n',
    level: 'advanced',
    title: 'Ẹkọ 8 · Kọ Iṣẹ́ Ọlọ́gbọ́n (Custom Functions)',
    desc: 'Ṣẹda iṣẹ́ (function) pẹlu "iṣẹ́" ati "padà" lati kí ènìyàn pẹlu orúkọ wọn.',
    task: 'Kọ iṣẹ́ `kí_alájọṣepọ̀` ki o pe e pẹlu orúkọ oriṣiriṣi.',
    starterCode: `# Ẹkọ 8: Kọ Iṣẹ́ pẹlu 'iṣẹ́' ati 'padà'
iṣẹ́ kí_ènìyàn(orúkọ) {
    padà "Ẹ n lẹ́ o, Ọ̀rẹ́ mi " + orúkọ + "! Ẹ káàbọ̀."
}

jẹ́ ọ̀rọ̀1 = kí_ènìyàn("Tadé")
jẹ́ ọ̀rọ̀2 = kí_ènìyàn("Bọ́lá")

tẹ_jade(ọ̀rọ̀1)
tẹ_jade(ọ̀rọ̀2)`,
    solutionToken: 'iṣẹ́',
    culturalNote: 'Iṣẹ́ ninu koodu dabi orin alọ ti a le kọ leralera laisi rirẹ.',
    points: 35
  },
  {
    id: 'proverb_quiz',
    grade: 'Grade 6–8 · Òwe Game',
    level: 'advanced',
    title: 'Ẹkọ 9 · Ere Idanimọ Òwe Yorùbá (Proverb Game)',
    desc: 'Kọ koodu to n pari òwe Yorùbá nigba ti a ba fun ni ibẹrẹ rẹ.',
    task: 'Pari òwe pẹlu ipinnu "bí" ati "tẹ_jade".',
    starterCode: `# Ẹkọ 9: Ere Òwe Yorùbá
jẹ́ ibẹrẹ = "Ilé la ti n kọ ẹṣọ́..."

bí ibẹrẹ == "Ilé la ti n kọ ẹṣọ́..." {
    jẹ́ opin = "...ròde."
    tẹ_jade("Òwe: " + ibẹrẹ + opin)
    tẹ_jade("Itumọ: Good character begins at home.")
}`,
    solutionToken: 'ibẹrẹ',
    culturalNote: 'Òwe lẹṣin ọ̀rọ̀, bí ọ̀rọ̀ bá sọnu, òwe la fi n wa a.',
    points: 40
  }
];

// Transpile Yoruba Script to executable JavaScript
export function transpileYorubaToJS(yorubaCode) {
  let js = yorubaCode;

  // Preserve string literals
  const strings = [];
  js = js.replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
    strings.push(match);
    return `___STR_${strings.length - 1}___`;
  });

  // Comments
  js = js.replace(/#.*$/gm, (m) => `// ${m.slice(1)}`);

  // Identifiers pattern including Yoruba unicode range (\u1E00-\u1EFF and combining \u0300-\u036F)
  const ID_PAT = '[a-zA-Z0-9_$À-ž\\u1E00-\\u1EFF\\u0300-\\u036F]+';

  // Keyword replaces using regex that handles unicode characters safely
  js = js.replace(/(^|[\s;({])(tẹ_jade|te_jade|kọ|ko)\s*\(/g, '$1__yoruba_print(');
  js = new RegExp('(^|[\\s;({])(jẹ́|je|jẹ|j[eẹ][\\u0300-\\u036f]*)\\s+(' + ID_PAT + ')\\s*=', 'g')[Symbol.replace](js, '$1let $3 =');
  js = js.replace(/(^|[\s;({])(bí_kò_bá_jẹ́|bi_ko_ba_je|b[ií]_k[oò]_b[aá]_j[eẹ́])\s*/g, '$1else if ');
  js = js.replace(/(^|[\s;({])(kò_bá_jẹ́|ko_ba_je|k[oò]_b[aá]_j[eẹ́])\s*/g, '$1else ');
  js = js.replace(/(^|[\s;({])(bí|bi|b[ií])\s+/g, '$1if (');
  js = js.replace(/if\s*\(([^\{]+)\{/g, (match, cond) => {
    let clean = cond.trim();
    if (!clean.endsWith(')')) clean += ')';
    return `if (${clean} {`;
  });

  js = new RegExp('(^|[\\s;({])(fún|fun|f[uú]n)\\s+(' + ID_PAT + ')\\s*=\\s*([0-9]+)\\s*(dé|de|d[eé])\\s*([0-9]+)\\s*\\{', 'g')[Symbol.replace](js, '$1for (let $3 = $4; $3 <= $6; $3++) {');
  js = js.replace(/(^|[\s;({])(níwọ̀n_ìgbà|niwon_igba)\s+([^\{]+)\{/g, (m, p, kw, cond) => `${p}while (${cond.trim()}) {`);
  js = new RegExp('(^|[\\s;({])(iṣẹ́|ise|i[sṣ][eẹ́])\\s+(' + ID_PAT + ')\\s*\\(', 'g')[Symbol.replace](js, '$1function $3(');
  js = js.replace(/(^|[\s;({])(padà|pada|pad[aà])\s+/g, '$1return ');

  js = js.replace(/(^|[\s;({])(òótọ́|ooto)([\s;)\]},]|$)/g, '$1true$3');
  js = js.replace(/(^|[\s;({])(irọ́|iro)([\s;)\]},]|$)/g, '$1false$3');
  js = js.replace(/(^|[\s;({])(òfo|ofo)([\s;)\]},]|$)/g, '$1null$3');

  // Canvas turtle commands
  js = js.replace(/(^|[\s;({])(bẹ̀rẹ̀_àwòrán|bere_aworan)\s*\(/g, '$1__turtle_init(');
  js = js.replace(/(^|[\s;({])(gbe_si_iwaju|gbe_si_waju)\s*\(/g, '$1__turtle_forward(');
  js = js.replace(/(^|[\s;({])(gbe_si_eyin)\s*\(/g, '$1__turtle_backward(');
  js = js.replace(/(^|[\s;({])(yipada_si_otun|yi_otun)\s*\(/g, '$1__turtle_right(');
  js = js.replace(/(^|[\s;({])(yipada_si_osi|yi_osi)\s*\(/g, '$1__turtle_left(');
  js = js.replace(/(^|[\s;({])(yi_awo|yi_awo_pen)\s*\(/g, '$1__turtle_color(');
  js = js.replace(/(^|[\s;({])(fa_onígun_mẹ́rin|fa_onigun_merin)\s*\(/g, '$1__turtle_square(');
  js = js.replace(/(^|[\s;({])(fa_circle|fa_kẹ́kẹ̀|fa_keke)\s*\(/g, '$1__turtle_circle(');
  js = js.replace(/(^|[\s;({])(fa_onígun_mẹ́ta|fa_onigun_meta)\s*\(/g, '$1__turtle_triangle(');
  js = js.replace(/(^|[\s;({])(fa_irawo)\s*\(/g, '$1__turtle_star(');
  js = js.replace(/(^|[\s;({])(kọ_ọ̀rọ̀|ko_oro)\s*\(/g, '$1__turtle_text(');
  js = js.replace(/(^|[\s;({])(gbe_pen_soke)\s*\(/g, '$1__turtle_pen_up(');
  js = js.replace(/(^|[\s;({])(fi_pen_sile)\s*\(/g, '$1__turtle_pen_down(');

  // Restore string literals
  js = js.replace(/___STR_(\d+)___/g, (match, idx) => strings[Number(idx)]);

  return js;
}

// Sandbox execution engine with safety limits
export async function executeYorubaCode(code, canvasElement = null) {
  const logs = [];
  const errors = [];
  let stepCount = 0;
  const MAX_STEPS = 5000;

  let ctx = null;
  let turtle = {
    x: 140,
    y: 90,
    angle: 0, // in degrees, 0 = facing right
    penDown: true,
    color: '#15764a',
    lineWidth: 3
  };

  if (canvasElement) {
    ctx = canvasElement.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      turtle.x = canvasElement.width / 2;
      turtle.y = canvasElement.height / 2;
      ctx.strokeStyle = turtle.color;
      ctx.lineWidth = turtle.lineWidth;
      ctx.lineCap = 'round';
      ctx.fillStyle = turtle.color;
    }
  }

  // Sandbox helpers
  const __yoruba_print = (...args) => {
    stepCount++;
    if (stepCount > MAX_STEPS) throw new Error('Àṣìṣe: Koodu rẹ n ṣiṣẹ́ láìdúró (Infinite loop detected).');
    const msg = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    logs.push(msg);
  };

  const __turtle_init = () => {
    if (!ctx || !canvasElement) return;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    turtle.x = canvasElement.width / 2;
    turtle.y = canvasElement.height / 2;
    turtle.angle = 0;
    turtle.penDown = true;
    turtle.color = '#15764a';
    ctx.strokeStyle = turtle.color;
  };

  const __turtle_forward = (dist = 50) => {
    if (!ctx) return;
    const rad = (turtle.angle * Math.PI) / 180;
    const newX = turtle.x + dist * Math.cos(rad);
    const newY = turtle.y + dist * Math.sin(rad);
    if (turtle.penDown) {
      ctx.beginPath();
      ctx.moveTo(turtle.x, turtle.y);
      ctx.lineTo(newX, newY);
      ctx.strokeStyle = turtle.color;
      ctx.stroke();
    }
    turtle.x = newX;
    turtle.y = newY;
  };

  const __turtle_backward = (dist = 50) => {
    __turtle_forward(-dist);
  };

  const __turtle_right = (deg = 90) => {
    turtle.angle = (turtle.angle + deg) % 360;
  };

  const __turtle_left = (deg = 90) => {
    turtle.angle = (turtle.angle - deg + 360) % 360;
  };

  const __turtle_color = (colorName = 'green') => {
    const mapped = YORUBA_COLOR_MAP[String(colorName).toLowerCase().trim()] || colorName;
    turtle.color = mapped;
    if (ctx) {
      ctx.strokeStyle = mapped;
      ctx.fillStyle = mapped;
    }
  };

  const __turtle_square = (size = 60) => {
    if (!ctx) return;
    for (let i = 0; i < 4; i++) {
      __turtle_forward(size);
      __turtle_right(90);
    }
  };

  const __turtle_circle = (radius = 30) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(turtle.x, turtle.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = turtle.color;
    ctx.stroke();
  };

  const __turtle_triangle = (size = 60) => {
    if (!ctx) return;
    for (let i = 0; i < 3; i++) {
      __turtle_forward(size);
      __turtle_right(120);
    }
  };

  const __turtle_star = (size = 50) => {
    if (!ctx) return;
    for (let i = 0; i < 5; i++) {
      __turtle_forward(size);
      __turtle_right(144);
    }
  };

  const __turtle_text = (text = '', x = turtle.x, y = turtle.y) => {
    if (!ctx) return;
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = turtle.color;
    ctx.fillText(String(text), x, y);
  };

  const __turtle_pen_up = () => { turtle.penDown = false; };
  const __turtle_pen_down = () => { turtle.penDown = true; };

  try {
    const transpiled = transpileYorubaToJS(code);
    
    // Create an isolated function runner
    const runner = new Function(
      '__yoruba_print',
      '__turtle_init',
      '__turtle_forward',
      '__turtle_backward',
      '__turtle_right',
      '__turtle_left',
      '__turtle_color',
      '__turtle_square',
      '__turtle_circle',
      '__turtle_triangle',
      '__turtle_star',
      '__turtle_text',
      '__turtle_pen_up',
      '__turtle_pen_down',
      `"use strict";\n${transpiled}`
    );

    runner(
      __yoruba_print,
      __turtle_init,
      __turtle_forward,
      __turtle_backward,
      __turtle_right,
      __turtle_left,
      __turtle_color,
      __turtle_square,
      __turtle_circle,
      __turtle_triangle,
      __turtle_star,
      __turtle_text,
      __turtle_pen_up,
      __turtle_pen_down
    );

    if (logs.length === 0 && !canvasElement) {
      logs.push('✓ Koodu ṣiṣẹ́ láìsí àṣìṣe! (Code executed successfully with no print output).');
    }
  } catch (err) {
    let friendlyError = `Àṣìṣe: ${err.message}`;
    if (err.message.includes('Unexpected identifier') || err.message.includes('Unexpected token')) {
      friendlyError = `Àṣìṣe Ìkọ̀wé (Syntax Error): Ṣayẹwo àwọn àkọmọ ( ) tabi àmì àpèjúwe " " ninu koodu rẹ.`;
    } else if (err.message.includes('is not defined')) {
      friendlyError = `Àṣìṣe: Ọ̀rọ̀ ti a ko mọ (${err.message.replace('is not defined', 'kò yé wa')}). Ṣayẹwo boya o kọ ọ́ daadaa.`;
    }
    errors.push(friendlyError);
  }

  return {
    success: errors.length === 0,
    output: logs.join('\n'),
    error: errors.join('\n'),
    logs,
  };
}

// Play audio pronunciation for Yoruba programming terms
export function speakYorubaTerm(term) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(term);
  utterance.lang = 'yo-NG';
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
