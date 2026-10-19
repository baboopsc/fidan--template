/* ==========================================================
   Dil desteği: Türkçe, English, Русский.
   - Türkçe metinler HTML'in kendisindedir; ayrıca yazmaya gerek yok.
   - Çevrilecek her öğe data-i18n="anahtar" ile işaretlidir
     (öznitelikler için data-i18n-attr="placeholder:anahtar;aria-label:anahtar2").
   - İngilizce ve Rusça metinler js/i18n/en.js ve js/i18n/ru.js dosyalarındadır.
   - Seçilen dil tarayıcıda hatırlanır; ?lang=en bağlantısıyla da açılabilir.
   ========================================================== */
import en from './i18n/en.js';
import ru from './i18n/ru.js';

export const LANGS = ['tr', 'en', 'ru'];
const DICTS = { en, ru };

// JS'in kendisinin ürettiği Türkçe metinler (HTML'de olmayanlar)
const TR = { count: '{n} fidan listeleniyor', fullName: '{name} Fidanı', 'card.view': 'Detayları gör' };

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

// Sayılar: "%33,4" -> "33.4%" (EN) / "33,4%" (RU); RU'da "mm, g, m" -> "мм, г, м"
function sayilar(v) {
  if (lang === 'tr') return v;
  let s = v.replace(/%(\d+(?:,\d+)?(?:–\d+(?:,\d+)?)?)/g, '$1%');
  if (lang === 'en') s = s.replace(/(\d),(\d)/g, '$1.$2');
  if (lang === 'ru') s = s.replace(/(\d)\s?mm\b/g, '$1 мм').replace(/(\d)\s?g\b/g, '$1 г').replace(/(\d)\s?m\b/g, '$1 м');
  return s;
}

/* Bir fidanın seçili dildeki hâli: başlık, açıklama, kategori ve tüm özellikler.
   Çevirisi olmayan alan Türkçe gösterilir. */
export function localize(f) {
  const d = sozluk();
  const p = d?.products[f.id] || {};
  const labels = { ...(d?.labels || {}), ...(p.labels || {}) };
  const spec = ([k, v]) => [labels[k] ?? k, p.specs?.[k] ?? sayilar(v)];
  return { title: p.title ?? f.title, desc: p.desc ?? f.desc, category: cat(f.category), specs: f.specs.map(spec), spec };
}

// Görsel alt metni: "Washington Portakal Fidanı" / "Washington Orange sapling"
export const fullName = f => (f.category === 'Anaç' ? localize(f).title : t('fullName', { name: localize(f).title }));

/* ---------- Sayfadaki sabit metinleri çevir ---------- */
const asil = new Map();      // öğe -> Türkçe içerik
const asilAttr = new Map();  // öğe -> { öznitelik: Türkçe değer }

function uygula() {
  const d = sozluk();
  document.documentElement.lang = lang;

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
