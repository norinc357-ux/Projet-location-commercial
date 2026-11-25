import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'node:path';

// Démo autonome du formulaire (sans serveur) : un seul fichier HTML.
export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), viteSingleFile()],
  resolve: { alias: { '@': path.resolve(__dirname, '..') } },
  build: { outDir: path.resolve(__dirname, 'dist'), emptyOutDir: true },
});
