const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/Owoyemi Samuel Tobi/Downloads/Idilewa/idilewa-preview.html';
const content = fs.readFileSync(filePath, 'utf8');

console.log('Total file length:', content.length);

const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
console.log('CSS style tag found:', !!styleMatch, 'Length:', styleMatch ? styleMatch[1].length : 0);

const scriptMatches = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Script count:', scriptMatches.length);
scriptMatches.forEach((m, idx) => {
  console.log(`Script ${idx} length: ${m[1].length}`);
});

// Check for base64 images
const dataUris = [...content.matchAll(/src="(data:image\/[^;]+;base64,[^"]+)"/g)];
console.log('Base64 img src count:', dataUris.length);

// Also background-image data URIs:
const bgDataUris = [...content.matchAll(/url\(['"]?(data:image\/[^;]+;base64,[^'")]+)['"]?\)/g)];
console.log('Base64 background url count:', bgDataUris.length);

// Check all views / IDs / sections
const dataViews = [...content.matchAll(/data-view="([^"]+)"/g)].map(m => m[1]);
console.log('Unique data-views:', [...new Set(dataViews)]);

const viewIds = [...content.matchAll(/id="view-([^"]+)"/g)].map(m => m[1]);
console.log('Unique view IDs:', [...new Set(viewIds)]);

// Check what interactive elements or navigation links exist
const links = [...content.matchAll(/data-nav="([^"]+)"/g)].map(m => m[1]);
console.log('Unique data-nav:', [...new Set(links)]);

const openViews = [...content.matchAll(/data-open-view="([^"]+)"/g)].map(m => m[1]);
console.log('Unique data-open-view:', [...new Set(openViews)]);
