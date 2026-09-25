import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves project sites from /<repo-name>/, Vercel serves from /.
// `npm run build:gh-pages` (or BASE_PATH=/something/) switches the base.
const GH_PAGES_BASE = '/MyPortfolio_Rohith171801/';

export default defineConfig(({ mode }) => ({
  base: process.env.BASE_PATH ?? (mode === 'gh-pages' ? GH_PAGES_BASE : '/'),
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssMinify: true,
  },
}));
