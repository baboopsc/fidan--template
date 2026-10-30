/* ==========================================================
   Çeşit karşılaştırma (Fidanlar sayfası)
   Ürün penceresindeki "Karşılaştır" ile en fazla 3 çeşit seçilir; sayfanın altında
   ince bir şerit belirir, "Karşılaştır" deyince çeşitler bir tabloda yan yana açılır.
   Bilgiler js/fidanlar.js'teki özelliklerden gelir; farklı olan satırlar vurgulanır.
   ========================================================== */
import { byId, fidanImg, kucuk } from './data.js';
import { FIDAN_BOYLARI, TUPLU } from './fidanlar.js';
import { localize, t, lang } from './i18n.js';
import { hasatAylari } from './hasat.js';
import { ekle as listeyeEkle } from './liste.js';
import { esc } from './utils.js';

const KEY = 'karsilastir', MAX = 3;
let secili = (() => { try { const v = JSON.parse(sessionStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.slice(0, MAX) : []; } catch { return []; } })();
const kaydet = () => { try { sessionStorage.setItem(KEY, JSON.stringify(secili)); } catch { /* gizli sekme */ } };
const yay = () => document.dispatchEvent(new CustomEvent('cmpchange'));

export const karsilastirmada = id => secili.includes(Number(id));
export function degistir(id) {
  id = Number(id);
  if (secili.includes(id)) secili = secili.filter(x => x !== id);
  else if (secili.length >= MAX) return false;
  else secili = [...secili, id];
  kaydet(); yay(); return true;
}

let bar, dlg, acFn;

/* ---------- Alttaki şerit ---------- */
function seritCiz() {
  const l = secili.map(byId).filter(Boolean);
  bar.hidden = !l.length;
  document.body.classList.toggle('has-cmp', l.length > 0);
  if (!l.length) return;
  bar.innerHTML = `
    <div class="cmp-bar__items">
      ${l.map(f => `<span class="cmp-bar__item"><img src="${kucuk(fidanImg(f))}" alt="" width="36" height="36"><span>${esc(localize(f).title)}</span><button type="button" data-cmp-cikar="${f.id}" aria-label="${esc(t('cmp.remove'))}"><i class="i i-close"></i></button></span>`).join('')}
      ${l.length < MAX ? `<span class="cmp-bar__slot">${esc(t('cmp.slot'))}</span>` : ''}
    </div>
    <div class="cmp-bar__actions">
      <button type="button" class="cmp-bar__clear" data-cmp-temizle>${esc(t('cmp.clear'))}</button>
      <button type="button" class="btn btn-primary btn-sm" data-cmp-ac${l.length < 2 ? ' disabled' : ''}><i class="i i-scale"></i> ${esc(t('cmp.open'))}</button>
    </div>`;
}

/* ---------- Karşılaştırma tablosu ---------- */
const AYLAR = [...Array(12).keys()];
function tabloCiz() {
  const l = secili.map(byId).filter(Boolean);
  if (l.length < 2) { dlg.close(); return; }
  const L = l.map(localize);
  // Satırlar: çeşitlerde geçen özellikler, ilk görülme sırasıyla
  const anahtarlar = [];
  l.forEach(f => (f.specs || []).forEach(([k]) => { if (!anahtarlar.includes(k)) anahtarlar.push(k); }));
  const ay = i => new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : lang, { month: 'narrow' }).format(new Date(2024, i, 15));
  const satir = (baslik, hucreler, fark) => `<tr${fark ? ' class="is-diff"' : ''}><th scope="row">${esc(baslik)}</th>${hucreler.map(h => `<td>${h}</td>`).join('')}</tr>`;
  const rows = [];
  // Hasat ayları şeridi
  rows.push(satir(t('cmp.harvest'), l.map(f => {
    const a = new Set(hasatAylari(f));
    return a.size ? `<span class="cmp-ay">${AYLAR.map(i => `<span class="${a.has(i) ? 'on' : ''}" title="${esc(ay(i))}">${esc(ay(i))}</span>`).join('')}</span>` : '<span class="cmp-yok">—</span>';
  }), false));
  anahtarlar.forEach(k => {
    const deg = l.map((f, j) => { const s = (f.specs || []).find(([x]) => x === k); return s ? L[j].spec(s)[1] : null; });
    const baslik = L.map((x, j) => { const s = (l[j].specs || []).find(([y]) => y === k); return s ? x.spec(s)[0] : null; }).find(Boolean) || k;
    const fark = new Set(deg.map(v => v ?? '—')).size > 1;
    rows.push(satir(baslik, deg.map(v => v ? esc(v) : '<span class="cmp-yok">—</span>'), fark));
  });
  // Satıştaki fidan
  rows.push(satir(t('cmp.sapling'), l.map(f => {
    const b = FIDAN_BOYLARI[f.slug];
    return b ? b.map(([y, cm]) => `${esc(t(TUPLU.has(f.slug) ? 'sap.potted' : 'sap.grafted'))} · ${esc(y === 1 ? t('sap.age1') : t('sap.age', { n: y }))} · ${esc(cm)} cm`).join('<br>') : '<span class="cmp-yok">—</span>';
  }), false));

  dlg.querySelector('.cmp__table').innerHTML = `
    <thead><tr><th></th>${l.map((f, j) => `
      <th scope="col">
        <button type="button" class="cmp__x" data-cmp-cikar="${f.id}" aria-label="${esc(t('cmp.remove'))}"><i class="i i-close"></i></button>
        <button type="button" class="cmp__head" data-open="${f.id}">
          <img src="${kucuk(fidanImg(f))}" alt="" width="160" height="120">
          <small>${esc(L[j].category)}</small><b>${esc(L[j].title)}</b>
        </button>
      </th>`).join('')}</tr></thead>
    <tbody>${rows.join('')}</tbody>`;
}

export function karsilastirKur(ac) {
  acFn = ac;
  bar = document.createElement('div');
  bar.className = 'cmp-bar'; bar.hidden = true;
  document.body.appendChild(bar);
  dlg = document.createElement('dialog');
  dlg.className = 'cmp';
  dlg.innerHTML = `
    <div class="cmp__top">
      <div><span class="eyebrow">${esc(t('cmp.open'))}</span><h2 class="cmp__title"></h2></div>
      <button type="button" class="icon-btn" data-cmp-kapat><i class="i i-close"></i></button>
    </div>
    <p class="cmp__note"><span class="cmp__legend"></span><span class="cmp__note-t"></span></p>
    <div class="cmp__scroll"><table class="cmp__table"></table></div>
    <div class="cmp__actions"><button type="button" class="btn btn-list" data-cmp-liste><i class="i i-plus"></i> <span class="cmp__liste-t"></span></button></div>`;
  document.body.appendChild(dlg);

  const metinler = () => {
    dlg.querySelector('.cmp__title').textContent = t('cmp.title');
    dlg.querySelector('.cmp__note-t').textContent = t('cmp.diff');
    dlg.querySelector('.cmp__liste-t').textContent = t('cmp.addAll');
    dlg.querySelector('[data-cmp-kapat]').setAttribute('aria-label', t('modal.close'));
    dlg.querySelector('.eyebrow').textContent = t('cmp.open');
  };
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-cmp-cikar]');
    if (c) { degistir(c.dataset.cmpCikar); if (dlg.open) tabloCiz(); return; }
    if (e.target.closest('[data-cmp-temizle]')) { secili = []; kaydet(); yay(); return; }
    if (e.target.closest('[data-cmp-ac]')) { metinler(); tabloCiz(); dlg.showModal(); return; }
    if (e.target.closest('[data-cmp-kapat]') || e.target === dlg) { dlg.close(); return; }
    if (e.target.closest('[data-cmp-liste]')) { secili.forEach(listeyeEkle); dlg.close(); document.querySelector('[data-quote=""]')?.click(); return; }
    const o = e.target.closest('.cmp__head[data-open]');
    if (o) { dlg.close(); acFn(o.dataset.open); }
  });
  document.addEventListener('cmpchange', seritCiz);
  document.addEventListener('langchange', () => { seritCiz(); if (dlg.open) { metinler(); tabloCiz(); } });
  seritCiz();
}
