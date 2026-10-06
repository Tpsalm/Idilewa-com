const fs = require('fs');

const script = fs.readFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_script.js', 'utf8');

// Let's inspect each render function in detail
const renderFnNames = [
  'renderHome', 'renderLanguages', 'renderCourse', 'renderLesson', 'renderCoding',
  'renderStories', 'renderStoryGame', 'renderOral', 'renderOralGenre', 'renderOriki',
  'renderOwe', 'renderOweDetail', 'renderOweStory', 'renderOweReflection', 'renderOweAdd',
  'renderVoices', 'renderGeneric', 'renderDirectory', 'renderPricing', 'renderProfile',
  'renderLogin', 'renderConnectTeachers', 'renderConnectStudents', 'renderConsent', 'renderPage',
  'assignUniqueRouteImages'
];

renderFnNames.forEach(fn => {
  const idx = script.indexOf(`function ${fn}`);
  if (idx !== -1) {
    console.log(`\n=== FUNCTION ${fn} ===`);
    console.log(script.slice(idx, idx + 400));
  }
});
