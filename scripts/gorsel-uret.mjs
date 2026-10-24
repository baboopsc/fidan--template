/* ==========================================================
   Gemini API ile fidan görselleri üretir.

   Kurulum (bir kere):
     1) Proje klasöründe .env dosyası oluştur, içine:  GEMINI_API_KEY=senin_anahtarın
        (.env zaten .gitignore'da; GitHub'a gitmez. Anahtarı kimseyle paylaşma.)
     2) İsteğe bağlı ama önerilir:  npm i -D sharp
        (görselleri küçültüp .webp yapar; yoksa büyük .png olarak kaydedilir)

   Kullanım (VS Code terminalinde, proje klasöründe):
     npm run gorsel -- --dene                 API'yi çağırmaz, ne üreteceğini ve komutları gösterir (ücretsiz)
     npm run gorsel -- --modeller             anahtarınla kullanabileceğin görsel modellerini listeler
     npm run gorsel -- --limit=3              eksik görsellerden ilk 3'ünü üretir (önce böyle dene!)
     npm run gorsel -- --sadece=hicaz-nar,kategori-nar   yalnızca bunları üretir
     npm run gorsel -- --hepsi                eksik olanların hepsini üretir
     npm run gorsel -- --sadece=hicaz-nar --yeniden      var olanın üzerine yeniden üretir
     npm run gorsel -- --kategoriler          yalnızca 16 kategori görselini üretir (~0,60 $)
     --butce=3                                tahmini harcama 3 doları geçecekse durur (varsayılan 5)
     --model=gemini-3.1-flash-image           bu sefer başka bir modelle üretir
     --deneme                                 siteye koymaz; scripts/denemeler/ klasörüne kaydeder (karşılaştırmak için)

   Görseller src/img/<slug>.webp olarak kaydedilir; site onları otomatik kullanır.
   Kategori kartları için de kategori-<slug> görselleri üretilir (ör. kategori-mandalina.webp).
   ========================================================== */
import { readFile, writeFile, readdir, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, TUM_FIDANLAR } from '../src/js/fidanlar.js';
import en from '../src/js/i18n/en.js';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(KOK, 'src', 'img');
const API = 'https://generativelanguage.googleapis.com/v1beta';
const VARSAYILAN_MODEL = 'gemini-3.1-flash-image'; // Nano Banana 2: denemelerde en doğal sonucu verdi
// Görsel başı tahmini dolar. Bilinmeyen modellerde temkinli (yüksek) tahmin; gerçek tutarı AI Studio > Billing'den kontrol et.
const FIYATLAR = { 'gemini-2.5-flash-image': 0.039 };
let TAHMINI_FIYAT = 0.07;

/* ---------- Komut satırı: --limit=3 --sadece=a,b --dene ---------- */
const ARG = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));

/* ---------- .env dosyasını oku (ek paket gerektirmesin diye elle) ---------- */
async function envOku() {
  try {
    const metin = await readFile(path.join(KOK, '.env'), 'utf8');
    for (const satir of metin.split(/\r?\n/)) {
      const m = satir.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch { /* .env yoksa sorun değil, aşağıda uyarırız */ }
}

/* ---------- Komut (prompt) hazırlama ----------
   Gemini İngilizce komutlarda daha iyi sonuç veriyor; bu yüzden en.js'teki İngilizce bilgileri kullanıyoruz. */
// Yapay zekâ havası vermesin diye: "ürün fotoğrafı / stüdyo / tam ortada / yarım meyve" gibi kalıplardan kaçınıyoruz,
// bunun yerine bahçede telefonla çekilmiş, kusurlarıyla gerçek bir fotoğraf istiyoruz.
const STIL = 'A candid, unedited smartphone photo taken by a farmer in a real orchard in Hatay, Turkey. '
  + 'Fruit growing naturally on the tree, photographed at eye level from a slightly off-centre, casual angle. '
  + 'Natural outdoor light with uneven shadows, ordinary phone-camera depth (background only slightly soft, still recognisable trees and soil), '
  + 'slight sensor noise, realistic natural colours (ripe fruit clearly bright and appetising), no heavy colour grading. '
  + 'The fruit looks healthy and good quality, like normal fruit on a real working farm — not flawless: '
  + 'a few fruits have small natural marks such as light wind scars, a little dust, slightly uneven colour or a small leaf rub, '
  + 'but no disease, no rot, no heavy dark spots and no insect damage. Irregular fruit sizes, '
  + 'a few leaves with slightly dry edges, twigs and leaves partly covering some fruit, ordinary soil and trees behind, with no people anywhere in the frame. '
  + 'Not staged, not a stock photo, not a studio shot, no perfect symmetry. '
  + 'Square 1:1 photo. No text, no logos, no watermark, no people, no hands, no baskets, no props.';

// Her kategori için sahne: n = meyvenin İngilizce adı. Meyveler ağaçta, olduğu gibi.
const SAHNE = {
  'Mandalina': n => `a cluster of ripe ${n} fruits hanging on the tree among glossy leaves`,
  'Portakal': n => `ripe ${n}s hanging on the tree among dark-green leaves`,
  'Limon': n => `ripe ${n}s hanging on the tree among leaves, some fruit still slightly green`,
  'Greyfurt': n => `large ripe ${n}s hanging heavily on the tree among leaves`,
  'Zeytin': n => `an olive branch loaded with ${n}s among narrow silvery-green leaves`,
  'Nar': n => `ripe ${n}s hanging on the tree, one of them naturally cracked open on the branch showing a few arils`,
  'İncir': n => `ripe ${n}s on the tree among large lobed fig leaves`,
  'Dut': () => 'a mulberry branch full of ripe berries among leaves, some berries not yet ripe',
  'Kayısı': n => `ripe ${n}s on the tree among leaves`,
  'Erik': n => `ripe ${n}s hanging on the tree among leaves`,
  'Şeftali': n => `ripe ${n}es hanging on the tree among long narrow leaves`,
  'Nektarin': n => `ripe smooth-skinned ${n}s hanging on the tree among long narrow leaves`,
  'Kiraz': () => 'clusters of ripe sweet cherries hanging on the tree among leaves',
  'Badem': n => `${n}s on the tree with green hulls, some hulls split open showing the nuts`,
  'Ceviz': n => `${n}s in green husks on the tree among leaves, one husk split open`,
  'Trabzon Hurması': n => `ripe orange ${n}s hanging on the tree among leaves`,
  'Anaç': () => 'a row of young grafted fruit-tree saplings in a nursery field',
};

// Aynı kategorideki çeşitler birbirinin kopyası gibi durmasın: her çeşit farklı bir çekim alır (id'ye göre sabit)
const CEKIMLER = [
  'Close-up of one branch, fruit filling most of the frame.',
  'Medium shot showing a larger part of the tree with fruit at different heights.',
  'Taken in early morning light, low sun from the side.',
  'Taken on an overcast day with soft, flat light.',
  'Shot from slightly below, looking up into the canopy with a bit of sky.',
  'Shot from the side of the tree row, with the next trees visible behind.',
  'Late afternoon warm light, some fruit in shade and some in sun.',
  'A few fruits in the foreground, the rest of the tree out of focus behind.',
  'Taken around midday with harsh light and short shadows.',
];

// Görünüşü etkileyen özellikler (renk, şekil, iriliği) -> komuta eklenir
const GORUNUS = ['Kabuk', 'Et', 'Meyve şekli', 'İrilik', 'Meyve', 'Tane'];

function ingilizceAd(f) {
  const p = en.products[f.id];
  if (p?.title) return p.title;
  const tur = en.nouns[f.noun || f.category];
  return f.name && tur ? `${f.name} ${tur}` : f.title;
}

function fidanKomutu(f) {
  const tur = en.nouns[f.noun || f.category] || en.cats[f.category] || 'fruit';
  const p = en.products[f.id] || {};
  const etiket = { ...en.labels, ...(p.labels || {}) };
  const ozellikler = (f.specs || [])
    .filter(([k]) => GORUNUS.includes(k))
    .map(([k, v]) => `${(etiket[k] || k).toLowerCase()}: ${p.specs?.[k] ?? v.replace(/%(\d)/g, '$1%')}`)
    .join('; ');
  const sahne = (SAHNE[f.category] || (n => `ripe ${n} fruit on a branch`))(tur.toLowerCase());
  const cekim = CEKIMLER[f.id % CEKIMLER.length];
  return `Subject: ${sahne}. The variety is "${ingilizceAd(f)}". ${cekim}`
    + (ozellikler ? ` Variety characteristics to show faithfully — ${ozellikler}.` : '')
    + `\n${STIL}`;
}

function kategoriKomutu(c) {
  const tur = (en.nouns[c.key] || en.cats[c.key] || 'fruit').toLowerCase();
  return `Subject: ${(SAHNE[c.key] || (n => `ripe ${n} fruit on a branch`))(tur)}.\n${STIL}`;
}

/* ---------- Üretilecek listeyi çıkar ---------- */
async function mevcutGorseller() {
  const dosyalar = await readdir(IMG);
  return new Set(dosyalar.filter(d => /\.(jpe?g|png|webp|avif)$/i.test(d)).map(d => d.replace(/\.[^.]+$/, '')));
}

function isListesi() {
  const fidanlar = TUM_FIDANLAR.filter(f => !f.hidden);
  const kategoriler = CATEGORIES.filter(c => fidanlar.some(f => f.category === c.key));
  return [
    ...kategoriler.map(c => ({ slug: `kategori-${c.slug}`, ad: `Kategori: ${c.key}`, komut: kategoriKomutu(c) })),
    ...fidanlar.map(f => ({ slug: f.slug, ad: f.title, komut: fidanKomutu(f) })),
  ];
}

/* ---------- Gemini API ---------- */
async function modelleriListele(anahtar) {
  const res = await fetch(`${API}/models?pageSize=1000`, { headers: { 'x-goog-api-key': anahtar } });
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${json.error?.message}`);
  const gorsel = json.models.filter(m => /image/i.test(m.name));
  console.log('Görsel üretebilen modeller (.env içine GEMINI_MODEL=... olarak yazabilirsin):\n');
  for (const m of gorsel) console.log(`  ${m.name.replace('models/', '').padEnd(40)} ${m.displayName || ''}`);
}

const bekle = ms => new Promise(r => setTimeout(r, ms));

async function gorselUret(komut, model, anahtar) {
  const govde = {
    contents: [{ parts: [{ text: `Generate a photo. ${komut}` }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } },
  };
  for (let deneme = 1; deneme <= 4; deneme++) {
    const res = await fetch(`${API}/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': anahtar },
      body: JSON.stringify(govde),
    });
    // 429 = çok hızlı istek, 5xx = Google tarafında geçici sorun -> biraz bekleyip yeniden dene
    if (res.status === 429 || res.status >= 500) {
      const sure = 5000 * 2 ** (deneme - 1);
      console.log(`   ${res.status} geldi, ${sure / 1000} sn bekleyip yeniden deniyorum...`);
      await bekle(sure);
      continue;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(`${res.status}: ${json.error?.message}`);
    const parca = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!parca) {
      // Model bazen görsel yerine yalnızca yazıyla cevap veriyor ("STOP"): bir kez daha iste
      const neden = json.candidates?.[0]?.finishReason || 'sebep yok';
      if (deneme < 3 && neden === 'STOP') { console.log('   görsel gelmedi, yeniden istiyorum...'); await bekle(2000); continue; }
      throw new Error(`Görsel dönmedi (${neden})`);
    }
    return { veri: Buffer.from(parca.inlineData.data, 'base64'), tur: parca.inlineData.mimeType };
  }
  throw new Error('4 denemede de olmadı (kota ya da sunucu sorunu)');
}

// sharp kuruluysa 900px .webp (~60-120 KB); değilse modelin verdiği dosya olduğu gibi kaydedilir
async function kaydet(slug, { veri, tur }, klasor = IMG) {
  try {
    const sharp = (await import('sharp')).default;
    const hedef = path.join(klasor, `${slug}.webp`);
    await sharp(veri).resize(900, 900, { fit: 'cover' }).webp({ quality: 76 }).toFile(hedef);
    return hedef;
  } catch (e) {
    if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
    const uzanti = tur === 'image/jpeg' ? 'jpg' : 'png';
    const hedef = path.join(klasor, `${slug}.${uzanti}`);
    await writeFile(hedef, veri);
    return hedef;
  }
}

/* ---------- Ana akış ---------- */
// Not: process.exit() yerine return kullanıyoruz; Windows'ta fetch bağlantısı kapanırken
// process.exit çağrılırsa Node "Assertion failed ... UV_HANDLE_CLOSING" hatası basıyor.
async function main() {
  await envOku();
  const anahtar = process.env.GEMINI_API_KEY;
  const model = ARG.model || process.env.GEMINI_MODEL || VARSAYILAN_MODEL;
  TAHMINI_FIYAT = FIYATLAR[model] ?? TAHMINI_FIYAT;

  if (ARG.modeller) {
    if (!anahtar) { console.error('Önce .env dosyasına GEMINI_API_KEY=... yaz.'); process.exitCode = 1; return; }
    await modelleriListele(anahtar);
    return;
  }

  const mevcut = await mevcutGorseller();
  let isler = isListesi();
  if (ARG.sadece) {
    const istenen = String(ARG.sadece).split(',').map(s => s.trim());
    isler = isler.filter(i => istenen.includes(i.slug));
    const bilinmeyen = istenen.filter(s => !isler.some(i => i.slug === s));
    if (bilinmeyen.length) console.log('Bulunamayan slug:', bilinmeyen.join(', '));
  }
  if (!ARG.yeniden && !ARG.deneme) isler = isler.filter(i => !mevcut.has(i.slug));
  if (ARG.kategoriler) isler = isler.filter(i => i.slug.startsWith('kategori-'));
  if (ARG.limit) isler = isler.slice(0, Number(ARG.limit));

  // Bütçe: tahmini toplam bu tutarı geçmeyecek kadar görsel üretilir
  const BUTCE = Number(ARG.butce ?? process.env.GEMINI_BUTCE ?? 5);
  const enFazla = Math.floor(BUTCE / TAHMINI_FIYAT);
  if (isler.length > enFazla) {
    console.log(`Bütçe ${BUTCE} $: en fazla ${enFazla} görsel üretilecek (${isler.length} yerine). Artırmak için --butce=...`);
    isler = isler.slice(0, enFazla);
  }

  console.log(`Model: ${model}`);
  console.log(`Üretilecek görsel: ${isler.length}  (tahmini maliyet ~$${(isler.length * TAHMINI_FIYAT).toFixed(2)})\n`);

  if (ARG.dene) {
    for (const i of isler) console.log(`■ ${i.slug}  —  ${i.ad}\n${i.komut}\n`);
    return;
  }
  if (!isler.length) { console.log('Eksik görsel yok.'); return; }
  if (!ARG.limit && !ARG.sadece && !ARG.hepsi && !ARG.kategoriler) {
    console.log('Güvenlik için toplu üretim kendiliğinden başlamaz.');
    console.log('Önce birkaç tane dene:  npm run gorsel -- --limit=3');
    console.log('Yalnızca kategoriler:   npm run gorsel -- --kategoriler');
    console.log('Hepsini üretmek için:   npm run gorsel -- --hepsi');
    return;
  }
  if (!anahtar) {
    console.error('GEMINI_API_KEY bulunamadı. Proje klasöründe .env dosyası oluşturup içine şunu yaz:\nGEMINI_API_KEY=senin_anahtarın');
    process.exitCode = 1; return;
  }

  let tamam = 0, hata = 0;
  for (const [n, is] of isler.entries()) {
    process.stdout.write(`[${n + 1}/${isler.length}] ${is.ad} ... `);
    try {
      const sonuc = await gorselUret(is.komut, model, anahtar);
      let dosya;
      if (ARG.deneme) {
        const klasor = path.join(KOK, 'scripts', 'denemeler');
        await mkdir(klasor, { recursive: true });
        dosya = await kaydet(`${is.slug}--${model}--${Date.now().toString(36)}`, sonuc, klasor);
      } else {
        if (ARG.yeniden) for (const d of await readdir(IMG)) if (d.replace(/\.[^.]+$/, '') === is.slug) await unlink(path.join(IMG, d));
        dosya = await kaydet(is.slug, sonuc);
      }
      console.log(`kaydedildi → ${path.relative(KOK, dosya)}`);
      tamam++;
    } catch (e) {
      console.log(`HATA: ${e.message}`);
      hata++;
      if (/^402/.test(e.message)) { console.log('\nÖn ödemeli bakiye bitti (402). AI Studio > Billing sayfasından bakiye ekleyebilirsin. Duruyorum.'); break; }
      if (/API key|PERMISSION|billing|403|401/i.test(e.message)) { console.log('\nAnahtar ya da faturalandırma sorunu görünüyor, duruyorum.'); break; }
    }
    await bekle(1500); // API'yi yormamak için kısa ara
  }
  console.log(`\nBitti: ${tamam} görsel üretildi${hata ? `, ${hata} hata` : ''}. Siteyi yenileyince görünür.`);
}

await main();
