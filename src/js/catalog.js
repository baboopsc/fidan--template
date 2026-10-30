/* ==========================================================
   Fidanlar sayfası
   1) Kategoriler: her meyve türü için bir kart (Mandalina, Portakal ...)
   2) Kategori seçilince: o türün tüm çeşitleri (catalog.html?kategori=mandalina)
   3) Arama: tüm çeşitlerde arar
   4) Ürün penceresi: çeşidin tüm özellikleri (catalog.html?kategori=...&fidan=15)
   Geri tuşu ve paylaşılan bağlantılar çalışır.
   ========================================================== */
import './ui.js';
import { FIDANLAR, visibleCategories, inCategory, byId, imgFor, kategoriImg, highlights, hasDetail, meyveGorseli, fidanGorselleriSirali, kucuk, fidanImg, SITE } from './data.js';
import { FIDAN_BOYLARI, TUPLU } from './fidanlar.js';
import { lang, localize, fullName, shortName, cat, t } from './i18n.js';
import { cardHTML } from './product-card.js';
import { sade, esc } from './utils.js';

const $ = s => document.querySelector(s);
const catsView = $('#catsView'), catGrid = $('#catGrid'), listView = $('#listView');
const grid = $('#grid'), chips = $('#chips'), count = $('#count'), empty = $('#empty'), listTitle = $('#listTitle');
const search = $('#search'), input = $('#q');
const crumbAll = $('#crumbAll'), crumbCatWrap = $('#crumbCatWrap'), crumbCat = $('#crumbCat');

const KATEGORILER = visibleCategories();
let aktif = null;   // seçili kategori (ör. 'Mandalina'); null = kategori kartları
let aranan = '';

/* ---------- Adres çubuğu ---------- */
function adres({ key = aktif, fidan = null } = {}) {
  const q = new URLSearchParams();
  const c = KATEGORILER.find(c => c.key === key);
  if (c) q.set('kategori', c.slug);
  if (fidan) q.set('fidan', fidan);
  const s = q.toString();
  return location.pathname + (s ? `?${s}` : '');
}
function adresiOku() {
  const q = new URLSearchParams(location.search);
  const c = KATEGORILER.find(c => c.slug === q.get('kategori'));
  return { key: c ? c.key : null, fidan: q.get('fidan') };
}

/* ---------- 1) Kategori kartları ---------- */
const VARSAYILAN = imgFor('');
function kartlar() {
  const ayrac = lang === 'ar' ? '، ' : ', ';
  return KATEGORILER.map((c, i) => {
    const liste = inCategory(c.key);
    const src = kategoriImg(c);
    const onizleme = liste.slice(0, 4).map(shortName).join(ayrac) + (liste.length > 4 ? '…' : '');
    return `
      <a class="cat-card" href="${adres({ key: c.key })}" data-key="${esc(c.key)}" style="--tint:${c.tint};--i:${i}">
        <span class="cat-card__media${src !== VARSAYILAN ? ' has-photo' : ''}">
          <img src="${kucuk(src)}" alt="" loading="lazy" width="600" height="450">
          <span class="cat-card__count">${esc(t('varieties', { n: liste.length }))}</span>
        </span>
        <span class="cat-card__body">
          <span class="cat-card__text">
            <span class="cat-card__title">${esc(cat(c.key))}</span>
            <span class="cat-card__list">${esc(onizleme)}</span>
          </span>
          <span class="more-btn" aria-hidden="true"><i class="i i-arrow-right"></i></span>
        </span>
      </a>`;
  }).join('');
}

function cipler() {
  chips.innerHTML = KATEGORILER.map(c =>
    `<button type="button" class="chip${c.key === aktif ? ' is-active' : ''}" data-key="${esc(c.key)}">${esc(cat(c.key))}</button>`).join('');
}

/* ---------- 2) Liste: kategori içi ya da arama ---------- */
function eslesir(f, q) {
  const L = localize(f);
  return sade(`${L.title} ${L.category} ${f.title} ${f.category}`).includes(q);
}

function ciz() {
  const q = sade(aranan);
  const araniyor = q.length > 0;
  const listede = araniyor || Boolean(aktif);

  catsView.hidden = listede;
  listView.hidden = !listede;
  chips.hidden = !aktif || araniyor;
  crumbCatWrap.hidden = !aktif;
  if (aktif) crumbCat.textContent = cat(aktif);

  metaGuncelle();
  if (!listede) { catGrid.innerHTML = kartlar(); return; }

  const liste = araniyor ? FIDANLAR.filter(f => eslesir(f, q)) : inCategory(aktif);
  listTitle.textContent = araniyor ? t('search.results') : t('catTitle', { cat: cat(aktif) });
  count.textContent = liste.length ? t(araniyor ? 'count' : 'varieties', { n: liste.length }) : '';
  grid.innerHTML = liste.map((f, i) => cardHTML(f, { i })).join('');
  empty.hidden = liste.length > 0;
  chips.querySelectorAll('.chip').forEach(b => b.classList.toggle('is-active', b.dataset.key === aktif));
  // Telefonda çip satırı yana kayar: seçili kategoriyi görünür yap
  if (!chips.hidden) chips.querySelector('.is-active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}

/* ---------- Sayfa başlığı ve açıklaması (Google'da görünen) ----------
   Tür seçiliyse "Mandalina Fidanı Çeşitleri | Sağ Fidancılık", çeşit açıksa "Satsuma Mandarin Fidanı | Sağ Fidancılık" */
const metaAciklama = document.querySelector('meta[name="description"]');
function metaGuncelle() {
  let baslik = t('meta.catalog.title'), aciklama = t('meta.catalog.desc');
  if (acik) {
    baslik = `${fullName(acik)} | Sağ Fidancılık`;
    const L = localize(acik);
    aciklama = (hasDetail(acik) ? L.desc : t('noDetail'));
  } else if (aktif && !aranan) {
    const ayrac = lang === 'ar' ? '، ' : ', ';
    baslik = t('meta.cat.title', { cat: cat(aktif) });
    aciklama = t('meta.cat.desc', { cat: cat(aktif), list: inCategory(aktif).map(shortName).join(ayrac) });
  }
  if (aciklama.length > 300) aciklama = aciklama.slice(0, 297).replace(/\s+\S*$/, '') + '…';
  document.title = baslik;
  metaAciklama?.setAttribute('content', aciklama);
}

function yukariKaydir() {
  const hedef = document.querySelector('.toolbar').getBoundingClientRect().top + window.scrollY - 110;
  if (window.scrollY > hedef) window.scrollTo({ top: hedef, behavior: 'smooth' });
}

function kategoriAc(key) {
  aktif = key;
  aramayiTemizle();
  history.pushState(null, '', adres());
  ciz();
  yukariKaydir();
}

function aramayiTemizle() {
  input.value = '';
  aranan = '';
  search.classList.remove('has-value');
}

catGrid.addEventListener('click', e => {
  const a = e.target.closest('[data-key]');
  if (!a || e.metaKey || e.ctrlKey) return; // yeni sekmede açmaya izin ver
  e.preventDefault();
  kategoriAc(a.dataset.key);
});
chips.addEventListener('click', e => {
  const b = e.target.closest('[data-key]');
  if (b && b.dataset.key !== aktif) kategoriAc(b.dataset.key);
});
crumbAll.addEventListener('click', e => {
  e.preventDefault();
  if (aktif || aranan) { aktif = null; aramayiTemizle(); history.pushState(null, '', adres()); ciz(); }
});
$('#back').addEventListener('click', () => {
  if (aranan) { aramayiTemizle(); ciz(); return; } // aramadan çık, bulunduğun yere dön
  aktif = null;
  history.pushState(null, '', adres());
  ciz();
  yukariKaydir();
});
input.addEventListener('input', () => {
  aranan = input.value.trim();
  search.classList.toggle('has-value', aranan.length > 0);
  ciz();
});
$('#clear').addEventListener('click', () => { aramayiTemizle(); ciz(); input.focus(); });
$('#reset').addEventListener('click', () => { aramayiTemizle(); ciz(); });

/* ---------- 3) Ürün penceresi ---------- */
const modal = $('#modal');
let acik = null;

/* Görsel alanı: üst panel meyvesi, alt panel fidanı.
   Görsellerin üstünde "temsilidir / gerçek fotoğraf" yazısı gösterilmiyor; sadece görsel görünür. */
let kareler = [], aktifKare = 0;
function not(el) { el.hidden = true; }
function kareGoster(i) {
  const k = kareler[i];
  if (!k) return;
  aktifKare = i;
  $('#mSapImg').src = k.src;
  not($('#mSapNote'), k);
  // Çeşidin kendi fotoğrafı "Fidanı"; türün genel fidanlık fotoğrafı "Mandalina fidanlarımız" diye yazılır
  $('#mSapTag').textContent = k.tekli ? t('modal.sapling') : t('modal.saplingCat', { cat: cat(acik?.category || '') });
  $('#mThumbs').querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-selected', j === i));
}
$('#mThumbs').addEventListener('click', e => {
  const b = e.target.closest('[data-kare]');
  if (b) kareGoster(Number(b.dataset.kare));
});

/* ---------- Büyütme: meyve ya da fidan fotoğrafına basınca tam ekran ----------
   Oklarla (ya da klavyede ← →) meyve ve fidan fotoğrafları arasında geçilir; fotoğrafa basınca 2 kat yakınlaşır. */
const zoom = $('#zoom');
let zListe = [], zSira = 0;
function zGoster(i) {
  zSira = (i + zListe.length) % zListe.length;
  $('#zoomImg').src = zListe[zSira];
  $('#zoomStage').classList.remove('is-big');
  $('#zoomCount').textContent = zListe.length > 1 ? `${zSira + 1} / ${zListe.length}` : '';
  zoom.querySelectorAll('[data-zgo]').forEach(b => { b.hidden = zListe.length < 2; });
}
function buyut(i) {
  const meyveSrc = $('#mFruit').classList.contains('mpanel--empty') ? null : $('#mImg').getAttribute('src');
  zListe = [meyveSrc, ...kareler.map(k => k.src)].filter(Boolean);
  if (!zListe.length) return;
  zGoster(meyveSrc ? i : Math.max(0, i - 1));
  zoom.showModal();
}
$('#mImg').addEventListener('click', () => buyut(0));
$('#mSapImg').addEventListener('click', () => buyut(1 + aktifKare));
zoom.addEventListener('click', e => {
  const git = e.target.closest('[data-zgo]');
  if (git) return zGoster(zSira + Number(git.dataset.zgo));
  if (e.target.closest('[data-zclose]') || e.target === zoom || e.target.id === 'zoomStage') return zoom.close();
  if (e.target.id === 'zoomImg') $('#zoomStage').classList.toggle('is-big');
});
zoom.addEventListener('keydown', e => {
  if (zListe.length < 2) return;
  const rtl = document.documentElement.dir === 'rtl';
  if (e.key === 'ArrowRight') zGoster(zSira + (rtl ? -1 : 1));
  if (e.key === 'ArrowLeft') zGoster(zSira + (rtl ? 1 : -1));
});

function doldur(f) {
  document.getElementById('mQuote').dataset.quote = f.id; // teklif formu bu çeşitle dolu açılır
  const L = localize(f);
  const detayli = hasDetail(f);
  // Üst panel: meyvesi (yoksa "yakında" yer tutucusu)
  const meyve = meyveGorseli(f);
  $('#mFruit').classList.toggle('mpanel--empty', !meyve);
  $('#mNote').hidden = !meyve;
  if (meyve) { $('#mImg').src = meyve.src; not($('#mNote'), meyve); } else $('#mImg').removeAttribute('src');
  // Alt panel: fidanı (birden fazla fotoğraf varsa küçük resimlerle; yoksa yer tutucu)
  kareler = fidanGorselleriSirali(f);
  $('#mSapling').classList.toggle('mpanel--empty', !kareler.length);
  $('#mSapNote').hidden = !kareler.length;
  if (!kareler.length) $('#mSapImg').removeAttribute('src');
  $('#mThumbs').hidden = kareler.length < 2;
  $('#mThumbs').innerHTML = kareler.length < 2 ? '' : kareler.map((k, i) =>
    `<button type="button" role="tab" data-kare="${i}" aria-label="${esc(t('gallery.open', { n: i + 1 }))}"><img src="${kucuk(k.src)}" alt="" loading="lazy"></button>`).join('');
  kareGoster(0);
  // Fotoğrafı olmayan panel hiç gösterilmez; kalan fotoğraf tüm alanı kaplar (ikisi de yoksa yalnızca meyve yer tutucusu)
  $('#mSapling').hidden = !kareler.length;
  $('#mFruit').hidden = !meyve && kareler.length > 0;
  $('#mSapImg').alt = fullName(f);
  $('#mImg').alt = L.title;
  $('#mCat').textContent = L.category;
  $('#mTitle').textContent = L.title;
  $('#mDesc').textContent = detayli ? L.desc : t('noDetail');
  $('#mFacts').hidden = $('#mSpecs').hidden = $('#mSpecsTitle').hidden = !detayli;
  $('#mFacts').innerHTML = highlights(f).map(([ikon, k, v]) => {
    const [baslik, deger] = L.spec([k, v]);
    return `<div class="fact"><i class="i i-${ikon}"></i>${esc(baslik)}<b>${esc(deger)}</b></div>`;
  }).join('');
  $('#mSpecs').innerHTML = L.specs
    .map(([baslik, deger]) => `<div class="specs__row"><dt>${esc(baslik)}</dt><dd>${esc(deger)}</dd></div>`).join('');
  // Satıştaki fidan: "Tüplü aşılı · 2 yaş · 90–120 cm" (bilgisi olmayan çeşitte yalnızca dikim rehberi bağlantısı görünür)
  const boylar = FIDAN_BOYLARI[f.slug] || [];
  $('#mSapTitle').hidden = $('#mSapList').hidden = !boylar.length;
  $('#mSapList').innerHTML = boylar.map(([yas, cm]) =>
    `<li>${esc(t(TUPLU.has(f.slug) ? 'sap.potted' : 'sap.grafted'))} · ${esc(yas === 1 ? t('sap.age1') : t('sap.age', { n: yas }))} · <b>${esc(cm)} cm</b></li>`).join('');
  // WhatsApp: mesaj bu çeşidin adıyla hazır gelir ("Merhaba, Washington Navel Portakal Fidanı hakkında bilgi almak istiyorum.")
  $('#mWa').hidden = !SITE.whatsapp;
  $('#mWa').href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('modal.wa.msg', { name: fullName(f) }))}`;
  // Aynı türden diğer çeşitler (en fazla 4)
  const benzer = inCategory(f.category).filter(x => x.id !== f.id).slice(0, 4);
  $('#mRelated').hidden = !benzer.length;
  $('#mRelList').innerHTML = benzer.map(x => `
    <button class="related__item" type="button" data-open="${x.id}">
      <img src="${kucuk(fidanImg(x))}" alt="" loading="lazy" width="120" height="120">
      <span>${esc(localize(x).title)}</span>
    </button>`).join('');
}

function ac(id) {
  const f = byId(id);
  if (!f) return;
  acik = f;
  doldur(f);
  metaGuncelle();
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
  modal.querySelector('.modal__body').scrollTop = 0;
  history.replaceState(null, '', adres({ fidan: f.id }));
}

grid.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o) ac(o.dataset.open);
});
modal.addEventListener('click', e => {
  const r = e.target.closest('.related__item[data-open]');
  if (r) return ac(r.dataset.open);
  if (e.target === modal || e.target.closest('[data-close]')) modal.close();
});
modal.addEventListener('close', () => { acik = null; history.replaceState(null, '', adres()); metaGuncelle(); });

/* ---------- Geri / ileri tuşu ve dil değişimi ---------- */
window.addEventListener('popstate', () => {
  const { key, fidan } = adresiOku();
  aktif = key;
  aramayiTemizle();
  ciz();
  if (fidan) ac(fidan); else if (modal.open) modal.close();
});

document.addEventListener('langchange', () => {
  cipler();
  ciz();
  if (acik) doldur(acik);
});

/* ---------- Başlat ---------- */
const ilk = adresiOku();
// Üst menüdeki aramadan gelindiyse (catalog.html?ara=mandalina) arama kutusunu doldur
function aramaYap(s) {
  input.value = s;
  aranan = s.trim();
  search.classList.toggle('has-value', aranan.length > 0);
}
const gelenArama = new URLSearchParams(location.search).get('ara');
if (gelenArama) aramaYap(gelenArama);
// Bu sayfadayken üst menüden arama yapılırsa sayfayı yenilemeden sonuçları göster
document.querySelector('.nav-search')?.addEventListener('submit', e => {
  const s = e.currentTarget.querySelector('input').value.trim();
  if (!s) return;
  e.preventDefault();
  aramaYap(s);
  ciz();
  e.currentTarget.classList.remove('is-open');
  yukariKaydir();
});
aktif = ilk.key;
if (ilk.fidan && !aktif) aktif = byId(ilk.fidan)?.category ?? null; // ana sayfadaki karttan gelindiyse o kategoriyi aç
cipler();
ciz();
if (ilk.fidan) ac(ilk.fidan); else history.replaceState(null, '', adres());
