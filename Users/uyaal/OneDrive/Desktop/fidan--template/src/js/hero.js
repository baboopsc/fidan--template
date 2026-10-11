// js/hero.js - Fidan Dünyası (Güvenli ve Hızlı Versiyon)

export async function initHero() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  // Hangi sayfada olduğumuzu kontrol edelim
  const isLibraryHero = window.location.pathname.toLowerCase().includes("library");
  
  // HTML'deki yerleri bulalım
  const heroTitle = document.getElementById("heroTitle");
  const heroOverview = document.getElementById("heroOverview");
  const heroBg = hero.querySelector(".hero__bg") || document.getElementById("heroBg");
  const actions = document.querySelector(".hero__actions");

  // SEPET (MY LIBRARY) SAYFASIYSA
  if (isLibraryHero) {
    if (heroTitle) heroTitle.textContent = "Sepetinizdeki Güzellikler";
    if (heroOverview) heroOverview.textContent = "Burada doğaya katacağınız yeni fidanları görebilirsiniz. Siparişinizi tamamlamadan önce sepetinizi inceleyin ve bahçenizin eksiklerini tamamlayın.";
    
    if (heroBg) {
        // Fotoğraf yoksa bile hata vermemesi için arkaya yeşil bir renk (linear-gradient) attık
        heroBg.style.backgroundImage = "url('./img/sepet-hero.jpg'), linear-gradient(#1a4023, #1a4023)";
        heroBg.style.backgroundSize = "cover";
        heroBg.style.backgroundPosition = "center";
        heroBg.style.opacity = "0.7";
    }
    
    // Sepet sayfasında afiş butonlarına gerek yok, gizleyelim
    if (actions) actions.style.display = "none"; 
  } 
  
  // ANA SAYFAYSA
  else {
    if (heroTitle) heroTitle.textContent = "Doğayı Yaşam Alanınıza Taşıyın";
    if (heroOverview) heroOverview.textContent = "En kaliteli, sertifikalı ve verimli fidan çeşitlerimizle bahçenizi yeniden yaratın. Meyve, narenciye ve zeytingiller kategorilerinden dilediğinizi seçin, hızlı kargo ile kapınıza gelsin.";
    
    if (heroBg) {
        heroBg.style.backgroundImage = "url('./img/fidan-hero.jpg'), linear-gradient(#1a4023, #1a4023)";
        heroBg.style.backgroundSize = "cover";
        heroBg.style.backgroundPosition = "center";
        heroBg.style.opacity = "0.7";
    }
    
    // Butonları aktif edelim
    const trailerBtn = document.getElementById("heroTrailerBtn"); // Sepete Ekle Butonu
    const detailsBtn = document.getElementById("heroDetailsBtn"); // Detayları İncele Butonu
    
    // Tıklanınca Kataloga (Fidanlar sayfasına) göndersin
    const goToCatalog = () => { window.location.href = './catalog.html'; };
    
    if (trailerBtn) trailerBtn.addEventListener('click', goToCatalog);
    if (detailsBtn) detailsBtn.addEventListener('click', goToCatalog);
  }
}