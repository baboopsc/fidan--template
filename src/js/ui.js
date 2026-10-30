/* ==========================================================
   Ortak sayfa davranışları — her sayfanın JS'i bu dosyayı içe aktarır.
   Dil, menü, aktif sayfa, sosyal medya bağlantıları,
   kaydırınca beliren öğeler ve sayaçlar.
   ========================================================== */
import './i18n.js'; // dil seçimi ve sayfa çevirileri
import { SITE, visibleCategories, imgFor, kategoriImg, inCategory, byId, kucuk, fidanImg } from './data.js';
import { cat, t, localize, fullName } from './i18n.js';
import { listeAl, ekle, cikar, adetYaz, temizle } from './liste.js';
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

/* ---------- Üst menüde fidan arama ---------- */
const araForm = document.querySelector('.nav-search');
const araKutu = araForm?.querySelector('input');
const araBtn = araForm?.querySelector('button');
function aramaAc(acik) {
  araForm.classList.toggle('is-open', acik);
  araBtn.setAttribute('aria-expanded', acik);
  if (acik && header?.classList.contains('is-open')) toggle?.click(); // telefonda açık menüyü kapat
  if (acik) araKutu.focus(); else araKutu.blur();
}
araBtn?.addEventListener('click', () => {
  if (!araForm.classList.contains('is-open')) return aramaAc(true);
  if (araKutu.value.trim()) araForm.requestSubmit(); else aramaAc(false);
});
araForm?.addEventListener('submit', e => { if (!araKutu.value.trim()) { e.preventDefault(); araKutu.focus(); } });
araKutu?.addEventListener('keydown', e => { if (e.key === 'Escape') aramaAc(false); });
document.addEventListener('click', e => { if (araForm?.classList.contains('is-open') && !araForm.contains(e.target)) aramaAc(false); });

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
    <li><a class="footer-cat" href="/${c.slug}-fidani/">
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

const qListe = document.getElementById('quoteList');

// Formun üstündeki liste: her çeşit için adet kutusu ve "çıkar" düğmesi
function listeCiz() {
  if (!qListe) return;
  const l = listeAl().map(x => ({ ...x, f: byId(x.id) })).filter(x => x.f);
  quote.classList.toggle('has-list', l.length > 0);
  qListe.hidden = !l.length;
  qListe.querySelector('.qlist__items').innerHTML = l.map(({ f, adet }) => `
    <li class="qlist__item">
      <img src="${kucuk(fidanImg(f))}" alt="" width="44" height="44" loading="lazy">
      <span class="qlist__name">${esc(localize(f).title)}<small>${esc(cat(f.category))}</small></span>
      <input type="number" min="1" inputmode="numeric" value="${esc(adet)}" data-adet="${f.id}" placeholder="${esc(t('quote.qty'))}" aria-label="${esc(t('quote.qty'))}: ${esc(localize(f).title)}">
      <button type="button" class="qlist__remove" data-cikar="${f.id}" aria-label="${esc(t('list.remove'))}"><i class="i i-close"></i></button>
    </li>`).join('');
  qListe.querySelector('.qlist__count').textContent = t('list.count', { n: l.length });
}

// "Teklif İste" düğmelerinde listedeki çeşit sayısı rozeti
function rozetler() {
  const n = listeAl().length;
  document.querySelectorAll('[data-quote=""]').forEach(b => {
    let r = b.querySelector('.q-badge');
    if (!n) return r?.remove();
    if (!r) { r = document.createElement('span'); r.className = 'q-badge'; b.appendChild(r); }
    r.textContent = n;
  });
}

function teklifAc(fidanId) {
  if (header?.classList.contains('is-open')) toggle?.click();
  const f = fidanId ? byId(fidanId) : null;
  if (f && listeAl().length) ekle(f.id);          // liste varsa çeşit listeye eklenir
  else if (f) {
    qType.value = f.category;
    qForm.elements.cesit.value = localize(f).title;
  }
  listeCiz();
  document.getElementById('quoteError').hidden = true;
  quote.showModal();
  setTimeout(() => qForm.elements.ad.focus(), 50);
}

/* Listeye eklenince kısa bildirim: "Washington Navel Portakal teklif listesine eklendi · Teklif iste" */
let bildirimZaman;
export function bildir(metin) {
  let b = document.getElementById('toast');
  if (!b) {
    b = document.createElement('div');
    b.id = 'toast'; b.className = 'toast'; b.setAttribute('role', 'status');
    b.innerHTML = '<i class="i i-check"></i><span class="toast__text"></span><button type="button" class="toast__btn" data-quote=""></button>';
    document.body.appendChild(b);
  }
  b.querySelector('.toast__text').textContent = metin;
  b.querySelector('.toast__btn').textContent = t('list.open');
  b.classList.add('is-on');
  clearTimeout(bildirimZaman);
  bildirimZaman = setTimeout(() => b.classList.remove('is-on'), 4200);
}

if (quote) {
  // WhatsApp numarası yoksa gönder butonu gizlenir, yalnızca "Arayarak sorun" kalır
  qForm.querySelector('[type="submit"]').hidden = !SITE.whatsapp;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-quote]');
    if (b) { e.preventDefault(); document.getElementById('toast')?.classList.remove('is-on'); teklifAc(b.dataset.quote); }
  });
  quote.addEventListener('click', e => {
    if (e.target === quote || e.target.closest('[data-quote-close]')) quote.close();
    const c = e.target.closest('[data-cikar]');
    if (c) cikar(c.dataset.cikar);
    if (e.target.closest('[data-temizle]')) temizle();
  });
  quote.addEventListener('input', e => { if (e.target.dataset.adet) adetYaz(e.target.dataset.adet, e.target.value.trim()); });
  qForm.addEventListener('submit', e => {
    e.preventDefault();
    const v = name => qForm.elements[name].value.trim();
    if (!v('ad')) {
      document.getElementById('quoteError').hidden = false;
      qForm.elements.ad.focus();
      return;
    }
    const l = listeAl().map(x => ({ ...x, f: byId(x.id) })).filter(x => x.f);
    const satirlar = [
      t('quote.msg.hello'),
      `${t('quote.msg.name')}: ${v('ad')}`,
      ...(l.length
        ? [`${t('list.msg')}:`, ...l.map(({ f, adet }) => `• ${fullName(f)}${adet ? ` — ${adet} ${t('list.unit')}` : ''}`)]
        : [
          v('tur') && `${t('quote.type')}: ${cat(v('tur'))}`,
          v('cesit') && `${t('quote.msg.variety')}: ${v('cesit')}`,
          v('adet') && `${t('quote.qty')}: ${v('adet')}`,
        ]),
      v('yer') && `${t('quote.place')}: ${v('yer')}`,
      v('not') && `${t('quote.note')}: ${v('not')}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(satirlar.join('\n'))}`, '_blank', 'noopener');
    quote.close();
  });
  document.addEventListener('langchange', () => { turleriDoldur(); listeCiz(); });
  document.addEventListener('listechange', () => { listeCiz(); rozetler(); });
  turleriDoldur();
  rozetler();
}

/* ---------- Çalışma saatleri: "Şu an açığız · 18:00'e kadar" / "Şu an kapalıyız · 09:00'da açılıyoruz" ---------- */
function saatDurumu() {
  const h = SITE.hours;
  const els = document.querySelectorAll('[data-hours-status]');
  if (!h || !els.length) return;
  // Ziyaretçi nerede olursa olsun Türkiye saatine göre hesaplanır
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', weekday: 'short', hour: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  const gun = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  const saat = Number(p.hour);
  const acik = h.gunler.includes(gun) && saat >= h.acilis && saat < h.kapanis;
  const iki = n => String(n).padStart(2, '0') + ':00';
  els.forEach(el => {
    el.hidden = false;
    el.classList.toggle('is-open', acik);
    el.textContent = acik ? t('hours.open', { saat: iki(h.kapanis) }) : t('hours.closed', { saat: iki(h.acilis) });
  });
}
document.addEventListener('langchange', saatDurumu);
setInterval(saatDurumu, 60000);

/* ---------- Başlat ---------- */
footerCats();
markActivePage();
onScroll();
applySocial();
saatDurumu();
reveal();
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
