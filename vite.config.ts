import { defineConfig } from 'vite';
import { resolve } from 'path';

const routes = [
  'index', 'about', 'base', 'coding', 'connect_students', 'connect_teachers', 'consent', 'course',
  'ere', 'ere_game', 'families', 'guides', 'human', 'ifa', 'ifa_odu', 'individuals', 'keepers',
  'kids', 'languages', 'lesson', 'login', 'method', 'oral', 'oral_genre', 'oriki', 'owe',
  'owe_add', 'owe_detail', 'owe_story', 'owe_reflection', 'pricing', 'profile', 'schools',
  'tutor', 'voices'
];

const input = Object.fromEntries(routes.map((r) => [r, resolve(__dirname, `${r}.html`)]));

export default defineConfig({
  build: {
    rollupOptions: {
      input,
    },
  },
});
