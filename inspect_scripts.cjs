const fs = require('fs');

const filePath = 'C:/Users/Owoyemi Samuel Tobi/Downloads/Idilewa/idilewa-preview.html';
const content = fs.readFileSync(filePath, 'utf8');

const scriptMatches = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Script 0 first 500 chars:');
console.log(scriptMatches[0][1].slice(0, 500));

console.log('Script 0 last 500 chars:');
console.log(scriptMatches[0][1].slice(-500));

console.log('\n--- Script 1 full content ---');
console.log(scriptMatches[1][1]);

// Let's also see what HTML tags are present between </style> and <script>
const bodyMatch = content.match(/<\/style>([\s\S]*?)<script/i);
if (bodyMatch) {
  console.log('\nBody length before first script:', bodyMatch[1].length);
  console.log('Body first 500 chars:');
  console.log(bodyMatch[1].slice(0, 500));
}
