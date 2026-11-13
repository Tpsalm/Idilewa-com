import { defineConfig } from 'vite';
import { resolve } from 'path';

const routes = [
  'index', 'about', 'base', 'coding', 'connect_students', 'connect_teachers', 'consent', 'course',
  'curriculum',
  'ere', 'ere_game', 'guides', 'human', 'ifa', 'ifa_odu', 'individuals', 'keepers',
  'kids', 'languages', 'lesson', 'login', 'method', 'oral', 'oral_genre', 'oriki', 'owe',
  'owe_add', 'owe_detail', 'owe_story', 'owe_reflection', 'pricing', 'profile', 'schools',
  'trainer', 'tutor', 'voices', 'voice_lessons',
  'signin', 'heritage'
];

const input = Object.fromEntries(routes.map((r) => [r, resolve(__dirname, `${r}.html`)]));

export default defineConfig({
  base: './',
  plugins: [{
    name: 'disable-hosted-hmr-client',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(/<script[^>]+src=["']\/@vite\/client["'][^>]*><\/script>/g, '');
      },
    },
  }],
  server: {
    host: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  build: {
    rollupOptions: {
      input,
    },
  },
});
