/* ==========================================================
   Fidan listesi (yalnızca veri).
   Hem site (js/data.js) hem görsel üretme betiği (scripts/gorsel-uret.mjs) bu dosyayı okur;
   bu yüzden burada Vite'a özel kod olmamalı.
   Türkçe bilgiler burada; İngilizce, Rusça, Arapça karşılıkları js/i18n/ klasöründe (aynı id ile).
   ========================================================== */

/* Kategoriler — Fidanlar sayfasında bu sırayla gösterilir.
   group: ana sayfadaki filtre · tint: kategori kartının zemin rengi
   Kategori fotoğrafı için src/img'ye "kategori-<slug>.jpg" koyman yeterli (ör. kategori-mandalina.jpg). */
export const CATEGORIES = [
  { key: 'Mandalina', slug: 'mandalina', group: 'Turunçgil', tint: '#f8e2c6' },
  { key: 'Portakal', slug: 'portakal', group: 'Turunçgil', tint: '#fad7ae' },
  { key: 'Limon', slug: 'limon', group: 'Turunçgil', tint: '#f4efbd' },
  { key: 'Greyfurt', slug: 'greyfurt', group: 'Turunçgil', tint: '#f6d3c9' },
  { key: 'Zeytin', slug: 'zeytin', group: 'Zeytin', tint: '#e2e7cc' },
  { key: 'Nar', slug: 'nar', group: 'Nar', tint: '#f3cdcd' },
  { key: 'İncir', slug: 'incir', group: 'Meyve', tint: '#e6d9e8' },
  { key: 'Dut', slug: 'dut', group: 'Meyve', tint: '#dfd5ea' },
  { key: 'Kayısı', slug: 'kayisi', group: 'Meyve', tint: '#fadfbf' },
  { key: 'Erik', slug: 'erik', group: 'Meyve', tint: '#e4d8ec' },
  { key: 'Şeftali', slug: 'seftali', group: 'Meyve', tint: '#fbdacc' },
  { key: 'Nektarin', slug: 'nektarin', group: 'Meyve', tint: '#f8d4c6' },
  { key: 'Kiraz', slug: 'kiraz', group: 'Meyve', tint: '#f5cdd1' },
  { key: 'Badem', slug: 'badem', group: 'Meyve', tint: '#ece3d4' },
  { key: 'Ceviz', slug: 'ceviz', group: 'Meyve', tint: '#e8e0d2' },
  { key: 'Trabzon Hurması', slug: 'trabzon-hurmasi', group: 'Meyve', tint: '#f9d8b8' },
  { key: 'Anaç', slug: 'anac', group: 'Meyve', tint: '#e2e7cc' },
];
export const GROUPS = ['Tümü', 'Turunçgil', 'Zeytin', 'Nar', 'Meyve'];

/* Fidanlar — kategori sırasına göre, kategorinin içinde notlardaki sırayla.
   Detaylı olanlar: desc (açıklama) + specs ([başlık, değer] listesi, ürün penceresinde gösterilir).
   Kısa olanlar: yalnızca çeşit adı (name). Bilgisi geldikçe desc ve specs eklenebilir;
   o zaman İngilizce/Rusça/Arapça karşılıklarını da js/i18n/ klasörüne eklemek gerekir. */
export const TUM_FIDANLAR = [
  /* ---------- Mandalina (14) ---------- */
  { id: 101, slug: 'orri-mandarin', name: 'Orri', title: 'Orri Mandarin', category: 'Mandalina' },
  { id: 102, slug: 'primasol-mandarin', name: 'Primasol', title: 'Primasol Mandarin', category: 'Mandalina' },
  { id: 9, slug: 'miho-wase-mandarin', name: 'Miho Wase', title: 'Miho Wase Mandarin', category: 'Mandalina',
    desc: 'En erkenci mandalinalardan biri. Eylülde olgunlaşır; meyveleri çekirdeksiz ve kolay soyulur.',
    specs: [['Olgunlaşma', 'Eylül'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Yassı'], ['Çap', '70–80 mm'], ['Ağırlık', '180–190 g'], ['Kabuk', 'Portakal rengi, hafif pürüzlü'], ['Et', 'Koyu portakal rengi'], ['Kabuk–et bağlılığı', 'Gevşek, kolay soyulur'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%42'], ['Puflaşma', 'Az'], ['Periyodisite', 'Düşük'], ['Anavatan', 'Japonya']] },
  { id: 6, slug: 'okitsu-wase-mandarin', name: 'Okitsu Wase', title: 'Okitsu Wase Mandarin', category: 'Mandalina',
    desc: 'İri, çekirdeksiz ve kolay soyulan erkenci bir mandalina. Ekim ayında hasada gelir.',
    specs: [['Olgunlaşma', 'Ekim'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Yassı'], ['Çap', '70–80 mm'], ['Ağırlık', '180–200 g'], ['Kabuk', 'Turuncu, hafif pürüzlü'], ['Et', 'Koyu turuncu'], ['Kabuk–et bağlılığı', 'Gevşek'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%38'], ['Puflaşma', 'Az'], ['Periyodisite', 'Az'], ['Anavatan', 'Japonya']] },
  { id: 103, slug: 'owari-mandarin', name: 'Owari', title: 'Owari Mandarin', category: 'Mandalina' },
  { id: 8, slug: 'nova-mandarin', name: 'Nova', title: 'Nova Mandarin', category: 'Mandalina',
    desc: 'İri ve bol sulu meyveli bir mandalina. Aralıkta hasat edilir; çekirdek sayısı tozlanmaya göre değişir.',
    specs: [['Olgunlaşma', 'Kasım–Aralık'], ['Hasat', 'Aralık'], ['Meyve şekli', 'Yassı'], ['Çap', '70–90 mm'], ['Ağırlık', '160–180 g'], ['Kabuk', 'Açık turuncu'], ['Et', 'Turuncu, bol sulu'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', '5–20 (döllenmeye bağlı)'], ['Su (usare) oranı', '%39,3'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Çok az'], ['Anavatan', 'ABD']] },
  { id: 7, slug: 'robinson-mandarin', name: 'Robinson', title: 'Robinson Mandarin', category: 'Mandalina',
    desc: 'Sulu etli, koyu turuncu ve hafif basık meyveler verir. Kasımda olgunlaşır, aralıkta hasat edilir.',
    specs: [['Olgunlaşma', 'Kasım'], ['Hasat', 'Aralık'], ['Meyve şekli', 'Yuvarlağa yakın, hafif basık'], ['Çap', '60–70 mm'], ['Ağırlık', '150–160 g'], ['Kabuk', 'Koyu turuncu, hafif kırmızımsı'], ['Et', 'Sulu'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Meyveden meyveye değişir (1–20)'], ['Anavatan', 'ABD']] },
  { id: 3, slug: 'w-murcott-mandarin', name: 'W. Murcott', title: 'W. Murcott Mandarin', category: 'Mandalina',
    desc: 'Geç olgunlaşan, kolay soyulan ve çok sulu bir mandalina. Hasadı mart ayında başlar.',
    specs: [['Çiçeklenme', 'Şubat'], ['Olgunlaşma', 'Şubat–Mart'], ['Hasat', 'Mart'], ['Çap', '55–70 mm'], ['Ağırlık', '120–200 g (ort. 150 g)'], ['Kabuk', 'Koyu portakal rengi'], ['Et', 'Koyu portakal rengi'], ['Kabuk–et bağlılığı', 'Gevşek'], ['Çekirdek', 'Çekirdekli'], ['Su (usare) oranı', '%46,3'], ['Anavatan', 'İspanya']] },
  { id: 5, slug: 'satsuma-mandarin', name: 'Satsuma', title: 'Satsuma Mandarin', category: 'Mandalina',
    desc: 'Çekirdeksiz, kabuğu kolay soyulan erkenci bir mandalina. Meyveleri ekim ortasında olgunlaşır.',
    specs: [['Olgunlaşma', 'Ekim ortası'], ['Meyve şekli', 'Yassı'], ['Çap', '50–60 mm'], ['Ağırlık', '80–100 g'], ['Kabuk', 'Sarımsı turuncu'], ['Et', 'Koyu turuncu'], ['Kabuk–et bağlılığı', 'Gevşek'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%43,9'], ['Puflaşma', 'Yüksek'], ['Anavatan', 'Japonya']] },
  { id: 10, slug: 'dobashi-beni-mandarin', name: 'Dobashi Beni', title: 'Dobashi Beni Mandarin', category: 'Mandalina',
    desc: 'Koyu turuncu, çekirdeksiz ve çok sulu meyveler veren bir mandalina. Ekimde olgunlaşır, kasımda hasat edilir.',
    specs: [['Olgunlaşma', 'Ekim'], ['Hasat', 'Kasım'], ['Meyve şekli', 'Yuvarlak'], ['Çap', '55–70 mm'], ['Ağırlık', '120–200 g'], ['Kabuk', 'Koyu turuncu, pürüzlü'], ['Et', 'Turuncu'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%46,3'], ['Puflaşma', 'Çok az'], ['Periyodisite', 'Az'], ['Anavatan', 'ABD (Kaliforniya)']] },
  { id: 104, slug: 'klemantin-mandarin', name: 'Klemantin', title: 'Klemantin Mandarin', category: 'Mandalina' },
  { id: 105, slug: 'ortanik-mandarin', name: 'Ortanik', title: 'Ortanik Mandarin', category: 'Mandalina' },
  { id: 106, slug: 'mandora-mandarin', name: 'Mandora', title: 'Mandora Mandarin', category: 'Mandalina' },
  { id: 107, slug: 'king-mandarin', name: 'King', title: 'King Mandarin', category: 'Mandalina' },

  /* ---------- Portakal (11) ---------- */
  { id: 15, slug: 'washington-navel-portakal', name: 'Washington Navel', title: 'Washington Navel Portakal', category: 'Portakal',
    desc: 'Tatlı, aromalı ve çekirdeksiz meyveleriyle iç piyasada ve ihracatta en çok aranan sofralık portakallardan.',
    specs: [['Ağaç', 'Orta güçlü, yuvarlak ve orta büyüklükte taç'], ['Olgunlaşma', 'Kasım (orta erkenci)'], ['Hasat', 'Aralık'], ['Meyve şekli', 'Düzgün yuvarlak'], ['Çap', '75–80 mm'], ['Ağırlık', '200–250 g'], ['Kabuk', 'Koyu turuncu'], ['Et', 'Portakal rengi, gevrek'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%33,4'], ['Periyodisite', 'Yok'], ['Kullanım', 'Sofralık, ihracata uygun'], ['Anavatan', 'Brezilya (Bahia)']] },
  { id: 13, slug: 'navelina-portakal', name: 'Navelina', title: 'Navelina Portakal', category: 'Portakal',
    desc: 'Çekirdeksiz, oval ve iri meyveli bir portakal. Ekim sonunda olgunlaşmaya başlar, kasımda hasat edilir.',
    specs: [['Olgunlaşma', 'Ekim sonu–Kasım başı'], ['Hasat', 'Kasım'], ['Meyve şekli', 'Oval'], ['Çap', '90–100 mm'], ['Ağırlık', '200–250 g'], ['Kabuk', 'Koyu portakal rengi'], ['Et', 'Portakal rengi'], ['Kabuk–et bağlılığı', 'Orta'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%43'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Anavatan', 'ABD (Kaliforniya)']] },
  { id: 108, slug: 'cara-cara-portakal', name: 'Cara Cara', title: 'Cara Cara Portakal', category: 'Portakal' },
  { id: 109, slug: 'spring-navel-portakal', name: 'Spring Navel', title: 'Spring Navel Portakal', category: 'Portakal' },
  { id: 110, slug: 'valencia-portakal', name: 'Valencia', title: 'Valencia Portakal', category: 'Portakal' },
  { id: 111, slug: 'thomson-portakal', name: 'Thomson', title: 'Thomson Portakal', category: 'Portakal' },
  { id: 14, slug: 'fukumoto-portakal', name: 'Fukumoto', title: 'Fukumoto Portakal', category: 'Portakal',
    desc: 'Washington\'a benzeyen ama ondan daha erkenci, koyu kırmızımsı renkli bir portakal. Ticari portakallar içinde soğuğa en dayanıklı çeşit.',
    specs: [['Olgunlaşma', 'Çok erkenci'], ['Meyve şekli', 'Yuvarlak–oval, göbekli'], ['Çap', '75–80 mm'], ['Ağırlık', '200–250 g'], ['Kabuk', 'Koyu kırmızımsı portakal, hafif pürüzlü, orta ince'], ['Et', 'Portakal rengi, gevrek'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%33,4'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Soğuğa çok dayanıklı'], ['Anavatan', 'Japonya']] },
  { id: 112, slug: 'lane-late-portakal', name: 'Lane Late', title: 'Lane Late Portakal', category: 'Portakal' },
  { id: 113, slug: 'smith-red-kan-portakali', name: 'Smith Red', title: 'Smith Red Kan Portakalı', category: 'Portakal' },
  { id: 114, slug: 'newhall-portakal', name: 'Newhall', title: 'Newhall Portakal', category: 'Portakal' },
  { id: 115, slug: 'autumn-gold-portakal', name: 'Autumn Gold', title: 'Autumn Gold (Altın Gold) Portakal', category: 'Portakal' },

  /* ---------- Limon (10) ---------- */
  { id: 11, slug: 'kutdiken-limon', name: 'Kütdiken', title: 'Kütdiken Limon', category: 'Limon',
    desc: 'Kirece dayanıklı, kolay çoğalan ve uzun ömürlü bir çeşit. Kasımda olgunlaşan meyveleri şubata kadar toplanabilir.',
    specs: [['Ağaç', 'Kazık kök oluşturmaya uygun, kolay çoğalır, uzun ömürlü'], ['Olgunlaşma', 'Kasım'], ['Hasat', 'Kasım–Şubat'], ['Meyve şekli', 'Elipse yakın, meme kısmı az gelişmiş'], ['Çap', '60–65 mm'], ['Ağırlık', '120–125 g'], ['Kabuk', 'Açık yeşil-sarı, düzgün, parlak'], ['Et', 'Sarı'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Yaklaşık 10'], ['Su (usare) oranı', '%33'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kirece dayanıklı'], ['Anavatan', 'İtalyan Femminello seleksiyonu olduğu düşünülüyor']] },
  { id: 116, slug: 'yediveren-limon', name: 'Yediveren', title: 'Yediveren Limon', category: 'Limon' },
  { id: 117, slug: 'lamas-limon', name: 'Lamas', title: 'Lamas Limon', category: 'Limon' },
  { id: 12, slug: 'meyer-limon', name: 'Meyer', title: 'Meyer Limon', category: 'Limon',
    desc: 'İnce kabuklu, sulu ve az çekirdekli bir limon. Eylülde olgunlaşır, ekimde hasat edilir.',
    specs: [['Ağaç', 'Kazık kök oluşturmaya uygun, kolay çoğalır'], ['Olgunlaşma', 'Eylül'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Hafif basık, yuvarlak'], ['Ağırlık', 'Ort. 120 g'], ['Kabuk', 'Sarı, düz, parlak, ince'], ['Et', 'Açık sarı, gevrek ve sulu'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', '2–3'], ['Su (usare) oranı', '%38,6'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kirece dayanıklı, uzun ömürlü'], ['Anavatan', 'ABD']] },
  { id: 118, slug: 'eureka-limon', name: 'Eureka', title: 'Eureka Limon', category: 'Limon' },
  { id: 119, slug: 'zagara-bianca-limon', name: 'Zagara Bianca', title: 'Zagara Bianca Limon', category: 'Limon' },
  { id: 4, slug: 'interdonato-limon', name: 'Interdonato', title: 'Interdonato Limon', category: 'Limon',
    desc: 'Erkenci, ince kabuklu ve silindirik meyveli bir limon. Eylülde olgunlaşır; Akdeniz bölgesinde sık tercih edilir.',
    specs: [['Ağaç', 'Kazık kök oluşturmaya uygun, kolay çoğalır'], ['Olgunlaşma', 'Eylül'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Uzunca, silindirik'], ['Çap', '55–60 mm'], ['Ağırlık', '105–110 g'], ['Kabuk', 'Açık yeşil, parlak, ince'], ['Et', 'Yeşilimsi sarı'], ['Kabuk–et bağlılığı', 'Orta'], ['Çekirdek', '6–7'], ['Su (usare) oranı', '%31–39'], ['Puflaşma', 'Geç hasatta görülebilir'], ['Dayanıklılık', 'Kirece dayanıklı, uzun ömürlü'], ['Anavatan', 'Nizza ve Sicilya']] },
  { id: 120, slug: 'tatli-limon', name: 'Tatlı', title: 'Tatlı Limon', category: 'Limon' },
  { id: 121, slug: 'misket-limonu', name: 'Misket', title: 'Misket Limonu', category: 'Limon' },
  { id: 122, slug: 'tahiti-lime', name: 'Tahiti', title: 'Tahiti Lime (Misket Limon)', category: 'Limon' },

  /* ---------- Greyfurt (3) ---------- */
  { id: 16, slug: 'rio-red-greyfurt', name: 'Rio Red', title: 'Rio Red Greyfurt', category: 'Greyfurt',
    desc: 'Kabuğu ve eti koyu kırmızı, iri ve sulu meyveler verir. Ocakta olgunlaşır, şubatta hasat edilir.',
    specs: [['Ağaç', 'Aşılı, orta irilikte; limona göre yavaş büyür'], ['Olgunlaşma', 'Ocak'], ['Hasat', 'Şubat'], ['Meyve şekli', 'Yuvarlak ile uzunca arası'], ['Çap', '100–110 mm'], ['Ağırlık', '400–450 g'], ['Kabuk', 'Koyu kırmızı, pürüzsüz'], ['Et', 'Koyu kırmızı'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', '1–3'], ['Su (usare) oranı', '%37'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kuraklığa orta düzeyde dayanır'], ['Toprak', 'Genellikle drenajı zayıf, ağır topraklar'], ['Anavatan', 'ABD']] },
  { id: 17, slug: 'star-ruby-greyfurt', name: 'Star Ruby', title: 'Star Ruby Greyfurt', category: 'Greyfurt',
    desc: 'Kırmızı etli, neredeyse çekirdeksiz ve çok ince kabuklu bir greyfurt; günümüzde en çok dikilen çeşitlerden.',
    specs: [['Ağaç', 'Aşılı, orta irilikte; limona göre yavaş büyür'], ['Olgunlaşma', 'Aralık'], ['Hasat', 'Ocak'], ['Meyve şekli', 'Yuvarlak, hafif basık'], ['Çap', '100–110 mm'], ['Ağırlık', '450–500 g'], ['Kabuk', 'Kırmızımsı, çok ince ve pürüzsüz'], ['Et', 'Kırmızı'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Çekirdeksize yakın'], ['Su (usare) oranı', '%43–67'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kuraklığa dayanıklı değil'], ['Toprak', 'Genellikle drenajı az, ağır topraklar'], ['Anavatan', 'ABD']] },
  { id: 123, slug: 'sadok-pomelo', name: 'Şadok', title: 'Şadok (Pomelo)', category: 'Greyfurt' },

  /* ---------- Zeytin (4) ---------- */
  { id: 19, slug: 'gemlik-zeytin', name: 'Gemlik (Trilye)', title: 'Gemlik (Trilye) Zeytin', category: 'Zeytin',
    desc: 'Hem sofralık hem yağlık değerlendirilen, siyah kabuklu bir Anadolu çeşidi. Dayanıklı ve orta güçte büyür.',
    specs: [['Ağaç', 'Orta güçte, dayanıklı'], ['Hasat', 'Kasım–Ocak'], ['Meyve', 'Orta boy, yuvarlaktan silindiriğe'], ['Kabuk', 'Siyah'], ['Çekirdek', 'Orta iri'], ['Yağ oranı', '≈ %29,9'], ['Kullanım', 'Sofralık ve yağlık'], ['Anavatan', 'Anadolu']] },
  { id: 124, slug: 'arbequina-zeytin', name: 'Arbequina', title: 'Arbequina Zeytin', category: 'Zeytin' },
  { id: 125, slug: 'arbosana-zeytin', name: 'Arbosana', title: 'Arbosana Zeytin', category: 'Zeytin' },
  { id: 126, slug: 'koroneiki-zeytin', name: 'Koroneiki', title: 'Koroneiki Zeytin', category: 'Zeytin' },

  /* ---------- Nar (3) ---------- */
  { id: 20, slug: 'hicaz-nar', name: 'Hicaz', title: 'Hicaz Nar', category: 'Nar',
    desc: 'İri, koyu taneli ve uzun süre saklanabilen bir Anadolu narı. Sofralık tüketime ve nar ekşisine uygundur.',
    specs: [['Ağaç', 'Çok gövdeli, çalı formunda'], ['Olgunlaşma', 'Eylül'], ['Hasat', 'Eylül sonu–Ekim'], ['Meyve şekli', 'Küresel, iri'], ['Ağırlık', 'Ort. 500 g'], ['Kabuk', 'Koyu kırmızı ya da sarı'], ['Tane', 'Pembe, kırmızı, koyu kırmızı ya da mor'], ['Depolama', 'Serin ortamda uzun süre saklanır'], ['Kullanım', 'Sofralık ve nar ekşisi gibi sanayi ürünleri'], ['Anavatan', 'Anadolu']] },
  { id: 21, slug: 'katirbasi-nar', name: 'Katırbaşı', title: 'Katırbaşı Nar', category: 'Nar',
    desc: 'Doğal olarak küçük boylu kalır; sık dikime, kolay hasat ve ilaçlamaya uygundur. İri, lezzetli ve taşımaya dayanıklı meyveler verir.',
    specs: [['Ağaç', 'Doğal olarak küçük boylu; birim alana daha çok fidan dikilir'], ['İlk ürün', 'Dikimden kısa süre sonra'], ['Meyve', 'İri ve çok lezzetli'], ['Kabuk', 'Orta sert, sarı zemin üzerinde kırmızı noktalı'], ['Tane', 'Kırmızı ya da pembe'], ['Depolama', 'Depolama ve taşımaya dayanıklı'], ['Kullanım', 'Sofralık']] },
  { id: 127, slug: 'caner-nar', name: 'Caner', title: 'Caner Nar', category: 'Nar' },

  /* ---------- İncir (3) ---------- */
  { id: 128, slug: 'bursa-siyah-inciri', name: 'Bursa Siyah', title: 'Bursa Siyah İnciri', category: 'İncir' },
  { id: 129, slug: 'sarilop-inciri', name: 'Sarılop', title: 'Sarılop (Aydın İnciri)', category: 'İncir' },
  { id: 130, slug: 'durdane-inciri', name: 'Dürdane', title: 'Dürdane İnciri', category: 'İncir' },

  /* ---------- Dut (5) ---------- */
  { id: 131, slug: 'beyaz-dut', name: 'Beyaz', title: 'Beyaz Dut', category: 'Dut' },
  { id: 132, slug: 'kara-dut', name: 'Kara', title: 'Kara Dut', category: 'Dut' },
  { id: 133, slug: 'kirmizi-dut', name: 'Kırmızı', title: 'Kırmızı Dut', category: 'Dut' },
  { id: 134, slug: 'urmu-dutu', name: 'Urmu', title: 'Urmu Dutu', category: 'Dut' },
  { id: 135, slug: 'avustralya-dutu', name: 'Avustralya', title: 'Avustralya Dutu (Yediveren)', category: 'Dut' },

  /* ---------- Kayısı (7) ---------- */
  { id: 34, slug: 'orange-ruby-kayisi', name: 'Orange Ruby', title: 'Orange Ruby Kayısı', category: 'Kayısı',
    desc: 'Aromalı, çok kaliteli ve gösterişli bir sofralık kayısı. Pazar değeri yüksek olduğu için üreticiler tarafından sık tercih edilir.',
    specs: [['Ağaç', 'Güçlü, dalları yarı dik'], ['Çiçeklenme', 'Orta dönem'], ['Hasat', 'Haziranın 2. haftası'], ['Meyve şekli', 'Oval'], ['İrilik', 'Orta iri–iri'], ['Kabuk', 'Turuncu, güneş gören yüzü parlak kırmızı'], ['Et', 'Turuncu, orta sert'], ['Çekirdek', 'Etten ayrılır, içi tatlı'], ['Tat', 'Çok kaliteli, aromalı'], ['Depolama', 'Uzun süre saklanamaz'], ['Kullanım', 'Sofralık']] },
  { id: 35, slug: 'sekerpare-kayisi', name: 'Şekerpare', title: 'Şekerpare Kayısı', category: 'Kayısı',
    desc: 'Çok tatlı, yüksek kaliteli ve kurutmaya uygun bir Anadolu kayısısı. Tozlayıcıya ihtiyaç duymaz.',
    specs: [['Ağaç', 'Güçlü ve yayvan, verimli (bazı yıllar az verebilir)'], ['Çiçeklenme', 'Orta dönem'], ['Hasat', 'Haziran ortası'], ['Meyve şekli', 'Orta iri, oval, hafif yassı'], ['Kabuk', 'Sarı, güneş gören yüzü kırmızı'], ['Et', 'Sarı, orta sert'], ['Çekirdek', 'Küçük, etten ayrı, içi tatlı'], ['Tat', 'Çok tatlı, yüksek kalite'], ['Depolama', 'Yaş olarak uzun saklanmaz'], ['Kullanım', 'Kurutmaya uygun'], ['Tozlayıcı', 'Gerekmez'], ['Anavatan', 'Anadolu']] },
  { id: 36, slug: 'aurora-kayisi', name: 'Aurora', title: 'Aurora Kayısı', category: 'Kayısı',
    desc: 'Ninfa ile aynı dönemde hasat edilen erkenci bir kayısı. Turuncu, güneşte kızaran meyvelerinin şeker oranı iyidir.',
    specs: [['Ağaç', 'İri, dik büyür'], ['Olgunlaşma', 'Erkenci'], ['Hasat', 'Ninfa ile aynı dönem'], ['Meyve şekli', 'Yassı ve oval'], ['Kabuk', 'Turuncu, güneş gören yüzü kızarır'], ['Tat', 'Şeker oranı iyi']] },
  { id: 136, slug: 'sakit-2-kayisi', name: 'Sakıt 2', title: 'Sakıt 2 Kayısı', category: 'Kayısı' },
  { id: 137, slug: 'malatya-kayisi', name: 'Malatya', title: 'Malatya Kayısı', category: 'Kayısı' },
  { id: 138, slug: 'alyanak-kayisi', name: 'Alyanak', title: 'Alyanak Kayısı', category: 'Kayısı' },
  { id: 33, slug: 'ninfa-kayisi', name: 'Ninfa', title: 'Ninfa Kayısı', category: 'Kayısı',
    desc: 'Mayısta hasada gelen erkenci, iri ve gösterişli bir kayısı. Tozlayıcıya ihtiyaç duymaz, üreticiler tarafından çok tercih edilir.',
    specs: [['Ağaç', 'Yarı kuvvetli, yayvan, çok verimli'], ['Çiçeklenme', 'Erken'], ['Hasat', 'Mayıs sonu (erkenci)'], ['Meyve şekli', 'Yuvarlağa yakın oval'], ['İrilik', 'İri'], ['Kabuk', 'Sarı, güneş gören yüzü hafif kırmızı'], ['Et', 'Sarı, orta sert'], ['Çekirdek', 'Ete yapışık, içi tatlı'], ['Tat', 'Orta tatlı'], ['Depolama', 'Uzun süre depolanmaz'], ['Tozlayıcı', 'Gerekmez'], ['Kullanım', 'Sofralık']] },

  /* ---------- Erik (10) ---------- */
  { id: 27, slug: 'can-erik', name: 'Can', title: 'Can Erik', category: 'Erik',
    desc: 'Yeşil tüketim için toplanan, sert, gevrek ve mayhoş bir erik. Öne çıkan özelliği yüksek verimi.',
    specs: [['Diğer adları', 'İstanbul Papazı, Yalova'], ['Ağaç', 'Kuvvetli, yayvan, çok dallı, çok verimli'], ['Çiçeklenme', 'Mart sonu'], ['Hasat', 'Mayıs başı'], ['Meyve şekli', 'Yuvarlak, simetrik, karın çizgisi belirgin'], ['Ağırlık', 'Ort. 15–20 g'], ['Kabuk', 'Açık yeşil, ince'], ['Et', 'Açık yeşil, ince dokulu'], ['Çekirdek', 'Ete bağlı'], ['Tat', 'Sert, gevrek, sulu, mayhoş'], ['Depolama', 'Uzun süre depolamaya uygun değil'], ['Tozlayıcı', 'Kendine verimli'], ['Kullanım', 'Yeşil tüketim'], ['Anavatan', 'Anadolu']] },
  { id: 28, slug: 'black-amber-erik', name: 'Black Amber', title: 'Black Amber Japon Erik', category: 'Erik',
    desc: 'Orta erkenci, siyaha yakın mor kabuklu ve sarı etli bir Japon eriği. Sert, gevrek ve lezzetli; taşımaya elverişli.',
    specs: [['Ağaç', 'Yarı kuvvetli, dik, verimli, orta dallı'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Haziran sonu–Temmuz başı'], ['Meyve şekli', 'Yuvarlak, simetrik'], ['İrilik', 'Orta iri'], ['Kabuk', 'Siyaha yakın mor, üzeri küllü'], ['Et', 'Sarı'], ['Çekirdek', 'Küçük, ete bağlı'], ['Tat', 'Sert, gevrek, orta sulu, lezzetli'], ['Depolama', 'Depolama ve taşımaya elverişli'], ['Tozlayıcı', 'Santa Rosa, Black Diamond'], ['Anavatan', 'Kaliforniya']] },
  { id: 29, slug: 'black-splendor-erik', name: 'Black Splendor', title: 'Black Splendor Japon Erik', category: 'Erik',
    desc: 'Siyaha yakın mor kabuklu, parlak kırmızı etli ve çok beğenilen bir Japon eriği. Depolama ve taşımaya elverişlidir.',
    specs: [['Ağaç', 'Orta güçte, dik, verimli'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Haziran ortası'], ['Meyve şekli', 'Yuvarlak, simetrik, hafif basık'], ['İrilik', 'İriye yakın'], ['Kabuk', 'Siyaha yakın mor, üzeri küllü'], ['Et', 'Parlak kırmızı'], ['Çekirdek', 'Ete bağlı'], ['Tat', 'Sert, gevrek, sulu; olgunlaştıkça lezzetlenir'], ['Depolama', 'Depolama ve taşımaya elverişli'], ['Tozlayıcı', 'Santa Rosa, Pioneer'], ['Anavatan', 'Kaliforniya']] },
  { id: 30, slug: 'papaz-erik', name: 'Papaz', title: 'Papaz Erik', category: 'Erik',
    desc: 'Yerli ve en meşhur yeşil eriklerden. Ekşimsi, kendine has aromalı, gevrek ve çok sulu meyveler verir.',
    specs: [['Ağaç', 'Kuvvetli, yayvan, çok dallı'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Nisan sonu–Mayıs başı'], ['Meyve şekli', 'Yuvarlak, karın çizgisi belirgin'], ['Ağırlık', 'Ort. 25–30 g'], ['Kabuk', 'Parlak koyu yeşil, ince'], ['Et', 'Yeşil, çok sulu'], ['Çekirdek', 'Ete bağlı'], ['Tat', 'Ekşimsi, kendine has aroma, gevrek'], ['Depolama', 'Depolanmaz'], ['Tozlayıcı', 'Bekiroğlu (Havran), Kebap, Can, Aynalı'], ['Kullanım', 'Sofralık'], ['Anavatan', 'Anadolu']] },
  { id: 31, slug: 'red-beauty-erik', name: 'Red Beauty', title: 'Red Beauty Japon Erik', category: 'Erik',
    desc: 'Japon erikleri içinde en erken olgunlaşan çeşit. Kırmızı kabuklu, sarı ve sert etli, raf ömrü uzun meyveler verir.',
    specs: [['Hasat', 'Mayısın 2. haftasından itibaren'], ['Meyve şekli', 'Yuvarlak, ucu hafif sivri'], ['Kabuk', 'Kırmızı'], ['Et', 'Sarı, sert'], ['Depolama', 'Raf ömrü uzun'], ['Öne çıkan', 'Japon erikleri içinde en erkencisi'], ['Anavatan', 'Kaliforniya (ABD)']] },
  { id: 32, slug: 'black-star-erik', name: 'Black Star', title: 'Black Star Japon Erik', category: 'Erik',
    desc: 'Kuvvetli gelişen, verimli bir Japon eriği. Siyaha yakın mor kabuklu, sarı etli, kaliteli ve taşımaya elverişli meyveler verir.',
    specs: [['Ağaç', 'Kuvvetli, dik, verimli'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Haziran sonu'], ['Meyve şekli', 'Yuvarlağa yakın, üstü hafif konik'], ['İrilik', 'Orta iri–iri'], ['Kabuk', 'Siyaha yakın mor, üzeri küllü'], ['Et', 'Sarı'], ['Çekirdek', 'Küçük, ete yarı bağlı'], ['Tat', 'Sert, gevrek, orta sulu, kaliteli'], ['Depolama', 'Depolama ve taşımaya elverişli'], ['Tozlayıcı', 'Santa Rosa'], ['Anavatan', 'ABD']] },
  { id: 139, slug: 'santa-rosa-erik', name: 'Santa Rosa', title: 'Santa Rosa Japon Erik', category: 'Erik', noun: 'Japon Erik' },
  { id: 140, slug: 'black-diamond-erik', name: 'Black Diamond', title: 'Black Diamond Japon Erik', category: 'Erik', noun: 'Japon Erik' },
  { id: 141, slug: 'angeleno-erik', name: 'Angeleno', title: 'Angeleno Japon Erik', category: 'Erik', noun: 'Japon Erik' },
  { id: 142, slug: 'larry-ann-erik', name: 'Larry Ann', title: 'Larry Ann Japon Erik', category: 'Erik', noun: 'Japon Erik' },

  /* ---------- Şeftali (8) ---------- */
  { id: 143, slug: 'vistarich-seftali', name: 'Vistarich', title: 'Vistarich Şeftali', category: 'Şeftali' },
  { id: 144, slug: 'plagold-25-seftali', name: 'Plagold 25', title: 'Plagold 25 Şeftali', category: 'Şeftali' },
  { id: 145, slug: 'cresthaven-seftali', name: 'Cresthaven', title: 'Cresthaven Şeftali', category: 'Şeftali' },
  { id: 146, slug: 'royal-glory-seftali', name: 'Royal Glory', title: 'Royal Glory Şeftali', category: 'Şeftali' },
  { id: 147, slug: 'bursa-seftalisi', name: 'Bursa', title: 'Bursa Şeftalisi', category: 'Şeftali' },
  { id: 148, slug: 'elegant-lady-seftali', name: 'Elegant Lady', title: 'Elegant Lady Şeftali', category: 'Şeftali' },
  { id: 149, slug: 'dixired-seftali', name: 'Dixired', title: 'Dixired Şeftali', category: 'Şeftali' },
  { id: 150, slug: 'redhaven-seftali', name: 'Redhaven', title: 'Redhaven Şeftali', category: 'Şeftali' },

  /* ---------- Nektarin (4) ---------- */
  { id: 151, slug: 'big-bang-nektarin', name: 'Big Bang', title: 'Big Bang Nektarin', category: 'Nektarin' },
  { id: 152, slug: 'big-top-nektarin', name: 'Big Top', title: 'Big Top Nektarin', category: 'Nektarin' },
  { id: 153, slug: 'venus-nektarin', name: 'Venüs', title: 'Venüs Nektarin', category: 'Nektarin' },
  { id: 154, slug: 'sweet-lady-nektarin', name: 'Sweet Lady', title: 'Sweet Lady Nektarin', category: 'Nektarin' },

  /* ---------- Kiraz (6) ---------- */
  { id: 155, slug: 'ziraat-0900-kiraz', name: 'Ziraat 0900', title: 'Ziraat 0900 Kiraz', category: 'Kiraz' },
  { id: 156, slug: 'regina-kiraz', name: 'Regina', title: 'Regina Kiraz', category: 'Kiraz' },
  { id: 157, slug: 'napolyon-kiraz', name: 'Napolyon', title: 'Napolyon Kiraz', category: 'Kiraz' },
  { id: 158, slug: 'starks-gold-kiraz', name: 'Starks Gold', title: 'Starks Gold Kiraz', category: 'Kiraz' },
  { id: 159, slug: 'sweetheart-kiraz', name: 'Sweetheart', title: 'Sweetheart Kiraz', category: 'Kiraz' },
  { id: 160, slug: 'kordia-kiraz', name: 'Kordia', title: 'Kordia Kiraz', category: 'Kiraz' },

  /* ---------- Badem (5) ---------- */
  { id: 22, slug: 'ferragnes-badem', name: 'Ferragnes', title: 'Ferragnes Badem', category: 'Badem',
    desc: 'Geç çiçeklenmesi ve bol ürünüyle yaygın tercih edilen, kuvvetli ve dayanıklı bir badem. Bakımı ve sulaması kolaydır.',
    specs: [['Ağaç', 'Kuvvetli, yarı dik, çok verimli'], ['Çiçeklenme', 'Geç'], ['Meyve şekli', 'Uzun, oval'], ['İrilik', 'İri, doyurucu'], ['Kabuk', 'Kahverengi'], ['İç', 'Koyu kahverengi'], ['İkiz meyve', '≈ %2'], ['Depolama', 'Çok uzun süre dayanır'], ['Tozlayıcı', 'Ferraduel'], ['Kullanım', 'Yağ üretimine uygun'], ['Dayanıklılık', 'Kuru ortamlarda da yetişir'], ['Anavatan', 'Fransa']] },
  { id: 23, slug: 'texas-badem', name: 'Texas', title: 'Texas Badem', category: 'Badem',
    desc: 'Güçlü ve verimli, sert kabuklu bir diş bademi. Meyveleri çok uzun süre depolanabilir, iç randımanı yaklaşık %45.',
    specs: [['Ağaç', 'Güçlü, verimli, yarı dik'], ['Çiçeklenme', 'Orta–geç'], ['Hasat', 'Temmuz ortası'], ['Meyve şekli', 'Uzun, oval'], ['İrilik', 'Orta'], ['Kabuk', 'Kahverengi, sert (diş bademi)'], ['İç', 'Koyu kahverengi'], ['İç randımanı', '≈ %45'], ['İkiz meyve', '≈ %15'], ['Depolama', 'Çok uzun süre'], ['Tozlayıcı', 'Marcona'], ['Anavatan', 'ABD']] },
  { id: 24, slug: 'ferraduel-badem', name: 'Ferraduel', title: 'Ferraduel Badem', category: 'Badem',
    desc: 'Erken yaşta meyveye yatan, iri taneli ve çok kaliteli bir badem. Üreticilerin en çok tercih ettiği çeşitlerden.',
    specs: [['Ağaç', 'Kuvvetli, yarı dik, çok verimli'], ['Çiçeklenme', 'Geç'], ['İlk ürün', 'Erken yaşta'], ['Meyve şekli', 'Uzun, oval'], ['İrilik', 'İri'], ['Kabuk', 'Kahverengi'], ['İç', 'Koyu kahverengi'], ['İç randımanı', '%30–35'], ['İkiz meyve', '%2'], ['Depolama', 'Çok uzun süre saklanır'], ['Tozlayıcı', 'Ferragnes'], ['Kullanım', 'Sofralık ve yağlık'], ['Dayanıklılık', 'Kuru ortamda yetişir, suya az ihtiyaç duyar'], ['Anavatan', 'Fransa']] },
  { id: 161, slug: 'nonpareil-badem', name: 'Nonpareil', title: 'Nonpareil Badem', category: 'Badem' },
  { id: 162, slug: 'lauranne-badem', name: 'Lauranne', title: 'Lauranne Badem', category: 'Badem' },

  /* ---------- Ceviz (7) ---------- */
  { id: 163, slug: 'chandler-ceviz', name: 'Chandler', title: 'Chandler Ceviz', category: 'Ceviz' },
  { id: 164, slug: 'fernor-ceviz', name: 'Fernor', title: 'Fernor Ceviz', category: 'Ceviz' },
  { id: 165, slug: 'pedro-ceviz', name: 'Pedro', title: 'Pedro Ceviz', category: 'Ceviz' },
  { id: 166, slug: 'sebin-ceviz', name: 'Şebin', title: 'Şebin Ceviz', category: 'Ceviz' },
  { id: 167, slug: 'bilecik-ceviz', name: 'Bilecik', title: 'Bilecik Ceviz', category: 'Ceviz' },
  { id: 168, slug: 'franquette-ceviz', name: 'Franquette', title: 'Franquette Ceviz', category: 'Ceviz' },
  { id: 169, slug: 'fernette-ceviz', name: 'Fernette', title: 'Fernette Ceviz', category: 'Ceviz' },

  /* ---------- Trabzon Hurması (4) ---------- */
  { id: 25, slug: 'fuyu-trabzon-hurmasi', name: 'Fuyu', title: 'Fuyu Trabzon Hurması', category: 'Trabzon Hurması',
    desc: 'Buruk olmayan, C ve A vitamini bakımından zengin iri meyveler verir. Kendine verimlidir, tozlayıcı istemez.',
    specs: [['Ağaç', 'Güçlü, hızlı büyür'], ['Çiçeklenme', 'Nisan'], ['Hasat', 'Ekim sonu'], ['Meyve şekli', 'Yassı yuvarlak, köşeli olabilir'], ['Ağırlık', 'Ort. 200 g'], ['Kabuk', 'Turuncu-kırmızı, sert ve parlak'], ['Et', 'Açık sarı-turuncu'], ['Tat', 'Buruk değil'], ['Besin değeri', 'C ve A vitamini bakımından zengin'], ['Tozlayıcı', 'Kendine verimli'], ['Anavatan', 'Çin']] },
  { id: 26, slug: 'hachiya-trabzon-hurmasi', name: 'Hachiya', title: 'Hachiya Trabzon Hurması', category: 'Trabzon Hurması',
    desc: '"Cennet hurması" olarak da bilinen, çok iri ve gösterişli meyveli bir çeşit. Meyvesi iyice yumuşayınca yenir.',
    specs: [['Diğer adı', 'Cennet hurması'], ['Ağaç', 'Kuvvetli gelişir'], ['Verime başlama', '4 yaşından sonra'], ['Hasat', 'Ekim'], ['Meyve', 'Çok iri, gösterişli'], ['Kabuk', 'Turuncu, kırmızımsı tonlu'], ['Et', 'Turuncu'], ['Tat', 'Sertken buruk, iyice yumuşayınca yenir'], ['Tozlayıcı', 'Kendine verimli (tozlanmazsa çekirdeksiz)'], ['Depolama', 'Soğuk depoda yaklaşık 1 ay']] },
  { id: 170, slug: 'rojo-brillante-trabzon-hurmasi', name: 'Rojo Brillante', title: 'Rojo Brillante Trabzon Hurması', category: 'Trabzon Hurması' },
  { id: 171, slug: 'hana-fuyu-trabzon-hurmasi', name: 'Hana Fuyu', title: 'Hana Fuyu Trabzon Hurması', category: 'Trabzon Hurması' },

  /* ---------- Listede olmayanlar: sitede gizli (göstermek için hidden: true satırını sil) ---------- */
  { id: 18, slug: 'nizip-zeytin', name: 'Nizip', title: 'Nizip Zeytin', category: 'Zeytin', hidden: true,
    desc: 'Adaptasyon yeteneği yüksek, yağ bakımından zengin bir çeşit. Dikimden sonraki ikinci yılda meyveye yatar.',
    specs: [['Ağaç', 'Gövdesi geniş ve kıvrımlı; yaşlandıkça gri kabuğu çatlar, tacı her yıl genişler'], ['İlk ürün', 'Dikimden sonraki 2. yıl'], ['En verimli dönem', '4. yıl'], ['Yağ', 'Yağ bakımından zengin'], ['Uyum', 'Adaptasyon yeteneği yüksek']] },
  { id: 37, slug: 'myrobolan-anac', name: 'Myrobolan B / GF31', title: 'Myrobolan B / GF31 Anaç', category: 'Anaç', hidden: true,
    desc: 'Erik yetiştiriciliğinde en yaygın kullanılan anaçlardan. Geniş taç oluşturur, ağır topraklar dahil farklı topraklarda kullanılabilir.',
    specs: [['Kullanım', 'Erik yetiştiriciliği (Can grubu erikleriyle aynı tür)'], ['Kuvvet', 'Güçlü, geniş taç'], ['Toprak', 'Ağır topraklar dahil farklı toprak tipleri'], ['Alternatif', 'Myrobolan 29-C: yarı bodur, ağaçlar yaklaşık %70–80 boyutta'], ['29-C kök yapısı', 'Orta derinlikte'], ['29-C hassasiyet', 'Bakteriyel kanser ve meşe kök mantarına hassas'], ['29-C dikim aralığı', 'Sıra üzeri 3–3,5 m, sıra arası 4,5–5 m'], ['Diğer anaçlar', 'Kayısı çöğürü de temin edilir']] },
];
