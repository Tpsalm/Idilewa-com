import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: ['VITE_', 'SUPABASE_PUBLIC_URL', 'SUPABASE_ANON_KEY'],
});
