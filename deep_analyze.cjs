const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/Owoyemi Samuel Tobi/Downloads/Idilewa/idilewa-preview.html';
const content = fs.readFileSync(filePath, 'utf8');

console.log('Total file size:', content.length, 'characters');

// Check head and body structure
const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

console.log('Has head:', !!headMatch);
console.log('Has body:', !!bodyMatch);

if (bodyMatch) {
  // Let's see what's directly in body before scripts
  const bodyContent = bodyMatch[1];
  const scriptRegex = /<script[\s\S]*?<\/script>/gi;
  const bodyWithoutScripts = bodyContent.replace(scriptRegex, '');
  console.log('Body HTML (without scripts) length:', bodyWithoutScripts.length);
  console.log('Body HTML (first 500 chars):', bodyWithoutScripts.slice(0, 500));
}

// Count scripts
const scripts = [...content.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
console.log('Number of <script> tags:', scripts.length);
scripts.forEach((s, idx) => {
  console.log(`Script ${idx}: attrs="${s[1]}", length=${s[2].length}`);
});

// Count styles
const styles = [...content.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/gi)];
console.log('Number of <style> tags:', styles.length);
styles.forEach((s, idx) => {
  console.log(`Style ${idx}: length=${s[2].length}`);
});
