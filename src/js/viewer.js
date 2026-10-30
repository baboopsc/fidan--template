/* ==========================================================
   Fotoğraf görüntüleyici (ürün penceresi, Galeri ve Tesislerimiz kullanır)
   ac(ogeler, baslangic, baslik)
     ogeler: [{ src, thumb?, label? }]  (src: büyük fotoğraf, thumb: küçük kopya)
   - Telefonda: parmakla sağa/sola kaydır, iki parmakla ya da + düğmesiyle yakınlaştır,
     tek dokunuşla çubukları gizle, aşağı çekerek kapat
   - Bilgisayarda: oklar / ← → tuşları, tekerlekle ya da çift tıkla yakınlaştır, Esc ile kapat
   ========================================================== */
import { t } from './i18n.js';
import '../css/viewer.css';

const MAX = 4;          // en fazla yakınlaştırma
const CIFT = 2.5;       // çift tıklamada / düğmede yakınlaştırma
let dlg, track, viewport, bg, thumbs, ogeler = [], sira = 0;
let olcek = 1, tx = 0, ty = 0;

const rtl = () => document.documentElement.dir === 'rtl';
const $ = s => dlg.querySelector(s);

function kur() {
  dlg = document.createElement('dialog');
  dlg.className = 'vw';
  dlg.tabIndex = -1;
  dlg.innerHTML = `
    <div class="vw__bg" aria-hidden="true"></div>
    <header class="vw__top">
      <div class="vw__info"><span class="vw__label"></span><b class="vw__title"></b></div>
      <span class="vw__count" aria-live="polite"></span>
      <button class="vw__btn vw__zoom" type="button" data-vw="zoom"><i class="i i-plus"></i></button>
      <button class="vw__btn" type="button" data-vw="close"><i class="i i-close"></i></button>
    </header>
    <div class="vw__viewport"><div class="vw__track"></div></div>
    <button class="vw__btn vw__nav vw__prev" type="button" data-vw="prev"><i class="i i-chevron-left"></i></button>
    <button class="vw__btn vw__nav vw__next" type="button" data-vw="next"><i class="i i-chevron-right"></i></button>
    <p class="vw__hint"></p>
    <nav class="vw__thumbs"></nav>`;
  document.body.appendChild(dlg);
  track = $('.vw__track'); viewport = $('.vw__viewport'); bg = $('.vw__bg'); thumbs = $('.vw__thumbs');

  dlg.addEventListener('click', e => {
    const a = e.target.closest('[data-vw]')?.dataset.vw;
    if (a === 'close') kapat();
    if (a === 'prev') git(sira - 1);
    if (a === 'next') git(sira + 1);
    if (a === 'zoom') olcek > 1 ? sifirla(true) : yakinlas(CIFT, 0, 0);
    const k = e.target.closest('[data-vt]');
    if (k) git(Number(k.dataset.vt));
  });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') git(sira + (rtl() ? -1 : 1));
    if (e.key === 'ArrowLeft') git(sira + (rtl() ? 1 : -1));
  });
  dlg.addEventListener('close', () => { document.documentElement.classList.remove('vw-acik'); sifirla(); });
  viewport.addEventListener('wheel', e => {
    e.preventDefault();
    const r = viewport.getBoundingClientRect();
    yakinlas(olcek * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
  }, { passive: false });
  hareketler();
}

/* ---------- Gösterim ---------- */
const img = () => track.children[sira]?.querySelector('img');
function ciz() {
  track.innerHTML = ogeler.map((o, i) =>
    `<div class="vw__slide"><img src="${o.src}" alt="${o.label || ''}" draggable="false" decoding="async"${Math.abs(i - sira) > 1 ? ' loading="lazy"' : ''}></div>`).join('');
  thumbs.hidden = ogeler.length < 2;
  thumbs.innerHTML = ogeler.length < 2 ? '' : ogeler.map((o, i) =>
    `<button type="button" data-vt="${i}" aria-label="${t('gallery.open', { n: i + 1 })}"><img src="${o.thumb || o.src}" alt="" loading="lazy"></button>`).join('');
  dlg.querySelectorAll('.vw__nav').forEach(b => { b.hidden = ogeler.length < 2; });
}
function konum(animasyon = true) {
  track.style.transition = animasyon ? '' : 'none';
  track.style.transform = `translate3d(${(rtl() ? 1 : -1) * sira * 100}%,0,0)`;
}
function git(i) {
  if (ogeler.length < 2 && i !== sira) return;
  sifirla();
  sira = (i + ogeler.length) % ogeler.length;
  konum();
  const o = ogeler[sira];
  $('.vw__label').textContent = o.label || '';
  $('.vw__label').hidden = !o.label;
  $('.vw__count').textContent = ogeler.length > 1 ? `${sira + 1} / ${ogeler.length}` : '';
  bg.style.backgroundImage = `url("${o.thumb || o.src}")`;
  thumbs.querySelectorAll('button').forEach((b, j) => {
    b.toggleAttribute('aria-current', j === sira);
    if (j === sira) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
}

/* ---------- Yakınlaştırma ---------- */
function uygula(animasyon) {
  const el = img();
  if (!el) return;
  el.style.transition = animasyon ? 'transform .3s cubic-bezier(.2,.8,.2,1)' : 'none';
  el.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${olcek})`;
  dlg.classList.toggle('is-zoom', olcek > 1.01);
  $('.vw__zoom .i').className = `i ${olcek > 1.01 ? 'i-close' : 'i-plus'}`;
}
function sinirla() {
  const el = img();
  if (!el) return;
  const mx = Math.max(0, (el.offsetWidth * olcek - viewport.clientWidth) / 2);
  const my = Math.max(0, (el.offsetHeight * olcek - viewport.clientHeight) / 2);
  tx = Math.min(mx, Math.max(-mx, tx));
  ty = Math.min(my, Math.max(-my, ty));
}
// (px, py): yakınlaştırma noktasının ekran ortasına göre konumu; o nokta yerinde kalır
function yakinlas(yeni, px, py, animasyon = true) {
  yeni = Math.min(MAX, Math.max(1, yeni));
  tx = px - (px - tx) * (yeni / olcek);
  ty = py - (py - ty) * (yeni / olcek);
  olcek = yeni;
  if (olcek === 1) { tx = 0; ty = 0; }
  sinirla();
  uygula(animasyon);
}
function sifirla(animasyon = false) { olcek = 1; tx = 0; ty = 0; uygula(animasyon); }

/* ---------- Parmak / fare hareketleri ---------- */
function hareketler() {
  const p = new Map();
  let bas = null, mod = null, pinch = null, sonDokunus = 0, sonXY = [0, 0];
  const merkez = (x, y) => { const r = viewport.getBoundingClientRect(); return [x - r.left - r.width / 2, y - r.top - r.height / 2]; };

  viewport.addEventListener('pointerdown', e => {
    viewport.setPointerCapture(e.pointerId);
    p.set(e.pointerId, [e.clientX, e.clientY]);
    if (p.size === 2) {
      const [a, b] = [...p.values()];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), olcek, m: merkez((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) };
      mod = 'pinch';
    } else {
      bas = { x: e.clientX, y: e.clientY, tx, ty, t: performance.now() };
      mod = null;
    }
  });
  viewport.addEventListener('pointermove', e => {
    if (!p.has(e.pointerId)) return;
    p.set(e.pointerId, [e.clientX, e.clientY]);
    if (mod === 'pinch' && p.size === 2) {
      const [a, b] = [...p.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      yakinlas(pinch.olcek * d / pinch.d, pinch.m[0], pinch.m[1], false);
      return;
    }
    if (!bas || p.size !== 1) return;
    const dx = e.clientX - bas.x, dy = e.clientY - bas.y;
    if (!mod) {
      if (Math.hypot(dx, dy) < 8) return;
      mod = olcek > 1.01 ? 'pan' : Math.abs(dx) > Math.abs(dy) ? 'kaydir' : 'cek';
    }
    if (mod === 'pan') { tx = bas.tx + dx; ty = bas.ty + dy; sinirla(); uygula(false); }
    if (mod === 'kaydir') {
      track.style.transition = 'none';
      track.style.transform = `translate3d(calc(${(rtl() ? 1 : -1) * sira * 100}% + ${dx}px),0,0)`;
    }
    if (mod === 'cek' && dy > 0) {
      const el = img();
      if (el) { el.style.transition = 'none'; el.style.transform = `translate3d(0,${dy}px,0) scale(${1 - Math.min(dy, 300) / 1500})`; }
      dlg.style.setProperty('--vw-alpha', String(Math.max(0.25, 1 - dy / 400)));
    }
  });
  const bitir = e => {
    if (!p.has(e.pointerId)) return;
    p.delete(e.pointerId);
    if (mod === 'pinch') {
      if (p.size === 0) { if (olcek < 1.05) sifirla(true); mod = null; bas = null; }
      else { const [k] = p.values(); bas = { x: k[0], y: k[1], tx, ty, t: performance.now() }; mod = 'pan'; }
      return;
    }
    if (!bas) return;
    const dx = e.clientX - bas.x, dy = e.clientY - bas.y, sure = performance.now() - bas.t;
    if (mod === 'kaydir') {
      const hizli = Math.abs(dx) / sure > 0.5;
      if (Math.abs(dx) > viewport.clientWidth * 0.18 || (hizli && Math.abs(dx) > 30)) git(sira + (dx < 0 ? 1 : -1) * (rtl() ? -1 : 1));
      else konum();
    } else if (mod === 'cek') {
      dlg.style.removeProperty('--vw-alpha');
      if (dy > 110) kapat(); else uygula(true);
    } else if (!mod) {
      if (e.pointerType === 'mouse') {
        // Fare: çift tıklayınca o noktaya yakınlaş; fotoğrafın dışına tıklayınca kapat
        const simdi = performance.now();
        if (simdi - sonDokunus < 300 && Math.hypot(e.clientX - sonXY[0], e.clientY - sonXY[1]) < 20) {
          const [x, y] = merkez(e.clientX, e.clientY);
          olcek > 1.01 ? sifirla(true) : yakinlas(CIFT, x, y);
          sonDokunus = 0;
        } else {
          sonDokunus = simdi; sonXY = [e.clientX, e.clientY];
          if (!e.target.closest('img') && olcek <= 1.01) setTimeout(() => { if (sonDokunus === simdi) kapat(); }, 300);
        }
      } else if (sure < 350) {
        // Dokunmatik: tek dokunuş yalnızca üst/alt çubukları gizler-gösterir (yanlışlıkla yakınlaşma ya da kapanma olmaz)
        dlg.classList.toggle('vw--sade');
      }
    }
    mod = null; bas = null;
  };
  viewport.addEventListener('pointerup', bitir);
  viewport.addEventListener('pointercancel', bitir);
}

/* ---------- Aç / kapat ---------- */
function etiketler() {
  const a = (sel, k) => dlg.querySelector(sel).setAttribute('aria-label', t(k));
  dlg.setAttribute('aria-label', t('gallery.photo'));
  a('[data-vw="close"]', 'modal.close');
  a('[data-vw="prev"]', 'gallery.prev');
  a('[data-vw="next"]', 'gallery.next');
  a('[data-vw="zoom"]', 'viewer.zoom');
  $('.vw__hint').textContent = t(matchMedia('(pointer: coarse)').matches ? 'viewer.hint' : 'viewer.hintDesk');
}
export function ac(liste, baslangic = 0, baslik = '') {
  if (!liste.length) return;
  if (!dlg) kur();
  ogeler = liste;
  sira = Math.min(Math.max(0, baslangic), liste.length - 1);
  etiketler();
  $('.vw__title').textContent = baslik;
  ciz();
  konum(false);
  git(sira);
  // ipucu yalnızca ilk açılışta, kısa süre görünür
  let gosterildi = false;
  try { gosterildi = sessionStorage.getItem('vw-ipucu') === '1'; sessionStorage.setItem('vw-ipucu', '1'); } catch { /* gizli sekme */ }
  dlg.classList.toggle('vw--ipucu', !gosterildi);
  dlg.classList.remove('vw--sade');
  document.documentElement.classList.add('vw-acik');
  dlg.showModal();
  dlg.focus({ preventScroll: true }); // odak çerçevesi kapat düğmesinde görünmesin
}
export function kapat() {
  if (!dlg?.open) return;
  dlg.classList.add('is-closing');
  setTimeout(() => { dlg.classList.remove('is-closing'); dlg.close(); }, 200);
}
