/* ==========================================================
   Ortak sayfa davranışları — her sayfanın JS'i bu dosyayı içe aktarır.
   Dil, menü, aktif sayfa, sosyal medya bağlantıları,
   kaydırınca beliren öğeler ve sayaçlar.
   ========================================================== */
import './i18n.js'; // dil seçimi ve sayfa çevirileri
import { SITE, visibleCategories, imgFor, kategoriImg, inCategory, byId, kucuk } from './data.js';
import { cat, t, localize } from './i18n.js';
import { esc } from './utils.js';

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

/* ---------- Instagram / Facebook ----------
   <a data-social="instagram"> bağlantıları adresini data.js'teki SITE'tan alır.
   Adres boşsa bağlantı (ya da data-social-box ile işaretli kutusu) gizli kalır;
   içinde görünen bağlantı kalmayan data-social-wrap alanı da gizlenir.
   data-social="whatsapp" bağlantıları SITE.whatsapp numarasından wa.me adresi alır. */
const socialUrl = key => key === 'whatsapp' ? (SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : '') : SITE[key];
export function applySocial(root = document) {
  root.querySelectorAll('[data-social]').forEach(a => {
    const url = socialUrl(a.dataset.social);
    if (url) a.href = url;
    (a.closest('[data-social-box]') || a).hidden = !url;
  });
  root.querySelectorAll('[data-social-wrap]').forEach(w => {
    w.hidden = ![...w.querySelectorAll('[data-social]')].some(a => socialUrl(a.dataset.social));
  });
}

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

/* ---------- Alt bilgideki "Fidan çeşitleri" listesi ----------
   En çok çeşidi olan ilk 6 kategori, küçük fotoğrafıyla. */
function footerCats() {
  const ul = document.getElementById('footerCats');
  if (!ul) return;
  const liste = visibleCategories().map(c => ({ c, n: inCategory(c.key).length }))
    .sort((a, b) => b.n - a.n).slice(0, 6);
  ul.innerHTML = liste.map(({ c }) => `
    <li><a class="footer-cat" href="./catalog.html?kategori=${c.slug}">
      <img src="${kucuk(kategoriImg(c))}" alt="" width="40" height="40" loading="lazy">
      <span>${esc(cat(c.key))}</span></a></li>`).join('');
}
document.addEventListener('langchange', footerCats);

/* ---------- Teklif formu (partials/footer.html) ----------
   data-quote taşıyan her buton formu açar. data-quote="15" gibi bir fidan id'si verilirse
   tür ve çeşit kendiliğinden dolar (Fidanlar sayfasındaki ürün penceresi).
   Gönder deyince bilgiler hazır bir mesaj olarak WhatsApp'ta açılır; hiçbir yere kaydedilmez. */
const quote = document.getElementById('quoteDialog');
const qForm = document.getElementById('quoteForm');
const qType = document.getElementById('quoteType');

function turleriDoldur() {
  if (!qType) return;
  const secili = qType.value;
  qType.innerHTML = `<option value="">${esc(t('quote.type.any'))}</option>` +
    visibleCategories().map(c => `<option value="${esc(c.key)}">${esc(cat(c.key))}</option>`).join('');
  qType.value = secili;
}

function teklifAc(fidanId) {
  if (header?.classList.contains('is-open')) toggle?.click();
  const f = fidanId ? byId(fidanId) : null;
  if (f) {
    qType.value = f.category;
    qForm.elements.cesit.value = localize(f).title;
  }
  document.getElementById('quoteError').hidden = true;
  quote.showModal();
  setTimeout(() => qForm.elements.ad.focus(), 50);
}

if (quote) {
  // WhatsApp numarası yoksa gönder butonu gizlenir, yalnızca "Arayarak sorun" kalır
  qForm.querySelector('[type="submit"]').hidden = !SITE.whatsapp;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-quote]');
    if (b) { e.preventDefault(); teklifAc(b.dataset.quote); }
  });
  quote.addEventListener('click', e => {
    if (e.target === quote || e.target.closest('[data-quote-close]')) quote.close();
  });
  qForm.addEventListener('submit', e => {
    e.preventDefault();
    const v = name => qForm.elements[name].value.trim();
    if (!v('ad')) {
      document.getElementById('quoteError').hidden = false;
      qForm.elements.ad.focus();
      return;
    }
    const satirlar = [
      t('quote.msg.hello'),
      `${t('quote.msg.name')}: ${v('ad')}`,
      v('tur') && `${t('quote.type')}: ${cat(v('tur'))}`,
      v('cesit') && `${t('quote.msg.variety')}: ${v('cesit')}`,
      v('adet') && `${t('quote.qty')}: ${v('adet')}`,
      v('yer') && `${t('quote.place')}: ${v('yer')}`,
      v('not') && `${t('quote.note')}: ${v('not')}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(satirlar.join('\n'))}`, '_blank', 'noopener');
    quote.close();
  });
  document.addEventListener('langchange', turleriDoldur);
  turleriDoldur();
}

/* ---------- Başlat ---------- */
footerCats();
markActivePage();
onScroll();
applySocial();
reveal();
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
