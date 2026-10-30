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
   Fotoğrafı olmayan fidanda pot-plant.webp gösterilir. */
const IMAGES = import.meta.glob('../img/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const FALLBACK = IMAGES['../img/pot-plant.webp'] || '';

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
// Çeşide özel tekli fidan fotoğrafları (ölçü tabelası önünde) — ürün penceresinde ve Tesislerimiz'de
const TEKLI = import.meta.glob('../img/fidan-tekli/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const TEKLI_KEYS = sirala(TEKLI);

// Bir türün gerçek fidan fotoğrafları: fidanFotolari('zeytin') -> [zeytin-1, zeytin-2, ...]
export const fidanFotolari = slug => FIDAN_KEYS.filter(k => new RegExp(`/${slug}-\\d+\\.\\w+$`).test(k)).map(k => FIDAN[k]);

/* Ana sayfa slaytı ve Tesislerimiz'de önce gösterilecek fidanlık görünümleri (dosya adları, uzantısız).
   Listede olmayan fotoğraflar arkadan gelir. */
const ONCE = ['greyfurt-3', 'zeytin-9', 'kamkat-1', 'trabzon-hurmasi-1', 'nar-3', 'zeytin-10', 'greyfurt-1', 'zeytin-1'];
const ad = k => k.split('/').pop().replace(/\.\w+$/, '');
// Aynı türün fotoğrafları art arda gelmesin: türlere ayırıp sırayla birer tane al (zeytin, nar, greyfurt, zeytin, ...)
const tur = k => ad(k).replace(/-\d+$/, '');
function dagit(keys) {
  const gruplar = {};
  keys.forEach(k => (gruplar[tur(k)] ||= []).push(k));
  const listeler = Object.values(gruplar).sort((a, b) => b.length - a.length);
  const out = [];
  for (let i = 0; out.length < keys.length; i++) listeler.forEach(l => l[i] && out.push(l[i]));
  return out;
}
const onceKi = ONCE.map(a => FIDAN_KEYS.find(k => ad(k) === a)).filter(Boolean);
const FIDAN_SIRALI = [...onceKi, ...dagit(FIDAN_KEYS.filter(k => !onceKi.includes(k)))].map(k => FIDAN[k]);

// Galeri: meyve ve fidan fotoğrafları karışık (bir meyve, bir fidan ...), her seferinde aynı sırayla
function karistir(arr, tohum) {
  const a = [...arr];
  let t = tohum;
  const rnd = () => { t = (t * 1664525 + 1013904223) % 4294967296; return t / 4294967296; };
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const meyveler = karistir(sirala(GALERI), 7).map(k => GALERI[k]);
const fidanlar = dagit(karistir(FIDAN_KEYS, 11)).map(k => FIDAN[k]);
const karisik = [];
for (let i = 0; i < Math.max(meyveler.length, fidanlar.length); i++) {
  if (meyveler[i]) karisik.push(meyveler[i]);
  if (fidanlar[i]) karisik.push(fidanlar[i]);
}

// Tesislerimiz: fidanlık fotoğrafları ile tekli fidan fotoğrafları karışık (iki fidanlık, bir tekli fidan ...)
const TEKLI_LISTE = TEKLI_KEYS.map(k => TEKLI[k]);
const tesisKarisik = [];
for (let i = 0, j = 0; i < FIDAN_SIRALI.length || j < TEKLI_LISTE.length;) {
  if (i < FIDAN_SIRALI.length) tesisKarisik.push(FIDAN_SIRALI[i++]);
  if (i < FIDAN_SIRALI.length) tesisKarisik.push(FIDAN_SIRALI[i++]);
  if (j < TEKLI_LISTE.length) tesisKarisik.push(TEKLI_LISTE[j++]);
}
export const TESIS_FOTOLARI = [...sirala(TESIS).map(k => TESIS[k]), ...tesisKarisik];
export const GALERI_FOTOLARI = karisik;

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
// Gerçek fotoğraf (<slug>-gercek) varsa o, yoksa yapay zekâ görseli (<slug>) kullanılır
const bul = (glob, slug) => { const ks = Object.keys(glob);
  return ks.find(k => new RegExp(`/${slug}-gercek\\.\\w+$`).test(k)) || ks.find(k => new RegExp(`/${slug}\\.\\w+$`).test(k)); };
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
/* Çeşide özel tekli fidan fotoğrafları (ölçü tabelası önünde): src/img/fidan-tekli/<çeşit-slug>-1.webp ...
   Varsa ürün penceresinde önce bunlar gösterilir; Tesislerimiz ve Galeri'de görünmezler. */
const tekliFotolar = slug => TEKLI_KEYS.filter(k => new RegExp(`/${slug}-\\d+\\.\\w+$`).test(k)).map(k => ({ src: TEKLI[k], gercek: true, tekli: true }));

export function fidanGorselleriSirali(f) {
  const tekli = tekliFotolar(f.slug);
  if (tekli.length) return [...tekli, ...fidanGorselleri(catOf(f)).slice(0, 2)];
  const liste = fidanGorselleri(catOf(f));
  const bas = liste.length ? sira(f) % liste.length : 0;
  return [...liste.slice(bas), ...liste.slice(0, bas)].slice(0, 6); // pencerede en fazla 6 fotoğraf
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
/* ---------- Küçük kopyalar (kartlar, küçük resimler) ----------
   src/img/kucuk/ klasöründe her fotoğrafın 600 piksellik kopyası var (npm run kucult ile üretilir).
   Kartlarda küçüğü, büyütünce ve ürün penceresinde asıl fotoğraf kullanılır -> telefonda site çok daha hızlı. */
const KUCUK = import.meta.glob('../img/kucuk/**/*.webp', { eager: true, query: '?url', import: 'default' });
const KMAP = new Map();
for (const glob of [IMAGES, MEYVE, FIDAN, GALERI, TESIS, TEKLI]) {
  for (const [k, url] of Object.entries(glob)) {
    const kk = k.replace('../img/', '../img/kucuk/').replace(/\.\w+$/, '.webp');
    if (KUCUK[kk]) KMAP.set(url, KUCUK[kk]);
  }
}
export const kucuk = src => KMAP.get(src) || src;
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
