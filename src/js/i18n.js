/* ==========================================================
   Dil desteği: Türkçe, English, Русский, العربية.
   - Arapça seçilince sayfa sağdan sola (dir="rtl") döner.
   - Türkçe metinler HTML'in kendisindedir; ayrıca yazmaya gerek yok.
   - Çevrilecek her öğe data-i18n="anahtar" ile işaretlidir
     (öznitelikler için data-i18n-attr="placeholder:anahtar;aria-label:anahtar2").
   - Çeviriler js/i18n/ klasöründedir: en.js, ru.js, ar.js.
   - Seçilen dil tarayıcıda hatırlanır; ?lang=en bağlantısıyla da açılabilir.
   ========================================================== */
export const LANGS = ['tr', 'en', 'ru', 'ar'];
// Çeviriler ayrı dosyalarda; yalnızca o dil seçilince indirilir (Türkçe girenler hiç indirmez -> site hızlı açılır)
const YUKLE = { en: () => import('./i18n/en.js'), ru: () => import('./i18n/ru.js'), ar: () => import('./i18n/ar.js') };
const DICTS = {};
async function sozlukYukle(l) {
  if (l !== 'tr' && !DICTS[l]) DICTS[l] = (await YUKLE[l]()).default;
}
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
  'hero.slide': 'Fotoğraf {n}',
  'modal.note': 'Görsel temsilidir',
  'modal.fruit': 'Meyvesi',
  'modal.sapling': 'Fidanı',
  'list.add': "Teklif listesine ekle",
  'list.added': "Teklif listesinde",
  'list.toast': "{name} teklif listesine eklendi",
  'list.open': "Teklif iste",
  'list.remove': "Listeden çıkar",
  'list.count': "{n} çeşit seçildi",
  'list.clear': "Listeyi temizle",
  'list.msg': "İstediğim fidanlar",
  'list.unit': "adet",
  'modal.close': 'Kapat',
  'gallery.photo': 'Fotoğraf',
  'gallery.prev': 'Önceki',
  'gallery.next': 'Sonraki',
  'viewer.zoom': 'Yakınlaştır',
  'viewer.hint': 'İki parmakla yakınlaştırın, kaydırarak geçin',
  'viewer.hintDesk': 'Yakınlaştırmak için çift tıklayın ya da tekerleği kullanın',
  'modal.saplingCat': '{cat} fidanlarımız',
  'modal.noFruit': 'Meyve görseli yakında',
  'modal.noSapling': 'Fidan fotoğrafı yakında',
  'modal.noSapling.p': 'Fidanlarımızı görmek için bizi arayın.',
  'modal.real': 'Fidanlarımızdan gerçek fotoğraf',
  'gallery.open': 'Fotoğraf {n}',
  'modal.wa.msg': 'Merhaba, {name} hakkında bilgi almak istiyorum.',
  'modal.sap.title': 'Satıştaki fidan',
  'sap.grafted': 'Tüplü aşılı',
  'sap.potted': 'Tüplü',
  'sap.age1': '1 yaş',
  'sap.age': '{n} yaş',
  'sap.guide': 'Dikim ve bakım rehberi',
  'meta.catalog.title': 'Fidan Çeşitleri | Sağ Fidancılık',
  'meta.catalog.desc': 'Mandalina, portakal, limon, greyfurt, zeytin, nar, incir, kayısı, erik, şeftali ve daha fazlası: 110\'u aşkın sertifikalı fidan çeşidi ve özellikleri.',
  'meta.cat.title': '{cat} Fidanı Çeşitleri | Sağ Fidancılık',
  'meta.cat.desc': '{cat} fidanı çeşitlerimiz: {list}. Sertifikalı, tüplü aşılı fidanlar Samandağ / Hatay\'dan; fiyat ve stok için arayın.',
  'quote.type.any': 'Henüz karar vermedim',
  'quote.msg.hello': 'Merhaba, fidan için fiyat teklifi almak istiyorum.',
  'quote.msg.variety': 'Çeşit',
  'quote.msg.name': 'Ad Soyad',
  'quote.name': 'Adınız Soyadınız',
  'quote.type': 'Fidan türü',
  'quote.qty': 'Adet',
  'quote.place': 'İl / İlçe',
  'quote.note': 'Notunuz',
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
// Kategori kartındaki kısa açıklama (Türkçesi js/fidanlar.js'te, CATEGORIES[].desc)
export const catDesc = c => sozluk()?.catDesc?.[c.key] ?? c.desc ?? '';

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

export async function setLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  await sozlukYukle(l);
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

await sozlukYukle(lang); // site Türkçe dışında bir dille açıldıysa önce o dilin çevirisi gelir
uygula();
document.documentElement.classList.remove('i18n-wait'); // <head>'deki betik, çeviri bitene kadar sayfayı gizler
