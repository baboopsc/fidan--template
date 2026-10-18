/* Ekranın altında beliren kısa bildirim ("... sepete eklendi") */
import { esc } from './utils.js';

let el, timer;

export function toast(message, withCartLink = false) {
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  const link = withCartLink && !location.pathname.includes('library') ? '<a href="./library.html">Sepete git</a>' : '';
  el.innerHTML = `<span class="toast__icon"><i class="i i-check"></i></span><span>${esc(message)}${link}</span>`;
  requestAnimationFrame(() => el.classList.add('is-on'));
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('is-on'), 2800);
}
