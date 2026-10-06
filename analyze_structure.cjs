const fs = require('fs');

const script = fs.readFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_script.js', 'utf8');

// Find function declarations, view renderers, route names, data structures
const routeMatches = [...script.matchAll(/case '([^']+)':/g)].map(m => m[1]);
console.log('Routes in switch/router:', [...new Set(routeMatches)]);

const functionMatches = [...script.matchAll(/function ([a-zA-Z0-9_$]+)\s*\(/g)].map(m => m[1]);
console.log('Function names:', functionMatches);

const constMatches = [...script.matchAll(/const ([a-zA-Z0-9_$]+)\s*=/g)].map(m => m[1]);
console.log('Top level consts / objects:', constMatches.slice(0, 30));

// Let's check sections and components in extracted_script.js
const renderFunctions = functionMatches.filter(fn => fn.startsWith('render') || fn.includes('View') || fn.includes('Page') || fn.includes('Header') || fn.includes('Footer'));
console.log('Render functions:', renderFunctions);
