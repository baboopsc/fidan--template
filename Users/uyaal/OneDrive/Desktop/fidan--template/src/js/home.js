import { showMovieSpotlight } from './movie-spotlight.js';

const fidanlarVeritabani = [
  { id: 101, title: "Ceviz Fidanı (Chandler)", price: 150, image: "./img/ceviz.jpg", category: "Meyve" },
  { id: 102, title: "Limon Fidanı (Yediveren)", price: 200, image: "./img/limon.jpg", category: "Narenciye" },
  { id: 103, title: "Zeytin Fidanı (Gemlik)", price: 120, image: "./img/zeytin.jpg", category: "Zeytingiller" },
  { id: 104, title: "Elma Fidanı (Amasya)", price: 130, image: "./img/elma.jpg", category: "Meyve" }
];

export async function initHome() {
  renderFidanKatalogu();
}

function renderFidanKatalogu() {
  const weeklyList = document.getElementById('weeklyList');
  if (!weeklyList) return;

  const markup = fidanlarVeritabani.map(fidan => {
    const poster = fidan.image ? fidan.image : './img/oops-logo.png';

    return `
      <li class="product-card" data-id="${fidan.id}">
        <img src="${poster}" alt="${fidan.title}" loading="lazy" />
        <div class="product-info">
          <h3>${fidan.title}</h3>
          <div class="product-bottom">
            <span class="product-price">₺${fidan.price}</span>
            <div class="cart-btn">🛒</div>
          </div>
        </div>
      </li>
    `;
  });

  weeklyList.innerHTML = markup.join('');

  weeklyList.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      showMovieSpotlight(card.dataset.id);
    });
  });
}