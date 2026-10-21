import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const templateNames = ['confirmation', 'magic_link', 'recovery', 'email_change'];

test('authentication templates are Idilewa branded and retain their required Supabase variables', async () => {
  for (const name of templateNames) {
    const template = await readFile(new URL(`../supabase/templates/${name}.html`, import.meta.url), 'utf8');
    assert.match(template, /idílẹ́wà/);
    assert.match(template, /{{ \.Token }}/);
    assert.match(template, /<!doctype html>/i);
    if (name !== 'confirmation') {
      assert.match(template, /{{ \.ConfirmationURL }}/);
    }
  }
});

test('signup confirmation uses one code-based flow supported by the Idilewa sign-up screen', async () => {
  const template = await readFile(new URL('../supabase/templates/confirmation.html', import.meta.url), 'utf8');
  assert.match(template, /Enter it on the Idilewa sign-up screen/);
  assert.match(template, /YOUR CONFIRMATION CODE/);
  assert.doesNotMatch(template, /{{ \.ConfirmationURL }}/);
});

test('Supabase project config deploys all four branded authentication templates', async () => {
  const config = await readFile(new URL('../supabase/config.toml', import.meta.url), 'utf8');
  for (const name of templateNames) {
    assert.match(config, new RegExp(`\\[auth\\.email\\.template\\.${name}\\]`));
    assert.match(config, new RegExp(`content_path = \"\\./supabase/templates/${name}\\.html\"`));
  }
});
