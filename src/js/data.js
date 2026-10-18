/* ==========================================================
   Firma bilgileri, fidan listesi ve görseller.
   Fiyat, açıklama, iletişim değiştirmek için yalnızca bu dosyayı düzenle.
   Fidan bilgileri sagfidancilik.com ürün sayfalarından alınmıştır.
   ========================================================== */

export const SITE = {
  name: 'Sağ Fidancılık',
  whatsapp: '905345749021', // Siparişlerin gideceği WhatsApp numarası (ülke koduyla, + olmadan)
};

/* src/img klasöründeki fotoğrafları Vite kendisi bulur.
   Ürün fotoğrafını slug adıyla koyman yeterli: washington-portakal.jpg, gemlik-zeytin.png ...
   Fotoğrafı olmayan fidanda pot-plant.png gösterilir. */
const IMAGES = import.meta.glob('../img/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const FALLBACK = IMAGES['../img/pot-plant.png'] || '';

export function imgFor(slug) {
  if (!slug) return FALLBACK;
  const key = Object.keys(IMAGES).find(k => new RegExp(`/${slug}\\.(jpe?g|png|webp|avif)$`, 'i').test(k));
  return key ? IMAGES[key] : FALLBACK;
}

/* group: filtre çiplerinde kullanılır, category: kartın üstündeki etiket.
   facts: ürün penceresindeki 3 kutu -> [ikon, başlık, değer]
   price: ÖRNEK fiyatlardır (TL / adet), gerçek fiyatlarla değiştir. */
export const FIDANLAR = [
  { id: 15, slug: 'washington-portakal', title: 'Washington Portakal', variety: 'Portakal fidanı', category: 'Portakal', group: 'Turunçgil', price: 180,
    desc: 'Tatlı, aromalı ve çekirdeksiz meyveleriyle sofralık portakalların en çok aranan çeşitlerinden. Orta güçlü, yuvarlak taçlı ağaçları iyi gelişir.',
    facts: [['calendar', 'Olgunlaşma', 'Kasım'], ['scale', 'Meyve', '200–250 g'], ['pin', 'Anavatan', 'Brezilya']] },
  { id: 7, slug: 'robinson-mandarin', title: 'Robinson Mandarin', variety: 'Mandalina fidanı', category: 'Mandalina', group: 'Turunçgil', price: 180,
    desc: 'Sulu etli, koyu turuncu ve hafif basık meyveler verir. Kasımda olgunlaşır, aralıkta hasat edilir.',
    facts: [['calendar', 'Olgunlaşma', 'Kasım'], ['scale', 'Meyve', '150–160 g'], ['pin', 'Anavatan', 'ABD']] },
  { id: 5, slug: 'satsuma-mandarin', title: 'Satsuma Mandarin', variety: 'Mandalina fidanı', category: 'Mandalina', group: 'Turunçgil', price: 170,
    desc: 'Çekirdeksiz, kabuğu kolay soyulan erkenci bir mandalina. Meyveleri ekim ortasında olgunlaşır.',
    facts: [['calendar', 'Olgunlaşma', 'Ekim ortası'], ['scale', 'Meyve', '80–100 g'], ['pin', 'Anavatan', 'Japonya']] },
  { id: 11, slug: 'kutdiken-limon', title: 'Kütdiken Limon', variety: 'Yediveren limon fidanı', category: 'Limon', group: 'Turunçgil', price: 200,
    desc: 'Kirece dayanıklı, kolay çoğalan ve uzun ömürlü bir çeşit. Kasımda olgunlaşan meyveleri şubata kadar toplanabilir.',
    facts: [['calendar', 'Hasat', 'Kasım–Şubat'], ['scale', 'Meyve', '120–125 g'], ['droplet', 'Su oranı', '≈ %33']] },
  { id: 16, slug: 'rio-red-greyfurt', title: 'Rio Red Greyfurt', variety: 'Greyfurt fidanı', category: 'Greyfurt', group: 'Turunçgil', price: 190,
    desc: 'Kabuğu ve eti koyu kırmızı, iri ve sulu meyveler verir. Ocakta olgunlaşır, şubatta hasat edilir.',
    facts: [['calendar', 'Olgunlaşma', 'Ocak'], ['scale', 'Meyve', '400–450 g'], ['pin', 'Anavatan', 'ABD']] },
  { id: 19, slug: 'gemlik-zeytin', title: 'Gemlik Zeytin', variety: 'Zeytin fidanı', category: 'Zeytin', group: 'Zeytin', price: 120,
    desc: 'Hem sofralık hem yağlık değerlendirilen, siyah kabuklu bir Anadolu çeşidi. Dayanıklı ve orta güçte büyür.',
    facts: [['calendar', 'Hasat', 'Kasım–Ocak'], ['droplet', 'Yağ oranı', '≈ %30'], ['pin', 'Anavatan', 'Anadolu']] },
  { id: 18, slug: 'nizip-zeytin', title: 'Nizip Zeytin', variety: 'Zeytin fidanı', category: 'Zeytin', group: 'Zeytin', price: 120,
    desc: 'Adaptasyon yeteneği yüksek, yağ bakımından zengin bir çeşit. Dikimden sonraki ikinci yılda meyveye yatar.',
    facts: [['sprout', 'İlk ürün', '2. yıl'], ['tree', 'En verimli', '4. yıl'], ['droplet', 'Yağ', 'Bol']] },
  { id: 20, slug: 'hicaz-nar', title: 'Hicaz Nar', variety: 'Nar fidanı', category: 'Nar', group: 'Nar', price: 110,
    desc: 'İri, koyu taneli ve uzun süre saklanabilen bir Anadolu narı. Sofralık tüketime ve nar ekşisine uygundur.',
    facts: [['calendar', 'Hasat', 'Eylül sonu–Ekim'], ['scale', 'Meyve', '≈ 500 g'], ['pin', 'Anavatan', 'Anadolu']] },
  { id: 21, slug: 'katirbasi-nar', title: 'Katırbaşı Nar', variety: 'Nar fidanı', category: 'Nar', group: 'Nar', price: 110,
    desc: 'Doğal olarak küçük boylu kalır; sık dikime, kolay hasat ve ilaçlamaya uygundur. İri, lezzetli ve taşımaya dayanıklı meyveler verir.',
    facts: [['tree', 'Ağaç', 'Küçük boylu'], ['droplet', 'Tane', 'Kırmızı / pembe'], ['box', 'Kullanım', 'Sofralık']] },
  { id: 35, slug: 'sekerpare-kayisi', title: 'Şekerpare Kayısı', variety: 'Kayısı fidanı', category: 'Kayısı', group: 'Meyve', price: 140,
    desc: 'Çok tatlı, yüksek kaliteli ve kurutmaya uygun bir Anadolu kayısısı. Tozlayıcıya ihtiyaç duymaz.',
    facts: [['calendar', 'Hasat', 'Haziran ortası'], ['sprout', 'Tozlayıcı', 'Gerekmez'], ['pin', 'Anavatan', 'Anadolu']] },
  { id: 23, slug: 'texas-badem', title: 'Texas Badem', variety: 'Badem fidanı', category: 'Badem', group: 'Meyve', price: 150,
    desc: 'Güçlü ve verimli, sert kabuklu bir badem. Meyveleri uzun süre depolanabilir, iç randımanı yaklaşık %45.',
    facts: [['calendar', 'Hasat', 'Temmuz ortası'], ['sprout', 'Tozlayıcı', 'Marcona'], ['pin', 'Anavatan', 'ABD']] },
  { id: 25, slug: 'fuyu-trabzon-hurmasi', title: 'Fuyu Trabzon Hurması', variety: 'Trabzon hurması fidanı', category: 'Trabzon Hurması', group: 'Meyve', price: 160,
    desc: 'Buruk olmayan, C ve A vitamini bakımından zengin iri meyveler verir. Kendine verimlidir, tozlayıcı istemez.',
    facts: [['calendar', 'Hasat', 'Ekim sonu'], ['scale', 'Meyve', '≈ 200 g'], ['pin', 'Anavatan', 'Çin']] },
  { id: 31, slug: 'red-beauty-erik', title: 'Red Beauty Erik', variety: 'Japon erik fidanı', category: 'Erik', group: 'Meyve', price: 130,
    desc: 'Japon erikleri içinde en erken olgunlaşan çeşit. Kırmızı kabuklu, sarı ve sert etli, raf ömrü uzun meyveler verir.',
    facts: [['calendar', 'Hasat', 'Mayıs ortası'], ['droplet', 'Et', 'Sarı, sert'], ['pin', 'Anavatan', 'Kaliforniya']] },
];

export const CATEGORIES = ['Tümü', 'Turunçgil', 'Zeytin', 'Nar', 'Meyve'];

export const byId = id => FIDANLAR.find(f => f.id === Number(id));
export const fullName = f => `${f.title} Fidanı`;
