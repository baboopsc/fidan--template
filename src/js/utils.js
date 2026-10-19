/* Küçük yardımcı fonksiyonlar */

// HTML içine yazılan metni güvenli hâle getirir
export const esc = s =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Türkçe karakterlerden bağımsız arama için sadeleştirir (İncir -> incir, ş -> s ...)
export const sade = s =>
  String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');
