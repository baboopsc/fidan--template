/* Sepet — tarayıcının localStorage'ında 'fidanCart' anahtarıyla saklanır */
import { byId, fullName } from './data.js';
import { toast } from './toast.js';

export const CART_KEY = 'fidanCart';

export function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(raw) ? raw.filter(x => x && x.id != null) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* gizli sekme vb. */ }
  updateBadge(true);
}

export function addToCart(id, qty = 1) {
  const f = byId(id);
  if (!f) return;
  const cart = getCart();
  const item = cart.find(x => Number(x.id) === f.id);
  if (item) item.qty = (Number(item.qty) || 1) + qty;
  else cart.push({ id: f.id, title: fullName(f), price: f.price, category: f.category, qty });
  saveCart(cart);
  toast(`${f.title} sepete eklendi`, true);
}

// qty 0 veya altıysa ürünü sepetten çıkarır
export function setQty(id, qty) {
  const cart = getCart();
  saveCart(qty <= 0
    ? cart.filter(x => Number(x.id) !== Number(id))
    : cart.map(x => (Number(x.id) === Number(id) ? { ...x, qty } : x)));
}

export const cartCount = () => getCart().reduce((sum, x) => sum + (Number(x.qty) || 1), 0);

// Menüdeki sepet rozetindeki sayıyı günceller
export function updateBadge(bump = false) {
  const n = cartCount();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.classList.toggle('is-on', n > 0);
    if (bump && n > 0) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
}
