import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';
import injectHtml from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import { CATEGORIES, TUM_FIDANLAR } from './src/js/fidanlar.js';

/* Sitenin adresi. Alan adı bağlanınca YALNIZCA burayı değiştir (ör. 'https://www.sagfidancilik.com');
   sitemap.xml, robots.txt ve sayfalardaki paylaşım/dil etiketleri buna göre üretilir. */
const SITE_URL = 'https://fidan-template.onrender.com';

const SAYFALAR = [
  // [dosya, adres, öncelik, güncellenme sıklığı]
  ['index.html', '/', '1.0', 'weekly'],
  ['catalog.html', '/catalog.html', '0.9', 'weekly'],
  ['rehber.html', '/rehber.html', '0.7', 'monthly'],
  ['tesislerimiz.html', '/tesislerimiz.html', '0.6', 'monthly'],
  ['galeri.html', '/galeri.html', '0.5', 'monthly'],
];
// Tür sayfaları (scripts/tur-sayfalari.mjs üretir): src/mandalina-fidani/index.html ...
const TUR_SAYFALARI = readdirSync(resolve(__dirname, 'src')).filter(d => d.endsWith('-fidani') && existsSync(resolve(__dirname, 'src', d, 'index.html')));
SAYFALAR.push(...TUR_SAYFALARI.map(d => [`${d}/index.html`, `/${d}/`, '0.8', 'weekly']));
const DILLER = { tr: 'tr_TR', en: 'en_US', ru: 'ru_RU', ar: 'ar_AR' };
const xml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* SEO eklentisi:
   - Her sayfanın <head>'ine dil seçenekleri (hreflang) ve paylaşım (Open Graph) etiketlerini ekler
   - Derlemede sitemap.xml (sayfalar + her fidan türü + her çeşit) ve robots.txt üretir */
function seo() {
  return {
    name: 'sag-seo',
    transformIndexHtml(html, ctx) {
      const dosya = (ctx.path || '/index.html').replace(/^\//, '') || 'index.html';
      const sayfa = SAYFALAR.find(s => s[0] === dosya);
      if (!sayfa) return html.replaceAll('__SITE__', SITE_URL);
      const url = SITE_URL + sayfa[1];
      const baslik = (html.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] || 'Sağ Fidancılık';
      const aciklama = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
      const etiketler = [
        `<link rel="alternate" hreflang="tr" href="${url}" />`,
        ...['en', 'ru', 'ar'].map(l => `<link rel="alternate" hreflang="${l}" href="${url}?lang=${l}" />`),
        `<link rel="alternate" hreflang="x-default" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="Sağ Fidancılık" />`,
        `<meta property="og:locale" content="${DILLER.tr}" />`,
        ...['en', 'ru', 'ar'].map(l => `<meta property="og:locale:alternate" content="${DILLER[l]}" />`),
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:title" content="${xml(baslik)}" />`,
        `<meta property="og:description" content="${xml(aciklama)}" />`,
        `<meta property="og:image" content="${SITE_URL}/og.jpg" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
      ].map(e => '  ' + e).join('\n');
      return html.replaceAll('__SITE__', SITE_URL).replace('</head>', `${etiketler}\n</head>`);
    },
    generateBundle() {
      const bugun = new Date().toISOString().slice(0, 10);
      const satir = (yol, oncelik, siklik) =>
        `  <url><loc>${xml(SITE_URL + yol)}</loc><lastmod>${bugun}</lastmod><changefreq>${siklik}</changefreq><priority>${oncelik}</priority></url>`;
      const fidanlar = TUM_FIDANLAR.filter(f => !f.hidden);
      const kategoriler = CATEGORIES.filter(c => fidanlar.some(f => f.category === c.key));
      const urls = [
        ...SAYFALAR.map(([, yol, o, s]) => satir(yol, o, s)),
        ...fidanlar.map(f => {
          const c = CATEGORIES.find(c => c.key === f.category);
          return satir(`/catalog.html?${c ? `kategori=${c.slug}&` : ''}fidan=${f.id}`, '0.6', 'monthly');
        }),
      ];
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
    },
  };
}

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
        rehber: resolve(__dirname, 'src/rehber.html'),
        notfound: resolve(__dirname, 'src/404.html'),
        ...Object.fromEntries(TUR_SAYFALARI.map(d => [d, resolve(__dirname, 'src', d, 'index.html')])),
      },
    },
  },
  plugins: [
    injectHtml(),
    seo(),
    FullReload(['src/partials/**/*.html', 'src/**/*.html']),
  ],
});
