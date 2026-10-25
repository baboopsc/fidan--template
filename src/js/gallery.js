/* Fotoğraf galerisi ve büyütme penceresi — "Tesislerimiz" ve "Galeri" sayfaları kullanır.
   galeriKur(fotolar): #gallery içine fotoğrafları çizer; fotoğraf yoksa #galleryEmpty görünür. */
import { t } from './i18n.js';

export function galeriKur(fotolar) {
  const gallery = document.getElementById('gallery');
  const empty = document.getElementById('galleryEmpty');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCount = document.getElementById('lbCount');
  let sira = 0, sonOdak = null;

  function ciz() {
    empty.hidden = fotolar.length > 0;
    gallery.innerHTML = fotolar.map((src, i) => `
      <button class="gallery__item" type="button" data-i="${i}" style="--i:${i}" aria-label="${t('gallery.open', { n: i + 1 })}">
        <img src="${src}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}">
      </button>`).join('');
  }

  function goster(i) {
    sira = (i + fotolar.length) % fotolar.length;
    lbImg.src = fotolar[sira];
    lbImg.alt = t('gallery.open', { n: sira + 1 });
    lbCount.textContent = `${sira + 1} / ${fotolar.length}`;
  }
  function ac(i) {
    sonOdak = document.activeElement;
    goster(i);
    lb.hidden = false;
    document.body.classList.add('modal-open');
    lb.querySelector('.lightbox__close').focus();
  }
  function kapat() {
    lb.hidden = true;
    document.body.classList.remove('modal-open');
    sonOdak?.focus();
  }

  gallery.addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (b) ac(Number(b.dataset.i));
  });
  lb.addEventListener('click', e => {
    const a = e.target.closest('[data-lb]')?.dataset.lb;
    if (a === 'close' || e.target === lb) kapat();
    // Arapçada (sağdan sola) önceki/sonraki yer değiştirir; düğmenin anlamı aynı kalır
    if (a === 'prev') goster(sira - 1);
    if (a === 'next') goster(sira + 1);
  });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    const rtl = document.documentElement.dir === 'rtl';
    if (e.key === 'Escape') kapat();
    if (e.key === 'ArrowRight') goster(sira + (rtl ? -1 : 1));
    if (e.key === 'ArrowLeft') goster(sira + (rtl ? 1 : -1));
  });
  // Telefonda parmakla kaydırma
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) goster(sira + (dx < 0 ? 1 : -1) * (document.documentElement.dir === 'rtl' ? -1 : 1));
    x0 = null;
  });

  document.addEventListener('langchange', ciz);
  ciz();
}
