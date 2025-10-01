import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    manifest: true,
    lib: {
      entry: resolve(__dirname, 'src/domains/renderer/standaloneRenderer.ts'),
      name: 'CmsAppRenderer',
      formats: ['iife'],
      fileName: (format) => `cms-app-renderer.[hash].js`,
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'cms-app-renderer.[hash].js',
      },
    },
  },
});
