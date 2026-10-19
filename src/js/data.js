/* ==========================================================
   Firma bilgileri ve fidan listesi.
   Türkçe fidan bilgileri burada; İngilizce ve Rusça karşılıkları js/i18n/en.js ve ru.js'te
   (aynı id ile). Fidan bilgileri sagfidancilik.com ürün sayfalarından alınmıştır.
   ========================================================== */

export const SITE = {
  name: 'Sağ Fidancılık',
  phone: { name: 'Ali Sağ', tel: '+905336125225', label: '0533 612 52 25' },
  // Sosyal medya: tam bağlantıyı yaz (ör. 'https://www.instagram.com/kullaniciadi').
  // Boş bırakılırsa sitede o buton gizlenir.
  instagram: 'https://www.instagram.com/ali_alisag/',
  facebook: 'https://www.facebook.com/sag.fidanc.l.k/',
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

/* category: kartın üstündeki etiket ve Fidanlar sayfasındaki filtre
   group: ana sayfadaki filtre
   specs: ürün penceresindeki tüm özellikler -> [başlık, değer] (sırası korunur) */
export const FIDANLAR = [
  /* ---------- Mandalina ---------- */
  { id: 9, slug: 'miho-wase-mandarin', title: 'Miho Wase Mandarin', category: 'Mandalina', group: 'Turunçgil',
    desc: 'En erkenci mandalinalardan biri. Eylülde olgunlaşır; meyveleri çekirdeksiz ve kolay soyulur.',
    specs: [['Olgunlaşma', 'Eylül'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Yassı'], ['Çap', '70–80 mm'], ['Ağırlık', '180–190 g'], ['Kabuk', 'Portakal rengi, hafif pürüzlü'], ['Et', 'Koyu portakal rengi'], ['Kabuk–et bağlılığı', 'Gevşek, kolay soyulur'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%42'], ['Puflaşma', 'Az'], ['Periyodisite', 'Düşük'], ['Anavatan', 'Japonya']] },
  { id: 5, slug: 'satsuma-mandarin', title: 'Satsuma Mandarin', category: 'Mandalina', group: 'Turunçgil',
    desc: 'Çekirdeksiz, kabuğu kolay soyulan erkenci bir mandalina. Meyveleri ekim ortasında olgunlaşır.',
    specs: [['Olgunlaşma', 'Ekim ortası'], ['Meyve şekli', 'Yassı'], ['Çap', '50–60 mm'], ['Ağırlık', '80–100 g'], ['Kabuk', 'Sarımsı turuncu'], ['Et', 'Koyu turuncu'], ['Kabuk–et bağlılığı', 'Gevşek'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%43,9'], ['Puflaşma', 'Yüksek'], ['Anavatan', 'Japonya']] },
  { id: 6, slug: 'okitsu-mandarin', title: 'Okitsu Mandarin', category: 'Mandalina', group: 'Turunçgil',
    desc: 'İri, çekirdeksiz ve kolay soyulan erkenci bir mandalina. Ekim ayında hasada gelir.',
    specs: [['Olgunlaşma', 'Ekim'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Yassı'], ['Çap', '70–80 mm'], ['Ağırlık', '180–200 g'], ['Kabuk', 'Turuncu, hafif pürüzlü'], ['Et', 'Koyu turuncu'], ['Kabuk–et bağlılığı', 'Gevşek'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%38'], ['Puflaşma', 'Az'], ['Periyodisite', 'Az'], ['Anavatan', 'Japonya']] },
  { id: 10, slug: 'dobashi-beni-mandarin', title: 'Dobashi Beni Mandarin', category: 'Mandalina', group: 'Turunçgil',
    desc: 'Koyu turuncu, çekirdeksiz ve çok sulu meyveler veren bir mandalina. Ekimde olgunlaşır, kasımda hasat edilir.',
    specs: [['Olgunlaşma', 'Ekim'], ['Hasat', 'Kasım'], ['Meyve şekli', 'Yuvarlak'], ['Çap', '55–70 mm'], ['Ağırlık', '120–200 g'], ['Kabuk', 'Koyu turuncu, pürüzlü'], ['Et', 'Turuncu'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%46,3'], ['Puflaşma', 'Çok az'], ['Periyodisite', 'Az'], ['Anavatan', 'ABD (Kaliforniya)']] },
  { id: 7, slug: 'robinson-mandarin', title: 'Robinson Mandarin', category: 'Mandalina', group: 'Turunçgil',
    desc: 'Sulu etli, koyu turuncu ve hafif basık meyveler verir. Kasımda olgunlaşır, aralıkta hasat edilir.',
    specs: [['Olgunlaşma', 'Kasım'], ['Hasat', 'Aralık'], ['Meyve şekli', 'Yuvarlağa yakın, hafif basık'], ['Çap', '60–70 mm'], ['Ağırlık', '150–160 g'], ['Kabuk', 'Koyu turuncu, hafif kırmızımsı'], ['Et', 'Sulu'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Meyveden meyveye değişir (1–20)'], ['Anavatan', 'ABD']] },
  { id: 8, slug: 'nova-mandarin', title: 'Nova Mandarin', category: 'Mandalina', group: 'Turunçgil',
    desc: 'İri ve bol sulu meyveli bir mandalina. Aralıkta hasat edilir; çekirdek sayısı tozlanmaya göre değişir.',
    specs: [['Olgunlaşma', 'Kasım–Aralık'], ['Hasat', 'Aralık'], ['Meyve şekli', 'Yassı'], ['Çap', '70–90 mm'], ['Ağırlık', '160–180 g'], ['Kabuk', 'Açık turuncu'], ['Et', 'Turuncu, bol sulu'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', '5–20 (döllenmeye bağlı)'], ['Su (usare) oranı', '%39,3'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Çok az'], ['Anavatan', 'ABD']] },
  { id: 3, slug: 'w-murcott-mandarin', title: 'W.Murcott Mandarin', category: 'Mandalina', group: 'Turunçgil',
    desc: 'Geç olgunlaşan, kolay soyulan ve çok sulu bir mandalina. Hasadı mart ayında başlar.',
    specs: [['Çiçeklenme', 'Şubat'], ['Olgunlaşma', 'Şubat–Mart'], ['Hasat', 'Mart'], ['Çap', '55–70 mm'], ['Ağırlık', '120–200 g (ort. 150 g)'], ['Kabuk', 'Koyu portakal rengi'], ['Et', 'Koyu portakal rengi'], ['Kabuk–et bağlılığı', 'Gevşek'], ['Çekirdek', 'Çekirdekli'], ['Su (usare) oranı', '%46,3'], ['Anavatan', 'İspanya']] },

  /* ---------- Portakal ---------- */
  { id: 14, slug: 'fukumoto-portakal', title: 'Fukumoto Portakal', category: 'Portakal', group: 'Turunçgil',
    desc: 'Washington\'a benzeyen ama ondan daha erkenci, koyu kırmızımsı renkli bir portakal. Ticari portakallar içinde soğuğa en dayanıklı çeşit.',
    specs: [['Olgunlaşma', 'Çok erkenci'], ['Meyve şekli', 'Yuvarlak–oval, göbekli'], ['Çap', '75–80 mm'], ['Ağırlık', '200–250 g'], ['Kabuk', 'Koyu kırmızımsı portakal, hafif pürüzlü, orta ince'], ['Et', 'Portakal rengi, gevrek'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%33,4'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Soğuğa çok dayanıklı'], ['Anavatan', 'Japonya']] },
  { id: 13, slug: 'navelina-portakal', title: 'Navelina Portakal', category: 'Portakal', group: 'Turunçgil',
    desc: 'Çekirdeksiz, oval ve iri meyveli bir portakal. Ekim sonunda olgunlaşmaya başlar, kasımda hasat edilir.',
    specs: [['Olgunlaşma', 'Ekim sonu–Kasım başı'], ['Hasat', 'Kasım'], ['Meyve şekli', 'Oval'], ['Çap', '90–100 mm'], ['Ağırlık', '200–250 g'], ['Kabuk', 'Koyu portakal rengi'], ['Et', 'Portakal rengi'], ['Kabuk–et bağlılığı', 'Orta'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%43'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Anavatan', 'ABD (Kaliforniya)']] },
  { id: 15, slug: 'washington-portakal', title: 'Washington Portakal', category: 'Portakal', group: 'Turunçgil',
    desc: 'Tatlı, aromalı ve çekirdeksiz meyveleriyle iç piyasada ve ihracatta en çok aranan sofralık portakallardan.',
    specs: [['Ağaç', 'Orta güçlü, yuvarlak ve orta büyüklükte taç'], ['Olgunlaşma', 'Kasım (orta erkenci)'], ['Hasat', 'Aralık'], ['Meyve şekli', 'Düzgün yuvarlak'], ['Çap', '75–80 mm'], ['Ağırlık', '200–250 g'], ['Kabuk', 'Koyu turuncu'], ['Et', 'Portakal rengi, gevrek'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Çekirdeksiz'], ['Su (usare) oranı', '%33,4'], ['Periyodisite', 'Yok'], ['Kullanım', 'Sofralık, ihracata uygun'], ['Anavatan', 'Brezilya (Bahia)']] },

  /* ---------- Limon ---------- */
  { id: 4, slug: 'interdonato-limon', title: 'Interdonato Limon', category: 'Limon', group: 'Turunçgil',
    desc: 'Erkenci, ince kabuklu ve silindirik meyveli bir limon. Eylülde olgunlaşır; Akdeniz bölgesinde sık tercih edilir.',
    specs: [['Ağaç', 'Kazık kök oluşturmaya uygun, kolay çoğalır'], ['Olgunlaşma', 'Eylül'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Uzunca, silindirik'], ['Çap', '55–60 mm'], ['Ağırlık', '105–110 g'], ['Kabuk', 'Açık yeşil, parlak, ince'], ['Et', 'Yeşilimsi sarı'], ['Kabuk–et bağlılığı', 'Orta'], ['Çekirdek', '6–7'], ['Su (usare) oranı', '%31–39'], ['Puflaşma', 'Geç hasatta görülebilir'], ['Dayanıklılık', 'Kirece dayanıklı, uzun ömürlü'], ['Anavatan', 'Nizza ve Sicilya']] },
  { id: 12, slug: 'mayer-limon', title: 'Mayer Limon', category: 'Limon', group: 'Turunçgil',
    desc: 'İnce kabuklu, sulu ve az çekirdekli bir limon. Eylülde olgunlaşır, ekimde hasat edilir.',
    specs: [['Ağaç', 'Kazık kök oluşturmaya uygun, kolay çoğalır'], ['Olgunlaşma', 'Eylül'], ['Hasat', 'Ekim'], ['Meyve şekli', 'Hafif basık, yuvarlak'], ['Ağırlık', 'Ort. 120 g'], ['Kabuk', 'Sarı, düz, parlak, ince'], ['Et', 'Açık sarı, gevrek ve sulu'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', '2–3'], ['Su (usare) oranı', '%38,6'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kirece dayanıklı, uzun ömürlü'], ['Anavatan', 'ABD']] },
  { id: 11, slug: 'kutdiken-limon', title: 'Kütdiken (Yediveren) Limon', category: 'Limon', group: 'Turunçgil',
    desc: 'Kirece dayanıklı, kolay çoğalan ve uzun ömürlü bir çeşit. Kasımda olgunlaşan meyveleri şubata kadar toplanabilir.',
    specs: [['Ağaç', 'Kazık kök oluşturmaya uygun, kolay çoğalır, uzun ömürlü'], ['Olgunlaşma', 'Kasım'], ['Hasat', 'Kasım–Şubat'], ['Meyve şekli', 'Elipse yakın, meme kısmı az gelişmiş'], ['Çap', '60–65 mm'], ['Ağırlık', '120–125 g'], ['Kabuk', 'Açık yeşil-sarı, düzgün, parlak'], ['Et', 'Sarı'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Yaklaşık 10'], ['Su (usare) oranı', '%33'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kirece dayanıklı'], ['Anavatan', 'İtalyan Femminello seleksiyonu olduğu düşünülüyor']] },

  /* ---------- Greyfurt ---------- */
  { id: 17, slug: 'star-ruby-greyfurt', title: 'Star Ruby Greyfurt', category: 'Greyfurt', group: 'Turunçgil',
    desc: 'Kırmızı etli, neredeyse çekirdeksiz ve çok ince kabuklu bir greyfurt; günümüzde en çok dikilen çeşitlerden.',
    specs: [['Ağaç', 'Aşılı, orta irilikte; limona göre yavaş büyür'], ['Olgunlaşma', 'Aralık'], ['Hasat', 'Ocak'], ['Meyve şekli', 'Yuvarlak, hafif basık'], ['Çap', '100–110 mm'], ['Ağırlık', '450–500 g'], ['Kabuk', 'Kırmızımsı, çok ince ve pürüzsüz'], ['Et', 'Kırmızı'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', 'Çekirdeksize yakın'], ['Su (usare) oranı', '%43–67'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kuraklığa dayanıklı değil'], ['Toprak', 'Genellikle drenajı az, ağır topraklar'], ['Anavatan', 'ABD']] },
  { id: 16, slug: 'rio-red-greyfurt', title: 'Rio Red Greyfurt', category: 'Greyfurt', group: 'Turunçgil',
    desc: 'Kabuğu ve eti koyu kırmızı, iri ve sulu meyveler verir. Ocakta olgunlaşır, şubatta hasat edilir.',
    specs: [['Ağaç', 'Aşılı, orta irilikte; limona göre yavaş büyür'], ['Olgunlaşma', 'Ocak'], ['Hasat', 'Şubat'], ['Meyve şekli', 'Yuvarlak ile uzunca arası'], ['Çap', '100–110 mm'], ['Ağırlık', '400–450 g'], ['Kabuk', 'Koyu kırmızı, pürüzsüz'], ['Et', 'Koyu kırmızı'], ['Kabuk–et bağlılığı', 'Sıkı'], ['Çekirdek', '1–3'], ['Su (usare) oranı', '%37'], ['Puflaşma', 'Yok'], ['Periyodisite', 'Yok'], ['Dayanıklılık', 'Kuraklığa orta düzeyde dayanır'], ['Toprak', 'Genellikle drenajı zayıf, ağır topraklar'], ['Anavatan', 'ABD']] },

  /* ---------- Zeytin ---------- */
  { id: 19, slug: 'gemlik-zeytin', title: 'Gemlik Zeytin', category: 'Zeytin', group: 'Zeytin',
    desc: 'Hem sofralık hem yağlık değerlendirilen, siyah kabuklu bir Anadolu çeşidi. Dayanıklı ve orta güçte büyür.',
    specs: [['Ağaç', 'Orta güçte, dayanıklı'], ['Hasat', 'Kasım–Ocak'], ['Meyve', 'Orta boy, yuvarlaktan silindiriğe'], ['Kabuk', 'Siyah'], ['Çekirdek', 'Orta iri'], ['Yağ oranı', '≈ %29,9'], ['Kullanım', 'Sofralık ve yağlık'], ['Anavatan', 'Anadolu']] },
  { id: 18, slug: 'nizip-zeytin', title: 'Nizip Zeytin', category: 'Zeytin', group: 'Zeytin',
    desc: 'Adaptasyon yeteneği yüksek, yağ bakımından zengin bir çeşit. Dikimden sonraki ikinci yılda meyveye yatar.',
    specs: [['Ağaç', 'Gövdesi geniş ve kıvrımlı; yaşlandıkça gri kabuğu çatlar, tacı her yıl genişler'], ['İlk ürün', 'Dikimden sonraki 2. yıl'], ['En verimli dönem', '4. yıl'], ['Yağ', 'Yağ bakımından zengin'], ['Uyum', 'Adaptasyon yeteneği yüksek']] },

  /* ---------- Nar ---------- */
  { id: 20, slug: 'hicaz-nar', title: 'Hicaz Nar', category: 'Nar', group: 'Nar',
    desc: 'İri, koyu taneli ve uzun süre saklanabilen bir Anadolu narı. Sofralık tüketime ve nar ekşisine uygundur.',
    specs: [['Ağaç', 'Çok gövdeli, çalı formunda'], ['Olgunlaşma', 'Eylül'], ['Hasat', 'Eylül sonu–Ekim'], ['Meyve şekli', 'Küresel, iri'], ['Ağırlık', 'Ort. 500 g'], ['Kabuk', 'Koyu kırmızı ya da sarı'], ['Tane', 'Pembe, kırmızı, koyu kırmızı ya da mor'], ['Depolama', 'Serin ortamda uzun süre saklanır'], ['Kullanım', 'Sofralık ve nar ekşisi gibi sanayi ürünleri'], ['Anavatan', 'Anadolu']] },
  { id: 21, slug: 'katirbasi-nar', title: 'Katırbaşı Nar', category: 'Nar', group: 'Nar',
    desc: 'Doğal olarak küçük boylu kalır; sık dikime, kolay hasat ve ilaçlamaya uygundur. İri, lezzetli ve taşımaya dayanıklı meyveler verir.',
    specs: [['Ağaç', 'Doğal olarak küçük boylu; birim alana daha çok fidan dikilir'], ['İlk ürün', 'Dikimden kısa süre sonra'], ['Meyve', 'İri ve çok lezzetli'], ['Kabuk', 'Orta sert, sarı zemin üzerinde kırmızı noktalı'], ['Tane', 'Kırmızı ya da pembe'], ['Depolama', 'Depolama ve taşımaya dayanıklı'], ['Kullanım', 'Sofralık']] },

  /* ---------- Kayısı ---------- */
  { id: 33, slug: 'ninfa-kayisi', title: 'Ninfa Kayısı', category: 'Kayısı', group: 'Meyve',
    desc: 'Mayısta hasada gelen erkenci, iri ve gösterişli bir kayısı. Tozlayıcıya ihtiyaç duymaz, üreticiler tarafından çok tercih edilir.',
    specs: [['Ağaç', 'Yarı kuvvetli, yayvan, çok verimli'], ['Çiçeklenme', 'Erken'], ['Hasat', 'Mayıs sonu (erkenci)'], ['Meyve şekli', 'Yuvarlağa yakın oval'], ['İrilik', 'İri'], ['Kabuk', 'Sarı, güneş gören yüzü hafif kırmızı'], ['Et', 'Sarı, orta sert'], ['Çekirdek', 'Ete yapışık, içi tatlı'], ['Tat', 'Orta tatlı'], ['Depolama', 'Uzun süre depolanmaz'], ['Tozlayıcı', 'Gerekmez'], ['Kullanım', 'Sofralık']] },
  { id: 36, slug: 'aurora-kayisi', title: 'Aurora Kayısı', category: 'Kayısı', group: 'Meyve',
    desc: 'Ninfa ile aynı dönemde hasat edilen erkenci bir kayısı. Turuncu, güneşte kızaran meyvelerinin şeker oranı iyidir.',
    specs: [['Ağaç', 'İri, dik büyür'], ['Olgunlaşma', 'Erkenci'], ['Hasat', 'Ninfa ile aynı dönem'], ['Meyve şekli', 'Yassı ve oval'], ['Kabuk', 'Turuncu, güneş gören yüzü kızarır'], ['Tat', 'Şeker oranı iyi']] },
  { id: 34, slug: 'orange-ruby-kayisi', title: 'Orange Ruby Kayısı', category: 'Kayısı', group: 'Meyve',
    desc: 'Aromalı, çok kaliteli ve gösterişli bir sofralık kayısı. Pazar değeri yüksek olduğu için üreticiler tarafından sık tercih edilir.',
    specs: [['Ağaç', 'Güçlü, dalları yarı dik'], ['Çiçeklenme', 'Orta dönem'], ['Hasat', 'Haziranın 2. haftası'], ['Meyve şekli', 'Oval'], ['İrilik', 'Orta iri–iri'], ['Kabuk', 'Turuncu, güneş gören yüzü parlak kırmızı'], ['Et', 'Turuncu, orta sert'], ['Çekirdek', 'Etten ayrılır, içi tatlı'], ['Tat', 'Çok kaliteli, aromalı'], ['Depolama', 'Uzun süre saklanamaz'], ['Kullanım', 'Sofralık']] },
  { id: 35, slug: 'sekerpare-kayisi', title: 'Şekerpare Kayısı', category: 'Kayısı', group: 'Meyve',
    desc: 'Çok tatlı, yüksek kaliteli ve kurutmaya uygun bir Anadolu kayısısı. Tozlayıcıya ihtiyaç duymaz.',
    specs: [['Ağaç', 'Güçlü ve yayvan, verimli (bazı yıllar az verebilir)'], ['Çiçeklenme', 'Orta dönem'], ['Hasat', 'Haziran ortası'], ['Meyve şekli', 'Orta iri, oval, hafif yassı'], ['Kabuk', 'Sarı, güneş gören yüzü kırmızı'], ['Et', 'Sarı, orta sert'], ['Çekirdek', 'Küçük, etten ayrı, içi tatlı'], ['Tat', 'Çok tatlı, yüksek kalite'], ['Depolama', 'Yaş olarak uzun saklanmaz'], ['Kullanım', 'Kurutmaya uygun'], ['Tozlayıcı', 'Gerekmez'], ['Anavatan', 'Anadolu']] },

  /* ---------- Erik ---------- */
  { id: 30, slug: 'papaz-erik', title: 'Papaz Erik', category: 'Erik', group: 'Meyve',
    desc: 'Yerli ve en meşhur yeşil eriklerden. Ekşimsi, kendine has aromalı, gevrek ve çok sulu meyveler verir.',
    specs: [['Ağaç', 'Kuvvetli, yayvan, çok dallı'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Nisan sonu–Mayıs başı'], ['Meyve şekli', 'Yuvarlak, karın çizgisi belirgin'], ['Ağırlık', 'Ort. 25–30 g'], ['Kabuk', 'Parlak koyu yeşil, ince'], ['Et', 'Yeşil, çok sulu'], ['Çekirdek', 'Ete bağlı'], ['Tat', 'Ekşimsi, kendine has aroma, gevrek'], ['Depolama', 'Depolanmaz'], ['Tozlayıcı', 'Bekiroğlu (Havran), Kebap, Can, Aynalı'], ['Kullanım', 'Sofralık'], ['Anavatan', 'Anadolu']] },
  { id: 27, slug: 'can-erik', title: 'Can Erik', category: 'Erik', group: 'Meyve',
    desc: 'Yeşil tüketim için toplanan, sert, gevrek ve mayhoş bir erik. Öne çıkan özelliği yüksek verimi.',
    specs: [['Diğer adları', 'İstanbul Papazı, Yalova'], ['Ağaç', 'Kuvvetli, yayvan, çok dallı, çok verimli'], ['Çiçeklenme', 'Mart sonu'], ['Hasat', 'Mayıs başı'], ['Meyve şekli', 'Yuvarlak, simetrik, karın çizgisi belirgin'], ['Ağırlık', 'Ort. 15–20 g'], ['Kabuk', 'Açık yeşil, ince'], ['Et', 'Açık yeşil, ince dokulu'], ['Çekirdek', 'Ete bağlı'], ['Tat', 'Sert, gevrek, sulu, mayhoş'], ['Depolama', 'Uzun süre depolamaya uygun değil'], ['Tozlayıcı', 'Kendine verimli'], ['Kullanım', 'Yeşil tüketim'], ['Anavatan', 'Anadolu']] },
  { id: 31, slug: 'red-beauty-erik', title: 'Red Beauty Japon Erik', category: 'Erik', group: 'Meyve',
    desc: 'Japon erikleri içinde en erken olgunlaşan çeşit. Kırmızı kabuklu, sarı ve sert etli, raf ömrü uzun meyveler verir.',
    specs: [['Hasat', 'Mayısın 2. haftasından itibaren'], ['Meyve şekli', 'Yuvarlak, ucu hafif sivri'], ['Kabuk', 'Kırmızı'], ['Et', 'Sarı, sert'], ['Depolama', 'Raf ömrü uzun'], ['Öne çıkan', 'Japon erikleri içinde en erkencisi'], ['Anavatan', 'Kaliforniya (ABD)']] },
  { id: 29, slug: 'black-splendor-erik', title: 'Black Splendor Japon Erik', category: 'Erik', group: 'Meyve',
    desc: 'Siyaha yakın mor kabuklu, parlak kırmızı etli ve çok beğenilen bir Japon eriği. Depolama ve taşımaya elverişlidir.',
    specs: [['Ağaç', 'Orta güçte, dik, verimli'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Haziran ortası'], ['Meyve şekli', 'Yuvarlak, simetrik, hafif basık'], ['İrilik', 'İriye yakın'], ['Kabuk', 'Siyaha yakın mor, üzeri küllü'], ['Et', 'Parlak kırmızı'], ['Çekirdek', 'Ete bağlı'], ['Tat', 'Sert, gevrek, sulu; olgunlaştıkça lezzetlenir'], ['Depolama', 'Depolama ve taşımaya elverişli'], ['Tozlayıcı', 'Santa Rosa, Pioneer'], ['Anavatan', 'Kaliforniya']] },
  { id: 28, slug: 'black-amber-erik', title: 'Black Amber Japon Erik', category: 'Erik', group: 'Meyve',
    desc: 'Orta erkenci, siyaha yakın mor kabuklu ve sarı etli bir Japon eriği. Sert, gevrek ve lezzetli; taşımaya elverişli.',
    specs: [['Ağaç', 'Yarı kuvvetli, dik, verimli, orta dallı'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Haziran sonu–Temmuz başı'], ['Meyve şekli', 'Yuvarlak, simetrik'], ['İrilik', 'Orta iri'], ['Kabuk', 'Siyaha yakın mor, üzeri küllü'], ['Et', 'Sarı'], ['Çekirdek', 'Küçük, ete bağlı'], ['Tat', 'Sert, gevrek, orta sulu, lezzetli'], ['Depolama', 'Depolama ve taşımaya elverişli'], ['Tozlayıcı', 'Santa Rosa, Black Diamond'], ['Anavatan', 'Kaliforniya']] },
  { id: 32, slug: 'black-star-erik', title: 'Black Star Japon Erik', category: 'Erik', group: 'Meyve',
    desc: 'Kuvvetli gelişen, verimli bir Japon eriği. Siyaha yakın mor kabuklu, sarı etli, kaliteli ve taşımaya elverişli meyveler verir.',
    specs: [['Ağaç', 'Kuvvetli, dik, verimli'], ['Çiçeklenme', 'Nisan başı'], ['Hasat', 'Haziran sonu'], ['Meyve şekli', 'Yuvarlağa yakın, üstü hafif konik'], ['İrilik', 'Orta iri–iri'], ['Kabuk', 'Siyaha yakın mor, üzeri küllü'], ['Et', 'Sarı'], ['Çekirdek', 'Küçük, ete yarı bağlı'], ['Tat', 'Sert, gevrek, orta sulu, kaliteli'], ['Depolama', 'Depolama ve taşımaya elverişli'], ['Tozlayıcı', 'Santa Rosa'], ['Anavatan', 'ABD']] },

  /* ---------- Badem ---------- */
  { id: 22, slug: 'ferragnes-badem', title: 'Ferragnes Badem', category: 'Badem', group: 'Meyve',
    desc: 'Geç çiçeklenmesi ve bol ürünüyle yaygın tercih edilen, kuvvetli ve dayanıklı bir badem. Bakımı ve sulaması kolaydır.',
    specs: [['Ağaç', 'Kuvvetli, yarı dik, çok verimli'], ['Çiçeklenme', 'Geç'], ['Meyve şekli', 'Uzun, oval'], ['İrilik', 'İri, doyurucu'], ['Kabuk', 'Kahverengi'], ['İç', 'Koyu kahverengi'], ['İkiz meyve', '≈ %2'], ['Depolama', 'Çok uzun süre dayanır'], ['Tozlayıcı', 'Ferraduel'], ['Kullanım', 'Yağ üretimine uygun'], ['Dayanıklılık', 'Kuru ortamlarda da yetişir'], ['Anavatan', 'Fransa']] },
  { id: 24, slug: 'ferraduel-badem', title: 'Ferraduel Badem', category: 'Badem', group: 'Meyve',
    desc: 'Erken yaşta meyveye yatan, iri taneli ve çok kaliteli bir badem. Üreticilerin en çok tercih ettiği çeşitlerden.',
    specs: [['Ağaç', 'Kuvvetli, yarı dik, çok verimli'], ['Çiçeklenme', 'Geç'], ['İlk ürün', 'Erken yaşta'], ['Meyve şekli', 'Uzun, oval'], ['İrilik', 'İri'], ['Kabuk', 'Kahverengi'], ['İç', 'Koyu kahverengi'], ['İç randımanı', '%30–35'], ['İkiz meyve', '%2'], ['Depolama', 'Çok uzun süre saklanır'], ['Tozlayıcı', 'Ferragnes'], ['Kullanım', 'Sofralık ve yağlık'], ['Dayanıklılık', 'Kuru ortamda yetişir, suya az ihtiyaç duyar'], ['Anavatan', 'Fransa']] },
  { id: 23, slug: 'texas-badem', title: 'Texas Badem', category: 'Badem', group: 'Meyve',
    desc: 'Güçlü ve verimli, sert kabuklu bir diş bademi. Meyveleri çok uzun süre depolanabilir, iç randımanı yaklaşık %45.',
    specs: [['Ağaç', 'Güçlü, verimli, yarı dik'], ['Çiçeklenme', 'Orta–geç'], ['Hasat', 'Temmuz ortası'], ['Meyve şekli', 'Uzun, oval'], ['İrilik', 'Orta'], ['Kabuk', 'Kahverengi, sert (diş bademi)'], ['İç', 'Koyu kahverengi'], ['İç randımanı', '≈ %45'], ['İkiz meyve', '≈ %15'], ['Depolama', 'Çok uzun süre'], ['Tozlayıcı', 'Marcona'], ['Anavatan', 'ABD']] },

  /* ---------- Trabzon Hurması ---------- */
  { id: 25, slug: 'fuyu-trabzon-hurmasi', title: 'Fuyu Trabzon Hurması', category: 'Trabzon Hurması', group: 'Meyve',
    desc: 'Buruk olmayan, C ve A vitamini bakımından zengin iri meyveler verir. Kendine verimlidir, tozlayıcı istemez.',
    specs: [['Ağaç', 'Güçlü, hızlı büyür'], ['Çiçeklenme', 'Nisan'], ['Hasat', 'Ekim sonu'], ['Meyve şekli', 'Yassı yuvarlak, köşeli olabilir'], ['Ağırlık', 'Ort. 200 g'], ['Kabuk', 'Turuncu-kırmızı, sert ve parlak'], ['Et', 'Açık sarı-turuncu'], ['Tat', 'Buruk değil'], ['Besin değeri', 'C ve A vitamini bakımından zengin'], ['Tozlayıcı', 'Kendine verimli'], ['Anavatan', 'Çin']] },
  { id: 26, slug: 'hachiya-trabzon-hurmasi', title: 'Hachiya Trabzon Hurması', category: 'Trabzon Hurması', group: 'Meyve',
    desc: '"Cennet hurması" olarak da bilinen, çok iri ve gösterişli meyveli bir çeşit. Meyvesi iyice yumuşayınca yenir.',
    specs: [['Diğer adı', 'Cennet hurması'], ['Ağaç', 'Kuvvetli gelişir'], ['Verime başlama', '4 yaşından sonra'], ['Hasat', 'Ekim'], ['Meyve', 'Çok iri, gösterişli'], ['Kabuk', 'Turuncu, kırmızımsı tonlu'], ['Et', 'Turuncu'], ['Tat', 'Sertken buruk, iyice yumuşayınca yenir'], ['Tozlayıcı', 'Kendine verimli (tozlanmazsa çekirdeksiz)'], ['Depolama', 'Soğuk depoda yaklaşık 1 ay']] },

  /* ---------- Anaç ---------- */
  { id: 37, slug: 'myrobolan-anac', title: 'Myrobolan B / GF31 Anaç', category: 'Anaç', group: 'Anaç',
    desc: 'Erik yetiştiriciliğinde en yaygın kullanılan anaçlardan. Geniş taç oluşturur, ağır topraklar dahil farklı topraklarda kullanılabilir.',
    specs: [['Kullanım', 'Erik yetiştiriciliği (Can grubu erikleriyle aynı tür)'], ['Kuvvet', 'Güçlü, geniş taç'], ['Toprak', 'Ağır topraklar dahil farklı toprak tipleri'], ['Alternatif', 'Myrobolan 29-C: yarı bodur, ağaçlar yaklaşık %70–80 boyutta'], ['29-C kök yapısı', 'Orta derinlikte'], ['29-C hassasiyet', 'Bakteriyel kanser ve meşe kök mantarına hassas'], ['29-C dikim aralığı', 'Sıra üzeri 3–3,5 m, sıra arası 4,5–5 m'], ['Diğer anaçlar', 'Kayısı çöğürü de temin edilir']] },
];

export const CATEGORIES = ['Tümü', 'Mandalina', 'Portakal', 'Limon', 'Greyfurt', 'Zeytin', 'Nar', 'Kayısı', 'Erik', 'Badem', 'Trabzon Hurması', 'Anaç'];
export const GROUPS = ['Tümü', 'Turunçgil', 'Zeytin', 'Nar', 'Meyve'];

export const byId = id => FIDANLAR.find(f => f.id === Number(id));

/* Kartta ve ürün penceresinin üstünde gösterilen 3 öne çıkan bilgi: zaman, meyve, köken.
   Her satırda, fidanda bulunan ilk başlık seçilir -> [ikon, başlık, değer] */
const PICK = [
  [['Hasat', 'calendar'], ['Olgunlaşma', 'calendar'], ['İlk ürün', 'calendar'], ['Verime başlama', 'calendar'], ['Çiçeklenme', 'calendar'], ['Kullanım', 'leaf']],
  [['Ağırlık', 'scale'], ['İrilik', 'scale'], ['Meyve', 'scale'], ['Meyve şekli', 'scale'], ['Yağ oranı', 'droplet'], ['Yağ', 'droplet'], ['Kuvvet', 'tree']],
  [['Anavatan', 'pin'], ['Kullanım', 'leaf'], ['Uyum', 'leaf'], ['Tat', 'leaf'], ['Toprak', 'leaf'], ['Tozlayıcı', 'sprout']],
];
export function highlights(f) {
  const map = new Map(f.specs);
  const used = new Set();
  return PICK.map(row => {
    const hit = row.find(([key]) => map.has(key) && !used.has(key));
    if (!hit) return null;
    used.add(hit[0]);
    return [hit[1], hit[0], map.get(hit[0])];
  }).filter(Boolean);
}
