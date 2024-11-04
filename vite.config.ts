import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@nextui-org/react', 'framer-motion', 'next-themes'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});