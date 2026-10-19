/* Fidanlar sayfası — arama, kategori filtresi ve ürün penceresi */
import './ui.js';
import { FIDANLAR, CATEGORIES, byId, imgFor, highlights } from './data.js';
import { localize, fullName, cat, t } from './i18n.js';
import { cardHTML } from './product-card.js';
import { sade, esc } from './utils.js';

const $ = s => document.querySelector(s);
const grid = $('#grid'), chips = $('#chips'), count = $('#count'), empty = $('#empty');
const search = $('#search'), input = $('#q');
let aktif = 'Tümü', aranan = '';

/* ---------- Liste ve filtreler ---------- */
function cipleriCiz() {
  chips.innerHTML = CATEGORIES.map(c =>
    `<button type="button" class="chip${c === aktif ? ' is-active' : ''}" data-cat="${c}">${cat(c)}</button>`).join('');
}

function ciz() {
  const q = sade(aranan);
  const liste = FIDANLAR.filter(f => {
    const L = localize(f);
    // Hem seçili dilde hem Türkçe ad ile aranabilir
    return (aktif === 'Tümü' || f.category === aktif) &&
      sade(`${L.title} ${L.category} ${f.title} ${f.category} ${f.group}`).includes(q);
  });
  grid.innerHTML = liste.map((f, i) => cardHTML(f, { i })).join('');
  count.textContent = liste.length ? t('count', { n: liste.length }) : '';
  empty.hidden = liste.length > 0;
}

function kategoriSec(c) {
  aktif = c;
  chips.querySelectorAll('.chip').forEach(b => b.classList.toggle('is-active', b.dataset.cat === c));
  ciz();
}

function aramayiTemizle() {
  input.value = '';
  aranan = '';
  search.classList.remove('has-value');
}

chips.addEventListener('click', e => {
  const b = e.target.closest('[data-cat]');
  if (b) kategoriSec(b.dataset.cat);
});
input.addEventListener('input', () => {
  aranan = input.value.trim();
  search.classList.toggle('has-value', aranan.length > 0);
  ciz();
});
$('#clear').addEventListener('click', () => { aramayiTemizle(); ciz(); input.focus(); });
$('#reset').addEventListener('click', () => { aramayiTemizle(); kategoriSec('Tümü'); });

/* ---------- Ürün penceresi: tüm özellikler ---------- */
const modal = $('#modal');
let acik = null;

function doldur(f) {
  const L = localize(f);
  $('#mImg').src = imgFor(f.slug);
  $('#mImg').alt = fullName(f);
  $('#mCat').textContent = L.category;
  $('#mTitle').textContent = L.title;
  $('#mDesc').textContent = L.desc;
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
  modal.showModal();
  modal.scrollTop = 0;
  modal.querySelector('.modal__body').scrollTop = 0;
  history.replaceState(null, '', `?fidan=${f.id}`);
}

grid.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o) ac(o.dataset.open);
});
modal.addEventListener('click', e => {
  if (e.target === modal || e.target.closest('[data-close]')) modal.close();
});
modal.addEventListener('close', () => { acik = null; history.replaceState(null, '', location.pathname); });

// Dil değişince çipler, kartlar ve açık pencere yeni dille yeniden çizilir
document.addEventListener('langchange', () => {
  cipleriCiz();
  ciz();
  if (acik) doldur(acik);
});

cipleriCiz();
ciz();

// Ana sayfadaki karttan ya da paylaşılan bağlantıdan gelindiyse o fidanın penceresini aç (catalog.html?fidan=15)
const gelen = new URLSearchParams(location.search).get('fidan');
if (gelen) ac(gelen);
