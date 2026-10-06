const fs = require('fs');

const script = fs.readFileSync('c:/Users/Owoyemi Samuel Tobi/Downloads/Ideelewa/extracted_script.js', 'utf8');

// Check what LABELS is
const labelsMatch = script.match(/const LABELS = ([^;]+);/);
if (labelsMatch) {
  console.log('LABELS:', labelsMatch[1]);
}

// Check searchResults and how search works
const searchIdx = script.indexOf('function searchResults');
if (searchIdx !== -1) {
  console.log('searchResults:\n', script.slice(searchIdx, searchIdx + 800));
}

// Check AI helper logic
const aiIdx = script.indexOf('function aiReply');
if (aiIdx !== -1) {
  console.log('aiReply:\n', script.slice(aiIdx, aiIdx + 1100));
}

// Check handleAction and all actions
const actionIdx = script.indexOf('function handleAction');
if (actionIdx !== -1) {
  console.log('handleAction length:', script.length - actionIdx);
}
