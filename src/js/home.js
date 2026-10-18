/* Ana sayfa — "Öne Çıkan Fidanlar" bölümü */
import './ui.js';
import { FIDANLAR, CATEGORIES } from './data.js';
import { cardHTML } from './product-card.js';

const FAVORI = [15, 7, 11, 19, 20, 35, 23, 25]; // Ana sayfada gösterilecek fidanların id'leri (data.js)

const grid = document.getElementById('favGrid');
const chips = document.getElementById('favChips');
let aktif = 'Tümü';

chips.innerHTML = CATEGORIES.map(c =>
  `<button type="button" class="chip${c === aktif ? ' is-active' : ''}" data-cat="${c}">${c}</button>`).join('');

function ciz() {
  const liste = FAVORI.map(id => FIDANLAR.find(f => f.id === id))
    .filter(f => f && (aktif === 'Tümü' || f.group === aktif));
  grid.innerHTML = liste.map((f, i) => cardHTML(f, { link: true, i })).join('');
}

chips.addEventListener('click', e => {
  const b = e.target.closest('[data-cat]');
  if (!b) return;
  aktif = b.dataset.cat;
  chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === b));
  ciz();
});

ciz();
