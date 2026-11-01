import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' || process.argv.includes('preview') ? '/jet-engine-lab/' : '/',
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022', sourcemap: false },
  server: { port: 4173, strictPort: true },
}));
