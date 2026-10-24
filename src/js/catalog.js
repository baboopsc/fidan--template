/* ==========================================================
   Fidanlar sayfası
   1) Kategoriler: her meyve türü için bir kart (Mandalina, Portakal ...)
   2) Kategori seçilince: o türün tüm çeşitleri (catalog.html?kategori=mandalina)
   3) Arama: tüm çeşitlerde arar
   4) Ürün penceresi: çeşidin tüm özellikleri (catalog.html?kategori=...&fidan=15)
   Geri tuşu ve paylaşılan bağlantılar çalışır.
   ========================================================== */
import './ui.js';
import { FIDANLAR, visibleCategories, inCategory, byId, imgFor, fidanImg, highlights, hasDetail } from './data.js';
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
    const src = imgFor(`kategori-${c.slug}`);
    const onizleme = liste.slice(0, 4).map(shortName).join(ayrac) + (liste.length > 4 ? '…' : '');
    return `
      <a class="cat-card" href="${adres({ key: c.key })}" data-key="${esc(c.key)}" style="--tint:${c.tint};--i:${i}">
        <span class="cat-card__media${src !== VARSAYILAN ? ' has-photo' : ''}">
          <img src="${src}" alt="" loading="lazy" width="600" height="450">
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

function doldur(f) {
  const L = localize(f);
  const detayli = hasDetail(f);
  $('#mImg').src = fidanImg(f);
  $('#mNote').hidden = fidanImg(f) === VARSAYILAN; // gerçek/üretilmiş görselde "Görsel temsilidir" notu
  $('#mImg').alt = fullName(f);
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
}

function ac(id) {
  const f = byId(id);
  if (!f) return;
  acik = f;
  doldur(f);
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
  if (e.target === modal || e.target.closest('[data-close]')) modal.close();
});
modal.addEventListener('close', () => { acik = null; history.replaceState(null, '', adres()); });

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
aktif = ilk.key;
if (ilk.fidan && !aktif) aktif = byId(ilk.fidan)?.category ?? null; // ana sayfadaki karttan gelindiyse o kategoriyi aç
cipler();
ciz();
if (ilk.fidan) ac(ilk.fidan); else history.replaceState(null, '', adres());
