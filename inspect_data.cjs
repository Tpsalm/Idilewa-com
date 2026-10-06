const fs = require('fs');

const script = fs.readFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_script.js', 'utf8');

// Let's find constant definitions, arrays, objects before the first function
const firstFuncIdx = script.indexOf('function readState');
const constantsPart = script.slice(0, firstFuncIdx);
fs.writeFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_constants.js', constantsPart);
console.log('Saved extracted_constants.js, length:', constantsPart.length);

// Let's also search for all data objects in the script (like TEACHERS, LEARNERS, PROVERBS, OWE_ITEMS, etc.)
const arraysAndObjects = [...script.matchAll(/(?:const|let|var)\s+([A-Z0-9_]+)\s*=\s*(\[|\{)/g)];
console.log('Upper-case constants:');
arraysAndObjects.forEach(m => console.log(`- ${m[1]} (${m[2]})`));
