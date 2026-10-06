const fs = require('fs');

const script = fs.readFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_script.js', 'utf8');

// Let's find all function boundaries and comments in extracted_script.js
const functionRegex = /(?:\/\*[\s\S]*?\*\/|\/\/[^\n]*\n)*function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{/g;
let match;
const functions = [];
while ((match = functionRegex.exec(script)) !== null) {
  functions.push({
    name: match[1],
    params: match[2],
    index: match.index
  });
}

console.log('Total functions found:', functions.length);
functions.forEach((f, i) => {
  const nextIdx = i < functions.length - 1 ? functions[i+1].index : script.length;
  const length = nextIdx - f.index;
  console.log(`- ${f.name}(${f.params}) : length ${length} chars`);
});
