/* ==========================================================
   Her fidan türü için ayrı, Google'ın doğrudan okuyabileceği sayfa üretir:
     src/mandalina-fidani/index.html  ->  sagfidancilik.com/mandalina-fidani/
   Bilgiler js/fidanlar.js'ten gelir. Fidan eklediğinde / değiştirdiğinde çalıştır:
     npm run sayfalar
   ========================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const { CATEGORIES, TUM_FIDANLAR, FIDAN_BOYLARI, TUPLU } = await import('../src/js/fidanlar.js');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const var_ = p => existsSync(join(KOK, p));
const kucuk = p => (var_('img/kucuk/' + p.replace(/^img\//, '')) ? 'img/kucuk/' + p.replace(/^img\//, '') : p);
const dosyalar = d => (existsSync(join(KOK, d)) ? readdirSync(join(KOK, d)) : []);
const MEYVE = dosyalar('img/meyve'), TEKLI = dosyalar('img/fidan-tekli'), FIDAN = dosyalar('img/fidan');

// Kart görseli: data.js'teki sırayla (gerçek meyve fotoğrafı > meyve > tür meyvesi > tekli fidan > tür fidanı)
function gorsel(f, c) {
  for (const ad of [`${f.slug}-gercek`, f.slug, `${c.slug}-gercek`, c.slug]) {
    const d = MEYVE.find(x => x.replace(/\.\w+$/, '') === ad);
    if (d) return '/' + kucuk(`img/meyve/${d}`);
  }
  if (var_(`img/${f.slug}.webp`)) return '/' + kucuk(`img/${f.slug}.webp`);
  const t = TEKLI.find(x => x.startsWith(f.slug + '-')); if (t) return '/' + kucuk(`img/fidan-tekli/${t}`);
  const fd = FIDAN.find(x => x.startsWith(c.slug + '-')); if (fd) return '/' + kucuk(`img/fidan/${fd}`);
  return '/img/pot-plant.webp';
}
const ozellik = (f, ...k) => k.map(a => (f.specs || []).find(([x]) => x === a)).filter(Boolean);

const sablon = readFileSync(join(KOK, 'catalog.html'), 'utf8');
const bas = sablon.slice(0, sablon.indexOf('</head>'))
  .replace(/<title[^>]*>.*?<\/title>/s, '<!--TITLE-->')
  .replace(/<meta name="description"[^>]*\/>/s, '<!--DESC-->')
  .replace(/\s*<script type="application\/ld\+json">.*?<\/script>/gs, '')
  .replace(/(href|src)="\.\//g, '$1="/');

const gorunur = TUM_FIDANLAR.filter(f => !f.hidden);
const turler = CATEGORIES.filter(c => c.key !== 'Anaç' && gorunur.some(f => f.category === c.key));

// eski üretilmiş sayfaları temizle
for (const d of readdirSync(KOK)) if (d.endsWith('-fidani') && existsSync(join(KOK, d, 'index.html'))) rmSync(join(KOK, d), { recursive: true });

for (const c of turler) {
  const liste = gorunur.filter(f => f.category === c.key);
  const ad = c.key;
  const url = `/${c.slug}-fidani/`;
  const baslik = `${ad} Fidanı Çeşitleri ve Özellikleri | Sağ Fidancılık Hatay`;
  const aciklama = `${ad} fidanı çeşitlerimiz: ${liste.slice(0, 6).map(f => f.name || f.title).join(', ')}${liste.length > 6 ? ' ve diğerleri' : ''}. 2001'den beri Samandağ / Hatay'da sertifikalı fidan üretimi; toptan satış, fiyat ve stok için arayın.`;

  const kartlar = liste.map(f => {
    const oz = ozellik(f, 'Hasat', 'Olgunlaşma', 'Meyve', 'Et', 'Çekirdek', 'Kullanım').slice(0, 3);
    const boy = FIDAN_BOYLARI[f.slug]?.map(([y, cm]) => `${TUPLU.has(f.slug) ? 'Tüplü' : 'Tüplü aşılı'} · ${y} yaş · ${cm} cm`).join(' / ');
    return `
          <article class="tur-kart">
            <a class="tur-kart__img" href="/catalog.html?kategori=${c.slug}&amp;fidan=${f.id}" tabindex="-1" aria-hidden="true"><img src="${gorsel(f, c)}" alt="${esc(f.title)} fidanı" width="600" height="600" loading="lazy"></a>
            <div class="tur-kart__body">
              <h2 class="tur-kart__name"><a href="/catalog.html?kategori=${c.slug}&amp;fidan=${f.id}">${esc(f.title)}</a></h2>
              ${f.desc ? `<p class="tur-kart__desc">${esc(f.desc)}</p>` : '<p class="tur-kart__desc">Bu çeşidin özellikleri, stok ve fiyat bilgisi için bizi arayın.</p>'}
              ${oz.length ? `<dl class="tur-kart__specs">${oz.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
              ${boy ? `<p class="tur-kart__boy"><i class="i i-sprout"></i>${esc(boy)}</p>` : ''}
            </div>
          </article>`;
  }).join('');

  const digerleri = turler.filter(x => x !== c).map(x => `<a class="chip" href="/${x.slug}-fidani/">${esc(x.key)}</a>`).join('');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: '__SITE__/' },
      { '@type': 'ListItem', position: 2, name: 'Fidan Çeşitleri', item: '__SITE__/catalog.html' },
      { '@type': 'ListItem', position: 3, name: `${ad} Fidanı`, item: `__SITE__${url}` }] },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: `${ad} fidanı çeşitleri`, itemListElement: liste.map((f, i) => (
      { '@type': 'ListItem', position: i + 1, name: f.title, url: `__SITE__/catalog.html?kategori=${c.slug}&fidan=${f.id}` })) },
  ];

  const html = `<!doctype html>
${bas.replace(/^<!doctype html>\s*/i, '').replace('<!--TITLE-->', `<title>${esc(baslik)}</title>`).replace('<!--DESC-->', `<meta name="description" content="${esc(aciklama)}" />`)}
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<!-- Bu sayfa scripts/tur-sayfalari.mjs ile üretildi; elle değiştirme, "npm run sayfalar" çalıştır. -->
<body id="top" data-tur="${esc(c.key)}">

  <load src="partials/header.html" />

  <main>
    <section class="page-hero page-hero--fidan">
      <div class="wrap">
        <nav class="crumbs" aria-label="Konum" data-i18n-attr="aria-label:catalog.crumbs"><a href="/" data-i18n="nav.home">Ana Sayfa</a><i class="i i-chevron-right"></i><a href="/catalog.html" data-i18n="footer.catalog">Fidan Çeşitleri</a><i class="i i-chevron-right"></i><span class="tur-ad">${esc(ad)}</span></nav>
        <h1 class="tur-baslik">${esc(ad)} <em>Fidanı</em> Çeşitleri</h1>
        <p class="tur-giris">${esc(c.desc || '')} ${liste.length} çeşit sertifikalı fidan; fiyat ve stok bilgisi için bizi arayın.</p>
      </div>
    </section>

    <section class="wrap tur-bolum">
      <div class="tur-grid" id="turGrid">${kartlar}
      </div>
    </section>

    <!-- Bu türün hasat takvimi (js/hasat.js) -->
    <section class="section" id="hasat">
      <div class="wrap deep-panel harvest-panel">
        <header class="section-head">
          <span class="eyebrow" data-i18n="harvest.eyebrow">Hasat takvimi</span>
          <h2 data-i18n="harvest.title">Hangi çeşit <em>ne zaman</em> olgunlaşır?</h2>
        </header>
        <div class="harvest harvest--tek">
          <div class="harvest__tabs" role="tablist"></div>
          <div class="harvest__scroll"><div class="harvest__grid"></div></div>
          <p class="harvest__note"><span class="harvest__legend"></span><span data-i18n="harvest.note">Hasat zamanı bölgeye ve yıla göre birkaç hafta değişebilir.</span></p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap tur-cta">
        <div>
          <h2>${esc(ad)} fidanı için <em>teklif alın</em></h2>
          <p>Çeşit, adet ve dikim yerinizi yazın; size uygun fidanı birlikte seçelim.</p>
        </div>
        <div class="tur-cta__actions">
          <button class="btn btn-primary" type="button" data-quote><i class="i i-quote"></i> <span data-i18n="quote.btn">Teklif İste</span></button>
          <a class="btn btn-outline" href="tel:+905336125225"><i class="i i-phone"></i> 0533 612 52 25</a>
        </div>
      </div>
      <div class="wrap tur-diger">
        <h2 class="specs__title">Diğer fidan türlerimiz</h2>
        <div class="tur-diger__list">${digerleri}</div>
      </div>
    </section>
  </main>

  <load src="partials/footer.html" />

  <script type="module" src="/js/tur.js"></script>
</body>
</html>
`;
  mkdirSync(join(KOK, `${c.slug}-fidani`), { recursive: true });
  writeFileSync(join(KOK, `${c.slug}-fidani`, 'index.html'), html);
}
console.log(`${turler.length} tür sayfası üretildi.`);
