/* Ürün kartı — ana sayfa ve Fidanlar sayfası aynı kartı kullanır */
import { imgFor, fullName } from './data.js';
import { tl, esc } from './utils.js';

// link: true  -> karta tıklayınca Fidanlar sayfasına gider (ana sayfa)
// link: false -> karta tıklayınca ürün penceresi açılır (Fidanlar sayfası)
export function cardHTML(f, { link = false, i = 0 } = {}) {
  const inner = `
      <img src="${imgFor(f.slug)}" alt="${esc(fullName(f))}" loading="lazy" width="600" height="600">
      <span class="p-card__tag">${esc(f.category)}</span>
      <span class="p-card__view">İncele <i class="i i-arrow-right"></i></span>`;

  const media = link
    ? `<a class="p-card__media" href="./catalog.html?fidan=${f.id}" aria-label="${esc(f.title)} detayları">${inner}</a>`
    : `<button class="p-card__media" type="button" data-open="${f.id}" aria-label="${esc(f.title)} detayları">${inner}</button>`;

  return `
    <article class="p-card" style="--i:${i}">
      ${media}
      <div class="p-card__body">
        <div>
          <h3 class="p-card__name">${esc(f.title)}</h3>
          <p class="p-card__variety">${esc(f.variety)}</p>
          <strong class="p-card__price">${tl(f.price)}</strong>
        </div>
        <button class="add-btn" type="button" data-add="${f.id}" aria-label="${esc(f.title)} sepete ekle"><i class="i i-bag"></i></button>
      </div>
    </article>`;
}
