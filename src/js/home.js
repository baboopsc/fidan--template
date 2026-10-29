/* Ana sayfa — fotoğraf slaytı, fidan türleri (kategori kartları), öne çıkan çeşitler */
import './ui.js';
import { FIDANLAR, visibleCategories, inCategory, imgFor, kategoriImg, TESIS_FOTOLARI, GALERI_FOTOLARI, kucuk } from './data.js';
import { cat, catDesc, t } from './i18n.js';
import { cardHTML } from './product-card.js';
import { esc } from './utils.js';

const FAVORI = [15, 7, 11, 19, 20, 35, 23, 25]; // Öne çıkan çeşitlerin id'leri (js/fidanlar.js)

/* ---------- Fidanlık fotoğrafları ----------
   src/img/tesis klasöründe (yoksa src/img/galeri'de) fotoğraf varsa slayttaki ve bölümlerdeki
   yer tutucu (kategori) fotoğrafların yerine onlar konur. */
const URETIM_FOTOLARI = TESIS_FOTOLARI.length ? TESIS_FOTOLARI : GALERI_FOTOLARI;
const slides = document.getElementById('heroSlides');
const dots = document.getElementById('heroDots');

if (URETIM_FOTOLARI.length) {
  const ilk = slides.querySelector('img');
  const ayni = u => new URL(u, location.href).href === ilk.src;
  // HTML'deki ilk fotoğraf listenin ilkiyse olduğu gibi kalır; diğer 4 fotoğraf sayfa açıldıktan sonra yüklenir
  if (!ayni(URETIM_FOTOLARI[0])) ilk.src = URETIM_FOTOLARI[0];
  const liste = URETIM_FOTOLARI.slice(1, 5);
  slides.insertAdjacentHTML('beforeend', liste.map(src => `<img data-src="${src}" alt="" width="900" height="1100" decoding="async">`).join(''));
  const sonrakiler = () => slides.querySelectorAll('img[data-src]').forEach(k => { k.src = k.dataset.src; k.removeAttribute('data-src'); });
  if (document.readyState === 'complete') setTimeout(sonrakiler, 1500);
  else addEventListener('load', () => setTimeout(sonrakiler, 1500), { once: true });
  // Bölümlerdeki fotoğraflar: data-photo="1" -> 2. fotoğraf ... (yeterli fotoğraf yoksa baştan döner); küçük kopyaları
  document.querySelectorAll('[data-photo]').forEach(img => {
    img.src = kucuk(URETIM_FOTOLARI[Number(img.dataset.photo) % URETIM_FOTOLARI.length]);
  });
}

/* ---------- Slayt: 5 saniyede bir yumuşak geçiş ---------- */
const kareler = [...slides.querySelectorAll('img')];
let sira = 0, zamanlayici;

function goster(i) {
  sira = (i + kareler.length) % kareler.length;
  const k = kareler[sira];
  if (k.dataset.src) { k.src = k.dataset.src; k.removeAttribute('data-src'); }
  kareler.forEach((k, j) => k.classList.toggle('is-active', j === sira));
  dots.querySelectorAll('button').forEach((d, j) => d.setAttribute('aria-selected', j === sira));
}
function baslat() {
  clearInterval(zamanlayici);
  if (kareler.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches)
    zamanlayici = setInterval(() => goster(sira + 1), 5000);
}
function noktalar() {
  dots.hidden = kareler.length < 2;
  dots.innerHTML = kareler.map((_, i) =>
    `<button type="button" role="tab" aria-selected="${i === sira}" aria-label="${esc(t('hero.slide', { n: i + 1 }))}"></button>`).join('');
}
dots.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  goster([...dots.children].indexOf(b));
  baslat();
});

/* ---------- Fidan türleri: her kategori için bir kart ---------- */
const catGrid = document.getElementById('homeCats');

function kategoriler() {
  catGrid.innerHTML = visibleCategories().map((c, i) => {
    const n = inCategory(c.key).length;
    return `
      <a class="cat-card" href="./catalog.html?kategori=${c.slug}" style="--tint:${c.tint};--i:${i}">
        <span class="cat-card__media has-photo">
          <img src="${kucuk(kategoriImg(c))}" alt="" loading="lazy" width="600" height="450">
          <span class="cat-card__count">${esc(t('varieties', { n }))}</span>
        </span>
        <span class="cat-card__body">
          <span class="cat-card__text">
            <span class="cat-card__title">${esc(cat(c.key))}</span>
            <span class="cat-card__desc">${esc(catDesc(c))}</span>
          </span>
          <span class="more-btn" aria-hidden="true"><i class="i i-arrow-right"></i></span>
        </span>
      </a>`;
  }).join('');
}

/* ---------- Öne çıkan çeşitler ---------- */
const favGrid = document.getElementById('favGrid');

function favoriler() {
  favGrid.innerHTML = FAVORI.map(id => FIDANLAR.find(f => f.id === id)).filter(Boolean)
    .map((f, i) => cardHTML(f, { link: true, i })).join('');
}

// Dil değişince kartlar ve slayt düğmeleri yeni dille yeniden çizilir
document.addEventListener('langchange', () => { kategoriler(); favoriler(); noktalar(); });

kategoriler();
favoriler();
noktalar();
baslat();
