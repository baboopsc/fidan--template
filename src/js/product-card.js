/* Ürün kartı — ana sayfa ve Fidanlar sayfası aynı kartı kullanır.
   Kartın tamamı tıklanabilir: başlıktaki bağlantı/düğme tüm kartı kaplar (CSS: .p-card__link::after). */
import { fidanImg, highlights, kucuk } from './data.js';
import { localize, fullName, t } from './i18n.js';
import { esc } from './utils.js';

// link: true  -> karta tıklayınca Fidanlar sayfasında o fidanın penceresi açılır (ana sayfa)
// link: false -> karta tıklayınca aynı sayfada ürün penceresi açılır (Fidanlar sayfası)
export function cardHTML(f, { link = false, i = 0 } = {}) {
  const L = localize(f);
  const ilk = highlights(f)[0];
  const [baslik, deger] = ilk ? L.spec([ilk[1], ilk[2]]) : [];
  // Detaylı çeşitte hasat vb. ilk bilgi; yalnızca adı olan çeşitte "Bilgi için arayın"
  const meta = ilk
    ? `<p class="p-card__meta"><i class="i i-${ilk[0]}"></i><span>${esc(baslik)}: ${esc(deger)}</span></p>`
    : `<p class="p-card__meta p-card__meta--ask"><i class="i i-phone"></i><span>${esc(t('card.ask'))}</span></p>`;
  const title = link
    ? `<a class="p-card__link" href="./catalog.html?fidan=${f.id}">${esc(L.title)}</a>`
    : `<button class="p-card__link" type="button" data-open="${f.id}">${esc(L.title)}</button>`;

  return `
    <article class="p-card" style="--i:${i}">
      <div class="p-card__media">
        <img src="${kucuk(fidanImg(f))}" alt="${esc(fullName(f))}" loading="lazy" width="600" height="600">
        <span class="p-card__tag">${esc(L.category)}</span>
        <span class="p-card__view" aria-hidden="true">${esc(t('card.view'))} <i class="i i-arrow-right"></i></span>
      </div>
      <div class="p-card__body">
        <div class="p-card__text">
          <h3 class="p-card__name">${title}</h3>
          ${meta}
        </div>
        <span class="more-btn" aria-hidden="true"><i class="i i-arrow-right"></i></span>
      </div>
    </article>`;
}
