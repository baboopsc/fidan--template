/* ==========================================================
   Teklif listesi — toptan alıcılar birden fazla çeşidi listeye ekler,
   "Teklif İste" formunda adetlerini yazıp tek WhatsApp mesajıyla gönderir.
   Liste yalnızca ziyaretçinin tarayıcısında durur (localStorage); hiçbir yere gönderilmez.
   ========================================================== */
const KEY = 'teklifListesi';
let liste = (() => {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(x => x && x.id) : []; }
  catch { return []; }
})();

const kaydet = () => { try { localStorage.setItem(KEY, JSON.stringify(liste)); } catch { /* gizli sekme vb. */ } };
const yay = () => document.dispatchEvent(new CustomEvent('listechange'));

export const listeAl = () => liste;
export const listede = id => liste.some(x => x.id === Number(id));
export function ekle(id) {
  if (listede(id)) return;
  liste = [...liste, { id: Number(id), adet: '' }];
  kaydet(); yay();
}
export function cikar(id) {
  liste = liste.filter(x => x.id !== Number(id));
  kaydet(); yay();
}
export function adetYaz(id, adet) {
  const x = liste.find(x => x.id === Number(id));
  if (x) { x.adet = adet; kaydet(); }
}
export function temizle() { liste = []; kaydet(); yay(); }
// Başka sekmede değişirse burada da güncellensin
window.addEventListener('storage', e => {
  if (e.key !== KEY) return;
  try { liste = JSON.parse(e.newValue || '[]'); } catch { liste = []; }
  yay();
});
