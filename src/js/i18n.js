/* ==========================================================
   Dil desteği: Türkçe, English, Русский, العربية.
   - Arapça seçilince sayfa sağdan sola (dir="rtl") döner.
   - Türkçe metinler HTML'in kendisindedir; ayrıca yazmaya gerek yok.
   - Çevrilecek her öğe data-i18n="anahtar" ile işaretlidir
     (öznitelikler için data-i18n-attr="placeholder:anahtar;aria-label:anahtar2").
   - Çeviriler js/i18n/ klasöründedir: en.js, ru.js, ar.js.
   - Seçilen dil tarayıcıda hatırlanır; ?lang=en bağlantısıyla da açılabilir.
   ========================================================== */
import en from './i18n/en.js';
import ru from './i18n/ru.js';
import ar from './i18n/ar.js';

export const LANGS = ['tr', 'en', 'ru', 'ar'];
const DICTS = { en, ru, ar };
const RTL = ['ar'];

// JS'in kendisinin ürettiği Türkçe metinler (HTML'de olmayanlar)
const TR = {
  count: '{n} fidan bulundu',
  fullName: '{name} Fidanı',
  'card.view': 'Detayları gör',
  'card.ask': 'Bilgi için arayın',
  varieties: '{n} çeşit',
  catTitle: '{cat} Çeşitleri',
  'search.results': 'Arama sonuçları',
  noDetail: 'Bu çeşidin ayrıntılı özellikleri yakında eklenecek. Çeşit, stok ve fiyat bilgisi için bizi arayın.',
};

const kaydet = l => { try { localStorage.setItem('lang', l); } catch { /* gizli sekme vb. */ } };
const oku = () => { try { return localStorage.getItem('lang'); } catch { return null; } };

export let lang = (() => {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) { kaydet(q); return q; }
  const s = oku();
  return LANGS.includes(s) ? s : 'tr';
})();

const sozluk = () => DICTS[lang];

/* ---------- Metin yardımcıları ---------- */
export function t(key, vars = {}) {
  const s = sozluk()?.ui[key] ?? TR[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

// Kategori ve filtre adları: 'Mandalina' -> 'Mandarin'
export const cat = name => sozluk()?.cats[name] ?? name;

// Sayılar: "%33,4" -> "33.4%" (EN, AR) / "33,4%" (RU); birimler RU'da "мм, г, м", AR'da "مم، غ، م"
function sayilar(v) {
  if (lang === 'tr') return v;
  let s = v.replace(/%(\d+(?:,\d+)?(?:–\d+(?:,\d+)?)?)/g, '$1%');
  if (lang === 'en' || lang === 'ar') s = s.replace(/(\d),(\d)/g, '$1.$2');
  if (lang === 'ru') s = s.replace(/(\d)\s?mm\b/g, '$1 мм').replace(/(\d)\s?g\b/g, '$1 г').replace(/(\d)\s?m\b/g, '$1 м');
  if (lang === 'ar') s = s.replace(/(\d)\s?mm\b/g, '$1 مم').replace(/(\d)\s?g\b/g, '$1 غ').replace(/(\d)\s?m\b/g, '$1 م');
  return s;
}

// Yalnızca adı olan çeşitlerin başlığı: "Orri" + Mandalina -> "Orri Mandarin" / "Мандарин Orri" / "يوسفي Orri"
function baslik(f, d, p) {
  if (p.title) return p.title;
  if (!d || !f.name) return f.title;
  const tur = d.nouns?.[f.noun || f.category];
  if (!tur) return f.title;
  return d.titleOrder === 'noun-name' ? `${tur} ${f.name}` : `${f.name} ${tur}`;
}

/* Bir fidanın seçili dildeki hâli: başlık, açıklama, kategori ve tüm özellikler.
   Çevirisi olmayan alan Türkçe gösterilir. */
export function localize(f) {
  const d = sozluk();
  const p = d?.products[f.id] || {};
  const labels = { ...(d?.labels || {}), ...(p.labels || {}) };
  const spec = ([k, v]) => [labels[k] ?? k, p.specs?.[k] ?? sayilar(v)];
  return { title: baslik(f, d, p), desc: p.desc ?? f.desc ?? '', category: cat(f.category), specs: (f.specs || []).map(spec), spec };
}

// Kısa ad (kategori kartındaki önizleme listesi için): "Miho Wase", "White Mulberry" ...
export function shortName(f) {
  const p = sozluk()?.products[f.id];
  return (!f.specs && p?.title) ? p.title : (f.name || f.title);
}

// Görsel alt metni: "Washington Portakal Fidanı" / "Washington Orange sapling"
export const fullName = f => (f.category === 'Anaç' ? localize(f).title : t('fullName', { name: localize(f).title }));

/* ---------- Sayfadaki sabit metinleri çevir ---------- */
const asil = new Map();      // öğe -> Türkçe içerik
const asilAttr = new Map();  // öğe -> { öznitelik: Türkçe değer }

function uygula() {
  const d = sozluk();
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.includes(lang) ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (!asil.has(el)) asil.set(el, el.innerHTML);
    el.innerHTML = d?.ui[el.dataset.i18n] ?? asil.get(el);
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const ciftler = el.dataset.i18nAttr.split(';').map(p => p.split(':').map(x => x.trim()));
    if (!asilAttr.has(el)) asilAttr.set(el, Object.fromEntries(ciftler.map(([a]) => [a, el.getAttribute(a)])));
    ciftler.forEach(([a, k]) => el.setAttribute(a, d?.ui[k] ?? asilAttr.get(el)[a]));
  });

  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}

export function setLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  lang = l;
  kaydet(l);
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) { url.searchParams.delete('lang'); history.replaceState(null, '', url); }
  uygula();
  document.dispatchEvent(new CustomEvent('langchange', { detail: l })); // kartlar ve filtreler yeniden çizilir
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-lang]');
  if (b) setLang(b.dataset.lang);
});

uygula();
document.documentElement.classList.remove('i18n-wait'); // <head>'deki betik, çeviri bitene kadar sayfayı gizler
