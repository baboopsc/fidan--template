/* Sepet sayfası — adet değiştirme, kaldırma ve WhatsApp ile sipariş */
import './ui.js';
import { getCart, setQty, CART_KEY } from './cart.js';
import { byId, imgFor, SITE } from './data.js';
import { tl, esc } from './utils.js';

const $ = s => document.querySelector(s);
const list = $('#cartList');

// Sepetteki kayıtları güncel fidan bilgileriyle birleştirir
function urunler() {
  return getCart().map(c => {
    const f = byId(c.id);
    return {
      id: Number(c.id),
      ad: f ? f.title : (c.title || 'Fidan'),
      cesit: f ? f.variety : '',
      kategori: f ? f.category : (c.category || ''),
      fiyat: f ? f.price : (Number(c.price) || 0),
      adet: Math.max(1, Number(c.qty) || 1),
      gorsel: imgFor(f && f.slug),
    };
  });
}

const satir = (u, i) => `
  <article class="cart-item" data-id="${u.id}" style="--i:${i}">
    <img class="cart-item__img" src="${u.gorsel}" alt="${esc(u.ad)}">
    <div>
      <span class="cart-item__cat">${esc(u.kategori)}</span>
      <h3>${esc(u.ad)}</h3>
      <small>${u.cesit ? esc(u.cesit) + ' · ' : ''}${tl(u.fiyat)} / adet</small>
      <div class="cart-item__meta">
        <div class="qty qty--sm">
          <button type="button" data-dec aria-label="Azalt" ${u.adet <= 1 ? 'disabled' : ''}><i class="i i-minus"></i></button>
          <output>${u.adet}</output>
          <button type="button" data-inc aria-label="Artır"><i class="i i-plus"></i></button>
        </div>
      </div>
    </div>
    <div class="cart-item__side">
      <strong class="line-price">${tl(u.fiyat * u.adet)}</strong>
      <button type="button" class="remove-btn" data-remove><i class="i i-trash"></i>Kaldır</button>
    </div>
  </article>`;

function ozet() {
  const us = urunler();
  const adet = us.reduce((s, u) => s + u.adet, 0);
  const toplam = us.reduce((s, u) => s + u.adet * u.fiyat, 0);
  $('#sumCount').textContent = adet;
  $('#sumSub').textContent = tl(toplam);
  $('#sumTotal').textContent = tl(toplam);
  $('#cartSub').textContent = us.length
    ? `${us.length} çeşit fidan, toplam ${adet} adet. Siparişinizi WhatsApp üzerinden tamamlayın.`
    : 'Sepetiniz şu an boş.';
  return { us, toplam };
}

function ciz() {
  const us = urunler();
  const bos = us.length === 0;
  $('#cartLayout').hidden = bos;
  $('#cartEmpty').hidden = !bos;
  list.innerHTML = us.map(satir).join('');
  ozet();
}

function guncelle(item, u, yeni) {
  setQty(u.id, yeni);
  item.querySelector('output').textContent = yeni;
  item.querySelector('[data-dec]').disabled = yeni <= 1;
  item.querySelector('.line-price').textContent = tl(u.fiyat * yeni);
  ozet();
}

list.addEventListener('click', e => {
  const item = e.target.closest('.cart-item');
  if (!item) return;
  const u = urunler().find(x => x.id === Number(item.dataset.id));
  if (!u) return;
  if (e.target.closest('[data-inc]')) guncelle(item, u, u.adet + 1);
  else if (e.target.closest('[data-dec]') && u.adet > 1) guncelle(item, u, u.adet - 1);
  else if (e.target.closest('[data-remove]')) {
    item.classList.add('is-leaving');
    setTimeout(() => { setQty(u.id, 0); ciz(); }, 280);
  }
});

$('#waBtn').addEventListener('click', () => {
  const { us, toplam } = ozet();
  if (!us.length) return;
  const satirlar = us.map((u, i) =>
    `${i + 1}. ${u.ad}${u.cesit ? ` (${u.cesit})` : ''} - ${u.adet} adet (${tl(u.fiyat * u.adet)})`);
  const mesaj = `Merhaba, ${SITE.name} sitesinden sipariş vermek istiyorum:\n\n${satirlar.join('\n')}\n\nGenel toplam: ${tl(toplam)}\n\nTeşekkürler!`;
  window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mesaj)}`, '_blank', 'noopener');
});

window.addEventListener('storage', e => { if (e.key === CART_KEY) ciz(); });
ciz();
