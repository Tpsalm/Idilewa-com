const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/Owoyemi Samuel Tobi/Downloads/Idilewa/idilewa-preview.html';
const content = fs.readFileSync(filePath, 'utf8');

// 1. Extract CSS
const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
const cssContent = styleMatch ? styleMatch[1].trim() : '';
fs.writeFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_styles.css', cssContent);
console.log('Saved extracted_styles.css, length:', cssContent.length);

// 2. Extract Script 0
const scriptMatches = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
const script0 = scriptMatches[0][1];

// Find where window.__IDILEWA_ASSETS__ ends
const assetPrefix = 'window.__IDILEWA_ASSETS__ = ';
const assetStart = script0.indexOf(assetPrefix);
if (assetStart !== -1) {
  const jsonStart = assetStart + assetPrefix.length;
  // Let's find where the JSON object ends by parsing or scanning
  // It is followed by ';' or next statement
  // Let's search for the end of assets object
  const nextStatementIdx = script0.indexOf(';\n', jsonStart);
  let assetsJsonStr = '';
  let jsCode = '';
  
  // Let's find matching brace for the assets JSON
  let depth = 0;
  let inString = false;
  let escape = false;
  let endIdx = -1;
  
  for (let i = jsonStart; i < script0.length; i++) {
    const char = script0[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"' || char === "'") {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') depth++;
      else if (char === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
  }

  if (endIdx !== -1) {
    assetsJsonStr = script0.slice(jsonStart, endIdx + 1);
    jsCode = script0.slice(endIdx + 1).replace(/^;\s*/, '');
    
    console.log('Found assets JSON string, length:', assetsJsonStr.length);
    console.log('Found JS code, length:', jsCode.length);
    
    fs.writeFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_script.js', jsCode);
    
    const assets = JSON.parse(assetsJsonStr);
    console.log('Extracted asset keys count:', Object.keys(assets).length);
    console.log('Asset keys:', Object.keys(assets));
    
    // Save images to public/assets directory from the original base64
    const assetsDir = 'c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/public/assets';
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    for (const [filename, dataUri] of Object.entries(assets)) {
      const match = dataUri.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.*)$/);
      if (match) {
        const ext = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(path.join(assetsDir, filename), buffer);
        console.log(`Saved original image: ${filename} (${buffer.length} bytes)`);
      } else {
        console.log(`Warning: non-base64 data URI for ${filename}`);
      }
    }
  }
}
