import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const templateNames = ['confirmation', 'magic_link', 'recovery', 'email_change'];

test('authentication templates are Idilewa branded and retain Supabase action variables', async () => {
  for (const name of templateNames) {
    const template = await readFile(new URL(`../supabase/templates/${name}.html`, import.meta.url), 'utf8');
    assert.match(template, /idílẹ́wà/);
    assert.match(template, /{{ \.Token }}/);
    assert.match(template, /{{ \.ConfirmationURL }}/);
    assert.match(template, /<!doctype html>/i);
  }
});
