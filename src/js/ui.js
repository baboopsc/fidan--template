/* ==========================================================
   Ortak sayfa davranışları — her sayfanın JS'i bu dosyayı içe aktarır.
   Menü, aktif sayfa, sepet rozeti, "sepete ekle" düğmeleri,
   kaydırınca beliren öğeler ve sayaçlar.
   ========================================================== */
import { addToCart, updateBadge, CART_KEY } from './cart.js';

/* ---------- Üst menü ---------- */
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');

function markActivePage() {
  const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('[data-page]').forEach(a => {
    if (a.dataset.page === page) a.setAttribute('aria-current', 'page');
  });
}

const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });

toggle?.addEventListener('click', () => {
  const open = header.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.querySelector('.i')?.classList.replace(open ? 'i-menu' : 'i-close', open ? 'i-close' : 'i-menu');
});
document.addEventListener('click', e => {
  if (header?.classList.contains('is-open') && !e.target.closest('.nav')) toggle?.click();
});

/* ---------- "Sepete ekle" düğmeleri: data-add="id" (isteğe bağlı data-qty) ---------- */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (!btn || !btn.dataset.add) return;
  addToCart(btn.dataset.add, Number(btn.dataset.qty) || 1);
  const icon = btn.querySelector('.i');
  btn.classList.add('is-done');
  icon?.classList.replace('i-bag', 'i-check');
  setTimeout(() => { btn.classList.remove('is-done'); icon?.classList.replace('i-check', 'i-bag'); }, 1300);
});

/* ---------- Kaydırınca beliren öğeler ve sayaçlar ---------- */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = (el.dataset.count.split('.')[1] || '').length;
  const fmt = n => (el.dataset.prefix || '') + n.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (el.dataset.suffix || '');
  if (reduced) { el.textContent = fmt(target); return; }
  const start = performance.now(), duration = 1500;
  const step = now => {
    const p = Math.min(1, (now - start) / duration);
    el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      observer.unobserve(en.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  : null;

export function reveal(root = document) {
  root.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => (observer ? observer.observe(el) : el.classList.add('is-in')));
}

/* ---------- Başlat ---------- */
markActivePage();
onScroll();
updateBadge();
reveal();
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
window.addEventListener('storage', e => { if (e.key === CART_KEY) updateBadge(); });
