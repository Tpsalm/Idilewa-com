import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_PUBLIC_URL',
    'SUPABASE_ANON_KEY',
  ],
});
