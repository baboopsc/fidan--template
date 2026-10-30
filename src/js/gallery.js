/* Fotoğraf galerisi — "Tesislerimiz" ve "Galeri" sayfaları kullanır.
   galeriKur(fotolar): #gallery içine fotoğrafları çizer; fotoğraf yoksa #galleryEmpty görünür.
   Fotoğrafa basınca tam ekran görüntüleyici açılır (js/viewer.js). */
import { t } from './i18n.js';
import { kucuk } from './data.js';
import { ac as goruntuleyici } from './viewer.js';

export function galeriKur(fotolar) {
  const gallery = document.getElementById('gallery');
  const empty = document.getElementById('galleryEmpty');

  function ciz() {
    empty.hidden = fotolar.length > 0;
    gallery.innerHTML = fotolar.map((src, i) => `
      <button class="gallery__item" type="button" data-i="${i}" style="--i:${i}" aria-label="${t('gallery.open', { n: i + 1 })}">
        <img src="${kucuk(src)}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async">
      </button>`).join('');
  }

  gallery.addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const baslik = document.querySelector('.page-hero h1')?.textContent.trim() || '';
    goruntuleyici(fotolar.map(src => ({ src, thumb: kucuk(src) })), Number(b.dataset.i), baslik);
  });

  document.addEventListener('langchange', ciz);
  ciz();
}
