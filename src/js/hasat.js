/* ==========================================================
   Hasat takvimi (Fidanlar sayfasının altı)
   Her çeşidin "Hasat" (yoksa "Olgunlaşma") bilgisinden aylar çıkarılır:
     "Ekim–Kasım" -> 10, 11   |  "Haziran başı" -> 6   |  "Kasım–Şubat" -> 11, 12, 1, 2
     "Yıl boyunca" -> 12 ayın tamamı   |  "Kış aylarında" -> 12, 1, 2
   Ay yazmayan çeşitler ("Geç", "Erkenci" ...) takvimde gösterilmez; yanlış bilgi verilmez.
   ========================================================== */
import { visibleCategories, inCategory, fidanImg, kucuk } from './data.js';
import { lang, cat, shortName, t } from './i18n.js';
import { esc } from './utils.js';

const AYLAR = ['ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'];

export function hasatAylari(f) {
  const s = (f.specs || []).find(([k]) => k === 'Hasat') || (f.specs || []).find(([k]) => k === 'Olgunlaşma');
  if (!s) return [];
  const v = s[1].toLocaleLowerCase('tr');
  if (/yıl boyu/.test(v)) return [...Array(12).keys()];
  const bul = [];
  AYLAR.forEach((a, i) => { let p = v.indexOf(a); while (p > -1) { bul.push({ i, p }); p = v.indexOf(a, p + 1); } });
  bul.sort((a, b) => a.p - b.p);
  const aylar = new Set();
  if (!bul.length && /kış/.test(v)) [11, 0, 1].forEach(m => aylar.add(m));
  bul.forEach((b, k) => {
    aylar.add(b.i);
    const sonraki = bul[k + 1];
    if (!sonraki) return;
    const ara = v.slice(b.p, sonraki.p);
    if (/[–-]/.test(ara) && !ara.includes(',')) {          // aralık: "Ekim – Kasım", "Kasım–Şubat"
      for (let m = b.i; m !== sonraki.i; m = (m + 1) % 12) aylar.add(m);
    }
  });
  return [...aylar];
}

const ayAdi = (i, bicim) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : lang, { month: bicim }).format(new Date(2024, i, 15));

export function hasatKur(kok, acFn) {
  if (!kok) return;
  const tabs = kok.querySelector('.harvest__tabs');
  const tablo = kok.querySelector('.harvest__grid');
  const turler = visibleCategories().filter(c => inCategory(c.key).some(f => hasatAylari(f).length));
  let secili = turler[0]?.key;
  const buAy = new Date().getMonth();

  function ciz() {
    tabs.innerHTML = turler.map(c =>
      `<button type="button" role="tab" class="harvest__tab" data-tur="${esc(c.key)}" aria-selected="${c.key === secili}">${esc(cat(c.key))}</button>`).join('');
    const kisa = matchMedia('(max-width: 600px)').matches ? 'narrow' : 'short';
    // Çeşitler hasadın başladığı aya göre sıralanır (takvimde merdiven gibi okunur)
    const basAy = a => a.size === 12 ? -1 : Math.min(...[...a].filter(m => !a.has((m + 11) % 12)));
    const satirlar = inCategory(secili).map(f => ({ f, a: new Set(hasatAylari(f)) })).filter(x => x.a.size)
      .sort((x, y) => basAy(x.a) - basAy(y.a));
    tablo.innerHTML = `
      <div class="harvest__row harvest__row--head">
        <span></span>
        ${AYLAR.map((_, i) => `<span class="harvest__m${i === buAy ? ' is-now' : ''}"${i === buAy ? ` title="${esc(t('harvest.now'))}"` : ''}>${esc(ayAdi(i, kisa))}</span>`).join('')}
      </div>
      ${satirlar.map(({ f, a }) => `
        <div class="harvest__row">
          <button type="button" class="harvest__name" data-open="${f.id}"><img src="${kucuk(fidanImg(f))}" alt="" width="30" height="30" loading="lazy"><span>${esc(shortName(f))}</span></button>
          ${AYLAR.map((_, i) => {
            if (!a.has(i)) return `<span class="harvest__c${i === buAy ? ' is-now' : ''}"></span>`;
            const bas = !a.has((i + 11) % 12) || i === 0, son = !a.has((i + 1) % 12) || i === 11;
            return `<span class="harvest__c is-on${bas ? ' is-start' : ''}${son ? ' is-end' : ''}${i === buAy ? ' is-now' : ''}" title="${esc(shortName(f))} · ${esc(ayAdi(i, 'long'))}"></span>`;
          }).join('')}
        </div>`).join('')}`;
  }

  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-tur]');
    if (!b) return;
    secili = b.dataset.tur;
    ciz();
  });
  tablo.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (b) acFn(b.dataset.open);
  });
  document.addEventListener('langchange', ciz);
  matchMedia('(max-width: 600px)').addEventListener('change', ciz);
  ciz();
  // Fidanlar sayfasında bir tür açılınca takvim de o türe geçer
  return key => { if (key && key !== secili && turler.some(c => c.key === key)) { secili = key; ciz(); } };
}
