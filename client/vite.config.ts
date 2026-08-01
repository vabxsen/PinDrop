import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        // Split the slow-moving framework and animation libraries out of the app chunk.
        // First-load bytes are roughly unchanged — the landing page really does use all of
        // this — but these chunks keep their hashes across deploys, so returning visitors
        // re-download only the app code that actually changed.
        manualChunks: (id: string) => {
          if (!id.includes('node_modules')) return;
          if (
            /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/.test(id)
          ) {
            return 'react-vendor';
          }
          if (
            id.includes('framer-motion') ||
            id.includes('motion-dom') ||
            id.includes('motion-utils')
          ) {
            return 'motion-vendor';
          }
        },
      },
    },
  },
});
