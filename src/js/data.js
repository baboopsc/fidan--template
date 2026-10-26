/* ==========================================================
   Firma bilgileri ve fidan listesi.
   Fidanların kendisi js/fidanlar.js dosyasında; burada site için yardımcılar var.
   ========================================================== */
import { CATEGORIES, GROUPS, TUM_FIDANLAR } from './fidanlar.js';
export { CATEGORIES, GROUPS };

export const SITE = {
  name: 'Sağ Fidancılık',
  phone: { name: 'Ali Sağ', tel: '+905336125225', label: '0533 612 52 25' },
  // Sosyal medya: tam bağlantıyı yaz (ör. 'https://www.instagram.com/kullaniciadi').
  // Boş bırakılırsa sitede o buton gizlenir.
  instagram: 'https://www.instagram.com/ali_alisag/',
  facebook: 'https://www.facebook.com/sag.fidanc.l.k/',
  // WhatsApp numarası (ülke koduyla, boşluksuz). Boş bırakılırsa WhatsApp butonları gizlenir.
  whatsapp: '905336125225',
};

/* src/img klasöründeki fotoğrafları Vite kendisi bulur.
   Ürün fotoğrafını slug adıyla koyman yeterli: washington-navel-portakal.webp, gemlik-zeytin.jpg ...
   (scripts/gorsel-uret.mjs görselleri bu adlarla kendisi kaydeder)
   Fotoğrafı olmayan fidanda pot-plant.png gösterilir. */
const IMAGES = import.meta.glob('../img/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const FALLBACK = IMAGES['../img/pot-plant.png'] || '';

export function imgFor(slug) {
  if (!slug) return FALLBACK;
  const key = Object.keys(IMAGES).find(k => new RegExp(`/${slug}\\.(jpe?g|png|webp|avif)$`, 'i').test(k));
  return key ? IMAGES[key] : FALLBACK;
}

/* Gerçek fotoğraflar — klasöre atman yeterli, ada göre sıralanır:
   src/img/fidan/<kategori-slug>-1.webp ... -> o türün gerçek fidan fotoğrafları
       (ör. zeytin-3.webp). Fidanlar sayfasında ürün penceresinde, Tesislerimiz'de ve Galeri'de görünür.
   src/img/tesis  -> yalnızca "Tesislerimiz" sayfasında (fidanlık genel görünümleri)
   src/img/galeri -> yalnızca "Galeri" sayfasında (bahçeler, hasat, müşteri fotoğrafları ...) */
const sirala = obj => Object.keys(obj).sort((a, b) => a.localeCompare(b, 'tr', { numeric: true }));
const FIDAN = import.meta.glob('../img/fidan/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const TESIS = import.meta.glob('../img/tesis/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const GALERI = import.meta.glob('../img/galeri/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const FIDAN_KEYS = sirala(FIDAN);

// Bir türün gerçek fidan fotoğrafları: fidanFotolari('zeytin') -> [zeytin-1, zeytin-2, ...]
export const fidanFotolari = slug => FIDAN_KEYS.filter(k => new RegExp(`/${slug}-\\d+\\.\\w+$`).test(k)).map(k => FIDAN[k]);

/* Ana sayfa slaytı ve Tesislerimiz'de önce gösterilecek fidanlık görünümleri (dosya adları, uzantısız).
   Listede olmayan fotoğraflar arkadan gelir. */
const ONCE = ['greyfurt-3', 'zeytin-9', 'kamkat-1', 'trabzon-hurmasi-1', 'nar-3', 'zeytin-10', 'greyfurt-1', 'zeytin-1'];
const ad = k => k.split('/').pop().replace(/\.\w+$/, '');
const FIDAN_SIRALI = [...FIDAN_KEYS].sort((a, b) => {
  const i = x => (ONCE.indexOf(ad(x)) + 1) || 999;
  return i(a) - i(b);
}).map(k => FIDAN[k]);

export const TESIS_FOTOLARI = [...sirala(TESIS).map(k => TESIS[k]), ...FIDAN_SIRALI];
export const GALERI_FOTOLARI = [...sirala(GALERI).map(k => GALERI[k]), ...FIDAN_KEYS.map(k => FIDAN[k])];

export const FIDANLAR = TUM_FIDANLAR.filter(f => !f.hidden);
export const catOf = f => CATEGORIES.find(c => c.key === f.category);

/* ---------- Meyve ve fidan görselleri ----------
   Her çeşidin iki görseli olur: MEYVESİ ve FİDANI (ürün penceresinde üstte meyve, altta fidan).
   Meyve:  src/img/meyve/<çeşit-slug>.webp  ->  yoksa  src/img/meyve/<kategori-slug>.webp
           (yoksa eski üretilmiş görseller: src/img/<çeşit-slug>.webp, src/img/kategori-<slug>.webp;
            gerçek fotoğrafı olan türlerde eski görseller kullanılmaz)
           Dosya adı "-gercek" ile bitiyorsa (ör. kamkat-gercek.webp) gerçek fotoğraf sayılır.
   Fidan:  src/img/fidan/<kategori-slug>-1.webp ...  (gerçek fotoğraflar)
           yoksa  src/img/fidan-temsili/<kategori-slug>.webp  (yapay zekâyla üretilmiş, "Görsel temsilidir") */
const MEYVE = import.meta.glob('../img/meyve/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const FIDAN_TEMSILI = import.meta.glob('../img/fidan-temsili/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const bul = (glob, slug) => Object.keys(glob).find(k => new RegExp(`/${slug}(-gercek)?\\.\\w+$`).test(k));
const eski = slug => { const u = imgFor(slug); return u !== FALLBACK ? u : null; };

// Meyve görseli -> { src, gercek } ya da null
export function meyveGorseli(f) {
  const c = catOf(f);
  const k = bul(MEYVE, f.slug) || (c && bul(MEYVE, c.slug));
  if (k) return { src: MEYVE[k], gercek: /-gercek\.\w+$/.test(k) };
  if (c?.gercekFoto) return null;
  const src = eski(f.slug) || eski(`kategori-${c?.slug}`);
  return src ? { src, gercek: false } : null;
}
// Fidan görselleri -> [{ src, gercek }]: önce gerçek fotoğraflar, yoksa tek bir temsili görsel
export function fidanGorselleri(c) {
  const gercek = fidanFotolari(c?.slug).map(src => ({ src, gercek: true }));
  if (gercek.length) return gercek;
  const k = c && bul(FIDAN_TEMSILI, c.slug);
  return k ? [{ src: FIDAN_TEMSILI[k], gercek: false }] : [];
}
// Aynı türdeki çeşitler gerçek fidan fotoğraflarından sırayla farklı birini alır
const sira = f => Math.max(0, TUM_FIDANLAR.filter(x => x.category === f.category && !x.hidden).indexOf(f));
export function fidanGorselleriSirali(f) {
  const liste = fidanGorselleri(catOf(f));
  const bas = liste.length ? sira(f) % liste.length : 0;
  return [...liste.slice(bas), ...liste.slice(0, bas)];
}
// Kartta görünen görsel: meyvesi; meyvesi yoksa fidanı; o da yoksa saksı görseli
export function fidanImg(f) {
  return meyveGorseli(f)?.src || fidanGorselleriSirali(f)[0]?.src || FALLBACK;
}
// Kategori kartının görseli: türün meyvesi; yoksa (gerçek fotoğrafı olmayan türde) eski kategori görseli; yoksa fidanı
export function kategoriImg(c) {
  const k = bul(MEYVE, c.slug);
  if (k) return MEYVE[k];
  return (!c.gercekFoto && eski(`kategori-${c.slug}`)) || fidanGorselleri(c)[0]?.src || FALLBACK;
}
export const VARSAYILAN_GORSEL = FALLBACK;
export const groupOf = f => catOf(f)?.group || 'Meyve';
export const inCategory = key => FIDANLAR.filter(f => f.category === key);
export const visibleCategories = () => CATEGORIES.filter(c => inCategory(c.key).length);
export const byId = id => FIDANLAR.find(f => f.id === Number(id));
export const hasDetail = f => Boolean(f.specs?.length);

/* Kartta ve ürün penceresinin üstünde gösterilen 3 öne çıkan bilgi: zaman, meyve, köken.
   Her satırda, fidanda bulunan ilk başlık seçilir -> [ikon, başlık, değer] */
const PICK = [
  [['Hasat', 'calendar'], ['Olgunlaşma', 'calendar'], ['İlk ürün', 'calendar'], ['Verime başlama', 'calendar'], ['Çiçeklenme', 'calendar'], ['Kullanım', 'leaf']],
  [['Ağırlık', 'scale'], ['İrilik', 'scale'], ['Meyve', 'scale'], ['Meyve şekli', 'scale'], ['Yağ oranı', 'droplet'], ['Yağ', 'droplet'], ['Kuvvet', 'tree']],
  [['Anavatan', 'pin'], ['Kullanım', 'leaf'], ['Uyum', 'leaf'], ['Tat', 'leaf'], ['Toprak', 'leaf'], ['Tozlayıcı', 'sprout']],
];
export function highlights(f) {
  if (!f.specs) return [];
  const map = new Map(f.specs);
  const used = new Set();
  return PICK.map(row => {
    const hit = row.find(([key]) => map.has(key) && !used.has(key));
    if (!hit) return null;
    used.add(hit[0]);
    return [hit[1], hit[0], map.get(hit[0])];
  }).filter(Boolean);
}
