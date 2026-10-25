import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const styleSource = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const indexSource = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('homepage uses the approved bilingual font families and removes the video CTA', () => {
  const homeSource = appSource.slice(appSource.indexOf('function renderHome()'), appSource.indexOf('function renderLanguageCard'));
  assert.match(indexSource, /<body data-default-route="index">/);
  assert.match(indexSource, /family=Inter:wght@400;500;600;700&family=Plus\+Jakarta\+Sans:wght@600;700;800/);
  assert.match(homeSource, /Preserving African Culture\.<br \/><span>Promoting Technology\.<\/span>/);
  assert.match(homeSource, /Explore Stories/);
  assert.doesNotMatch(homeSource, /visual-journey-3d-section|Talking Drum|Living Glyphs/);
  assert.match(appSource, /case 'index': return renderHome\(\);/);
  assert.doesNotMatch(homeSource, /Watch Video/);
  assert.match(styleSource, /landing-hero-copy h1[\s\S]*?font-size: 28px;[\s\S]*?line-height: 33px/);
  assert.match(styleSource, /landing-hero-copy > p[\s\S]*?font-size: 14px;[\s\S]*?line-height: 22px/);
  assert.match(styleSource, /landing-hero-actions \.button[\s\S]*?min-height: 48px;[\s\S]*?font-size: 14px/);
});

test('every story card opens its own bilingual reader with previous and next navigation', () => {
  assert.match(appSource, /const STORY_READINGS = \[/);
  assert.equal((appSource.match(/id: '(?:story-travelled|garden-words|little-builders)'/g) || []).length, 3);
  assert.match(appSource, /data-route="ere_game" data-story="\$\{story\.id\}"/);
  assert.match(appSource, /English translation/);
  assert.match(appSource, /lang="yo"/);
  assert.match(appSource, /Previous story/);
  assert.match(appSource, /Next story/);
  assert.match(appSource, /data-key="\$\{story\.id\}"/);
});

test('mobile landing layouts and story navigation have responsive no-overflow rules', () => {
  assert.match(styleSource, /@media \(max-width: 620px\)[\s\S]*?landing-home \.container \{ width: calc\(100% - 40px\)/);
  assert.match(styleSource, /@media \(max-width: 359px\)[\s\S]*?landing-home \.container \{ width: calc\(100% - 32px\)/);
  assert.match(styleSource, /\.landing-future-card \{[^}]*color: var\(--ink\);[^}]*background: var\(--mint\)/);
  assert.match(styleSource, /\.landing-future-card \.text-link \{ color: var\(--green-dark\);/);
  assert.match(styleSource, /\.story-navigation-link \{[\s\S]*?min-height: 44px/);
});
