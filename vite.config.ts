import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * One config, two modes:
 *   `vite`            → docs + playground dev server
 *   `vite build --mode lib` → publishable library bundle (ESM + CJS + CSS)
 */
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [react()],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        sourcemap: true,
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'Hesh',
          formats: ['es', 'cjs'],
          fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
        },
        rollupOptions: {
          // React must stay external or every consumer ships two copies of it.
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
            assetFileNames: 'hesh.[ext]',
          },
        },
      },
    };
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      cors: true,
      // Allow the sandboxed preview host to reach the dev server.
      allowedHosts: true,
      hmr: {
        clientPort: 443,
        protocol: 'wss',
      },
    },
    preview: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
    build: {
      outDir: 'dist-docs',
      emptyOutDir: true,
      modulePreload: false,
      rollupOptions: {
        output: { format: 'iife', inlineDynamicImports: true },
      },
    },
  };
});
