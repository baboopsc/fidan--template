/* Fidanlar sayfası — arama, kategori filtresi ve ürün penceresi */
import './ui.js';
import { FIDANLAR, CATEGORIES, byId, imgFor, fullName } from './data.js';
import { cardHTML } from './product-card.js';
import { tl, sade, esc } from './utils.js';

const $ = s => document.querySelector(s);
const grid = $('#grid'), chips = $('#chips'), count = $('#count'), empty = $('#empty');
const search = $('#search'), input = $('#q');
let aktif = 'Tümü', aranan = '';

/* ---------- Liste ve filtreler ---------- */
chips.innerHTML = CATEGORIES.map(c =>
  `<button type="button" class="chip${c === aktif ? ' is-active' : ''}" data-cat="${c}">${c}</button>`).join('');

function ciz() {
  const liste = FIDANLAR.filter(f =>
    (aktif === 'Tümü' || f.group === aktif) &&
    sade(`${f.title} ${f.variety} ${f.category} ${f.group}`).includes(sade(aranan)));
  grid.innerHTML = liste.map((f, i) => cardHTML(f, { i })).join('');
  count.textContent = liste.length ? `${liste.length} fidan listeleniyor` : '';
  empty.hidden = liste.length > 0;
}

function kategoriSec(cat) {
  aktif = cat;
  chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c.dataset.cat === cat));
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

/* ---------- Ürün penceresi ---------- */
const modal = $('#modal');
let secili = null, adet = 1;

function fiyatYaz() {
  $('#mQty').textContent = adet;
  $('#mPrice').textContent = tl(secili.price * adet);
  $('#mAdd').dataset.qty = adet;
  $('#mMinus').disabled = adet <= 1;
}

function ac(id) {
  secili = byId(id);
  if (!secili) return;
  adet = 1;
  $('#mImg').src = imgFor(secili.slug);
  $('#mImg').alt = fullName(secili);
  $('#mCat').textContent = secili.category;
  $('#mTitle').textContent = secili.title;
  $('#mVariety').textContent = secili.variety;
  $('#mDesc').textContent = secili.desc;
  $('#mFacts').innerHTML = secili.facts
    .map(([ikon, baslik, deger]) => `<div class="fact"><i class="i i-${ikon}"></i>${esc(baslik)}<b>${esc(deger)}</b></div>`).join('');
  $('#mAdd').dataset.add = secili.id;
  fiyatYaz();
  modal.showModal();
}

grid.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o) ac(o.dataset.open);
});
$('#mMinus').addEventListener('click', () => { if (adet > 1) { adet--; fiyatYaz(); } });
$('#mPlus').addEventListener('click', () => { adet++; fiyatYaz(); });
$('#mAdd').addEventListener('click', () => setTimeout(() => modal.close(), 450)); // ekleme ui.js'te yapılır
modal.addEventListener('click', e => {
  if (e.target === modal || e.target.closest('[data-close]')) modal.close();
});

ciz();

// Ana sayfadaki karttan gelindiyse o fidanın penceresini aç (catalog.html?fidan=5)
const gelen = new URLSearchParams(location.search).get('fidan');
if (gelen) ac(gelen);
