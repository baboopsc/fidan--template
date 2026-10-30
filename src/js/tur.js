/* Tür sayfaları (ör. /mandalina-fidani/) — içerik HTML'de hazır gelir (Google için).
   Türkçe dışındaki dillerde başlık ve kartlar seçilen dilde yeniden çizilir. */
import './ui.js';
import { CATEGORIES, inCategory } from './data.js';
import { lang, cat, catDesc, t } from './i18n.js';
import { cardHTML } from './product-card.js';
import { hasatKur } from './hasat.js';

const key = document.body.dataset.tur;
const c = CATEGORIES.find(x => x.key === key);
const grid = document.getElementById('turGrid');
const asil = { grid: grid.innerHTML, h1: document.querySelector('.tur-baslik').innerHTML, giris: document.querySelector('.tur-giris').textContent, ad: document.querySelector('.tur-ad').textContent };

function ciz() {
  if (lang === 'tr') {
    grid.innerHTML = asil.grid;
    grid.classList.remove('p-grid', 'p-grid--3');
    document.querySelector('.tur-baslik').innerHTML = asil.h1;
    document.querySelector('.tur-giris').textContent = asil.giris;
    document.querySelector('.tur-ad').textContent = asil.ad;
    return;
  }
  grid.classList.add('p-grid', 'p-grid--3');
  grid.innerHTML = inCategory(key).map((f, i) => cardHTML(f, { link: true, i })).join('');
  document.querySelector('.tur-baslik').textContent = t('catTitle', { cat: cat(key) });
  document.querySelector('.tur-giris').textContent = catDesc(c);
  document.querySelector('.tur-ad').textContent = cat(key);
}
document.addEventListener('langchange', ciz);
ciz();

// Hasat takvimi yalnızca bu tür için (üstteki tür düğmeleri gizli)
const sec = hasatKur(document.getElementById('hasat'), id => { location.href = `/catalog.html?fidan=${id}`; });
sec?.(key);
