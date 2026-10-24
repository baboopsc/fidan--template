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

export const FIDANLAR = TUM_FIDANLAR.filter(f => !f.hidden);
export const catOf = f => CATEGORIES.find(c => c.key === f.category);

/* Fidan görseli: önce çeşidin kendi görseli (washington-navel-portakal.webp),
   yoksa kategorisinin görseli (kategori-portakal.webp), o da yoksa saksı görseli. */
export function fidanImg(f) {
  const kendi = imgFor(f.slug);
  return kendi !== FALLBACK ? kendi : imgFor(`kategori-${catOf(f)?.slug}`);
}
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
