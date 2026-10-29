import { defineConfig } from 'vite';
import { resolve } from 'path';
import injectHtml from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  base: '/',
  root: 'src',
  envDir: '../',
  build: {
    target: 'es2022', // çeviri dosyalarını sonradan yüklemek için (tüm güncel tarayıcılar destekler)
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        catalog: resolve(__dirname, 'src/catalog.html'),
        tesislerimiz: resolve(__dirname, 'src/tesislerimiz.html'),
        galeri: resolve(__dirname, 'src/galeri.html'),
      },
    },
  },
  plugins: [
    injectHtml(),
    FullReload(['src/partials/**/*.html', 'src/**/*.html']),
  ],
});