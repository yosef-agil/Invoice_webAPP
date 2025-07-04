import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuild: {
      // Tambahkan ini untuk mengaktifkan polyfills
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  // Tambahkan ini untuk webpack/rollup alias (penting untuk beberapa polyfills)
  resolve: {
    alias: {
      // Ini sangat penting untuk buffer
      'buffer': 'buffer/',
      'util': 'rollup-plugin-node-polyfills/polyfills/util',
      // Tambahkan polyfills lain jika ada error serupa
      // 'stream': 'rollup-plugin-node-polyfills/polyfills/stream',
      // 'assert': 'rollup-plugin-node-polyfills/polyfills/assert',
      // 'events': 'rollup-plugin-node-polyfills/polyfills/events',
      // 'path': 'rollup-plugin-node-polyfills/polyfills/path',
      // 'punycode': 'rollup-plugin-node-polyfills/polyfills/punycode',
      // 'url': 'rollup-plugin-node-polyfills/polyfills/url',
      // 'string_decoder': 'rollup-plugin-node-polyfills/polyfills/string_decoder',
      // 'http': 'rollup-plugin-node-polyfills/polyfills/http',
      // 'https': 'rollup-plugin-node-polyfills/polyfills/https',
      // 'os': 'rollup-plugin-node-polyfills/polyfills/os',
      // 'crypto': 'rollup-plugin-node-polyfills/polyfills/crypto',
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        // rollup-plugin-node-polyfills() jika diperlukan untuk build
        // import nodePolyfills from 'rollup-plugin-node-polyfills';
        // nodePolyfills(),
      ],
    },
  },
});