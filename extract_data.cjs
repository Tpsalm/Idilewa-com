const fs = require('fs');

const script = fs.readFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_script.js', 'utf8');

// Let's find the exact definitions of:
// 1. TEACHER_PROFILES
// 2. LEARNER_REQUESTS
// 3. COURSE_CATALOG
// 4. CODE_PATHS, CODE_COPY, CODE_LEVELS, CODE_MISSIONS, CODE_ADVENTURES, CODE_GARDEN_DIRECTIONS, CODE_TOKENS
// 5. ROUTE_IMAGE_OVERRIDES, ROUTE_PAGE_LAYER_COPY

function extractConst(name) {
  const start = script.indexOf(`const ${name} = `);
  if (start === -1) return null;
  // find semicolon or next const
  let depth = 0;
  let inStr = false;
  let escape = false;
  const valStart = start + `const ${name} = `.length;
  for (let i = valStart; i < script.length; i++) {
    const c = script[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"' || c === "'") { inStr = !inStr; continue; }
    if (!inStr) {
      if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') depth--;
      else if (c === ';' && depth === 0) {
        return script.slice(valStart, i);
      }
    }
  }
  return null;
}

const names = [
  'ROUTES', 'LANGUAGES', 'SOON_LANGUAGES', 'ICONS', 'PAGE_META', 'NAV', 'NAV_GROUPS',
  'COURSE_CATALOG', 'CODE_PATHS', 'CODE_COPY', 'CODE_LEVELS', 'CODE_MISSIONS', 'CODE_ADVENTURES',
  'CODE_GARDEN_DIRECTIONS', 'CODE_TOKENS', 'TEACHER_PROFILES', 'LEARNER_REQUESTS',
  'ROUTE_IMAGE_ALTS', 'ROUTE_IMAGE_SLOT_ALTS', 'ROUTE_IMAGE_OVERRIDES',
  'PAGE_LAYER_CATEGORIES', 'ROUTE_PAGE_LAYER_COPY'
];

const extracted = {};
names.forEach(n => {
  const val = extractConst(n);
  if (val) {
    console.log(`Extracted ${n}, length: ${val.length}`);
    extracted[n] = val;
  } else {
    console.log(`Could NOT extract ${n}`);
  }
});

// Let's create a combined data file for our React app: src/data/idilewaData.ts
let tsOutput = `// Auto-extracted exact data from original idilewa-preview.html\n\n`;
for (const [k, v] of Object.entries(extracted)) {
  tsOutput += `export const ${k} = ${v};\n\n`;
}

fs.writeFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/src/data_extracted.ts', tsOutput);
console.log('Saved src/data_extracted.ts, length:', tsOutput.length);
