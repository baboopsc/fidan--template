/* ==========================================================
   Rehber yazıları: sitedeki fidan bilgilerinden üretilen, Google'ın okuyabileceği yazılar
     src/rehber/mandalina-cesitleri/index.html  ->  /rehber/mandalina-cesitleri/
   Bilgi uydurulmaz: her şey js/fidanlar.js'teki açıklama ve özelliklerden gelir.
   "npm run build" bunu kendiliğinden çalıştırır; elle: node scripts/yazilar.mjs
   ========================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const { CATEGORIES, TUM_FIDANLAR } = await import('../src/js/fidanlar.js');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const ayk = AYLAR.map(a => a.toLocaleLowerCase('tr'));
const gorunur = TUM_FIDANLAR.filter(f => !f.hidden);
const catOf = f => CATEGORIES.find(c => c.key === f.category);
const spec = (f, k) => (f.specs || []).find(([x]) => x === k)?.[1];
const link = f => `/catalog.html?kategori=${catOf(f).slug}&amp;fidan=${f.id}`;

// js/hasat.js ile aynı kural
function hasatAylari(f) {
  const s = spec(f, 'Hasat') || spec(f, 'Olgunlaşma');
  if (!s) return [];
  const v = s.toLocaleLowerCase('tr');
  if (/yıl boyu/.test(v)) return [...Array(12).keys()];
  const bul = [];
  ayk.forEach((a, i) => { let p = v.indexOf(a); while (p > -1) { bul.push({ i, p }); p = v.indexOf(a, p + 1); } });
  bul.sort((a, b) => a.p - b.p);
  const set = new Set();
  if (!bul.length && /kış/.test(v)) [11, 0, 1].forEach(m => set.add(m));
  bul.forEach((b, k) => { set.add(b.i); const n = bul[k + 1]; if (!n) return; const ara = v.slice(b.p, n.p); if (/[–-]/.test(ara) && !ara.includes(',')) for (let m = b.i; m !== n.i; m = (m + 1) % 12) set.add(m); });
  return [...set];
}
// Turunçgil sezonu sonbaharda başlar: Eylül = 0 ... Ağustos = 11
const sezonBas = f => { const a = new Set(hasatAylari(f)); if (!a.size) return 99; if (a.size === 12) return -1;
  return Math.min(...[...a].filter(m => !a.has((m + 11) % 12)).map(m => (m - 8 + 12) % 12)); };

const sablon = readFileSync(join(KOK, 'rehber.html'), 'utf8');
const bas = sablon.slice(0, sablon.indexOf('</head>'))
  .replace(/<title[^>]*>.*?<\/title>/s, '<!--TITLE-->')
  .replace(/<meta name="description"[^>]*\/>/s, '<!--DESC-->')
  .replace(/\s*<script type="application\/ld\+json">.*?<\/script>/gs, '')
  .replace(/(href|src)="\.\//g, '$1="/')
  .replace('<link rel="stylesheet" href="/css/guide.css" />', '<link rel="stylesheet" href="/css/guide.css" />\n  <link rel="stylesheet" href="/css/article.css" />');

const YAZILAR = [];
function sayfa({ slug, baslik, kisa, aciklama, govde }) {
  YAZILAR.push({ slug, baslik, kisa });
  const url = `/rehber/${slug}/`;
  const duz = baslik.replace(/<[^>]+>/g, '');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: duz, description: aciklama, inLanguage: 'tr',
      author: { '@type': 'Organization', name: 'Sağ Fidancılık' }, publisher: { '@type': 'Organization', name: 'Sağ Fidancılık', logo: { '@type': 'ImageObject', url: '__SITE__/icon-512.png' } },
      mainEntityOfPage: `__SITE__${url}`, image: '__SITE__/og.jpg' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: '__SITE__/' },
      { '@type': 'ListItem', position: 2, name: 'Dikim Rehberi', item: '__SITE__/rehber.html' },
      { '@type': 'ListItem', position: 3, name: duz, item: `__SITE__${url}` }] },
  ];
  return { slug, html: (diger) => `<!doctype html>
${bas.replace(/^<!doctype html>\s*/i, '').replace('<!--TITLE-->', `<title>${esc(duz)} | Sağ Fidancılık</title>`).replace('<!--DESC-->', `<meta name="description" content="${esc(aciklama)}" />`)}
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<!-- Bu sayfa scripts/yazilar.mjs ile üretildi; elle değiştirme. -->
<body id="top">

  <load src="partials/header.html" />

  <main>
    <section class="page-hero page-hero--rehber">
      <div class="wrap">
        <nav class="crumbs" aria-label="Konum" data-i18n-attr="aria-label:catalog.crumbs"><a href="/" data-i18n="nav.home">Ana Sayfa</a><i class="i i-chevron-right"></i><a href="/rehber.html" data-i18n="nav.guide">Dikim Rehberi</a></nav>
        <h1>${baslik}</h1>
        <p>${esc(kisa)}</p>
      </div>
    </section>

    <article class="wrap article" lang="tr">
${govde}
      <aside class="article__cta">
        <div><b>Bahçeniz için çeşit seçimine yardım edelim</b><p>Bölgenize ve amacınıza uygun çeşitleri birlikte belirleyelim; toptan siparişler için teklif hazırlayalım.</p></div>
        <div class="article__cta-btns">
          <button class="btn btn-primary" type="button" data-quote><i class="i i-quote"></i> <span data-i18n="quote.btn">Teklif İste</span></button>
          <a class="btn btn-outline" href="tel:+905336125225"><i class="i i-phone"></i> 0533 612 52 25</a>
        </div>
      </aside>
      <nav class="article__more" aria-label="Diğer yazılar">
        <h2>Diğer rehber yazıları</h2>
        <ul>${diger.filter(y => y.slug !== slug).map(y => `<li><a href="/rehber/${y.slug}/">${esc(y.baslik.replace(/<[^>]+>/g, ''))}</a></li>`).join('')}<li><a href="/rehber.html">Dikim ve bakım rehberi</a></li></ul>
      </nav>
    </article>
  </main>

  <load src="partials/footer.html" />

  <script type="module" src="/js/rehber.js"></script>
</body>
</html>
` };
}

/* ---------- Bir türün çeşitleri, hasat sırasıyla ---------- */
function cesitYazisi(turKey, slug, baslik, kisa) {
  const liste = gorunur.filter(f => f.category === turKey).sort((a, b) => sezonBas(a) - sezonBas(b));
  const grup = f => { const s = sezonBas(f); if (s === 99) return 'Hasat ayı belirtilmeyenler'; if (s <= 2) return 'Erkenci çeşitler (Eylül – Kasım)'; if (s <= 4) return 'Orta mevsim çeşitleri (Aralık – Ocak)'; return 'Geççi çeşitler (Şubat ve sonrası)'; };
  const tur = turKey.toLocaleLowerCase('tr');
  const ozet = liste.map(f => `<tr><td><a href="${link(f)}">${esc(f.title)}</a></td><td>${esc(spec(f, 'Hasat') || spec(f, 'Olgunlaşma') || '—')}</td><td>${esc(spec(f, 'Çekirdek') || '—')}</td></tr>`).join('');
  let govde = `
      <p class="article__lead">Sağ Fidancılık'ta ${liste.length} ${tur} çeşidi yetiştiriyoruz. Aşağıda bu çeşitleri hasat zamanına göre sıraladık. Erkenci, orta mevsim ve geççi çeşitleri birlikte dikerek bahçenizde hasadı sonbahardan ilkbahara kadar aylara yayabilirsiniz.</p>
      <h2>Kısaca: hasat sırası</h2>
      <div class="article__table"><table><thead><tr><th>Çeşit</th><th>Hasat</th><th>Çekirdek</th></tr></thead><tbody>${ozet}</tbody></table></div>`;
  let son = '';
  for (const f of liste) {
    const g = grup(f);
    if (g !== son) { govde += `\n      <h2>${esc(g)}</h2>`; son = g; }
    const oz = ['Hasat', 'Olgunlaşma', 'Meyve şekli', 'Kabuk', 'Et', 'Kabuk–et bağlılığı', 'Çekirdek', 'Anavatan'].map(k => [k, spec(f, k)]).filter(([, v]) => v);
    govde += `
      <section class="article__item">
        <h3><a href="${link(f)}">${esc(f.title)}</a></h3>
        ${f.desc ? `<p>${esc(f.desc)}</p>` : ''}
        ${oz.length ? `<dl>${oz.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      </section>`;
  }
  const aciklama = `${turKey} çeşitleri hasat zamanına göre: ${liste.slice(0, 5).map(f => f.name || f.title).join(', ')} ve diğerleri. Erkenciden geççiye ${tur} çeşitlerinin hasat ayları ve özellikleri.`;
  return sayfa({ slug, baslik, kisa, aciklama, govde });
}

/* ---------- Aylara göre hasat takvimi ---------- */
function takvimYazisi() {
  const slug = 'hasat-takvimi';
  let govde = `
      <p class="article__lead">Yetiştirdiğimiz fidan çeşitlerinin hasat zamanlarını aylara göre bir araya getirdik. Bahçe kurarken farklı aylarda olgunlaşan türleri ve çeşitleri birlikte seçerek yılın büyük bölümünde ürün alabilirsiniz. Hasat zamanı bölgeye ve yıla göre birkaç hafta değişebilir.</p>
      <p>Bu sayfadaki bilgiler çeşitlerin <a href="/catalog.html">fidan sayfalarındaki</a> hasat bilgilerinden derlendi. Bütün yıl ürün veren çeşitler (ör. yediveren limonlar) her ayda tekrar edilmedi; listenin sonunda ayrıca belirtildi.</p>`;
  const yilBoyu = gorunur.filter(f => hasatAylari(f).length === 12);
  AYLAR.forEach((ad, i) => {
    const o = gorunur.filter(f => { const a = hasatAylari(f); return a.length && a.length < 12 && a.includes(i); });
    if (!o.length) return;
    const turler = [...new Set(o.map(f => f.category))];
    govde += `
      <section class="article__month">
        <h2>${ad}</h2>
        <ul>${turler.map(tk => `<li><b>${esc(tk)}:</b> ${o.filter(f => f.category === tk).map(f => `<a href="${link(f)}">${esc(f.name || f.title)}</a>`).join(', ')}</li>`).join('')}</ul>
      </section>`;
  });
  if (yilBoyu.length) govde += `
      <section class="article__month">
        <h2>Bütün yıl</h2>
        <ul><li>${yilBoyu.map(f => `<a href="${link(f)}">${esc(f.title)}</a>`).join(', ')}</li></ul>
      </section>`;
  return sayfa({ slug, baslik: 'Hangi Ayda Hangi Fidan Hasat Edilir? <em>Aylara Göre</em> Hasat Takvimi', kisa: 'Ocaktan aralığa, yetiştirdiğimiz meyve ve turunçgil çeşitlerinin hasat ayları.',
    aciklama: 'Aylara göre hasat takvimi: mandalina, portakal, limon, kiraz, kayısı, erik, şeftali, incir, nar, zeytin ve diğer fidan çeşitlerinin hangi ayda hasat edildiği.', govde });
}

const sayfalar = [
  cesitYazisi('Mandalina', 'mandalina-cesitleri', 'Mandalina Çeşitleri: <em>Erkenciden Geççiye</em> Hasat Sırası', 'Yetiştirdiğimiz mandalina çeşitleri, hasat zamanına göre sıralı; her çeşidin kabuk, çekirdek ve anavatan bilgisiyle.'),
  cesitYazisi('Portakal', 'portakal-cesitleri', 'Portakal Çeşitleri ve <em>Hasat Zamanları</em>', 'Göbekli, kan ve sıkmalık portakal çeşitlerimiz, hasat zamanına göre sıralı.'),
  takvimYazisi(),
];
const klasor = join(KOK, 'rehber');
for (const s of sayfalar) {
  mkdirSync(join(klasor, s.slug), { recursive: true });
  writeFileSync(join(klasor, s.slug, 'index.html'), s.html(YAZILAR));
}
console.log(`${sayfalar.length} rehber yazısı üretildi.`);
