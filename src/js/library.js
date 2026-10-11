// js/library.js - WhatsApp Sipariş Entegrasyonlu Sepetim Sayfası

import { initHeader } from './header.js';
import { hideGlobalLoader, initGlobalUi, showGlobalLoader } from './ui.js';

let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const perPage = 999; // Tüm sepeti tek sayfada göster

async function bootstrapLibraryPage() {
  initGlobalUi();
  initHeader();
  showGlobalLoader();

  try {
    initLibrary();
  } finally {
    hideGlobalLoader();
  }
}

function initLibrary() {
  const container = document.getElementById('libraryGallery') || document.getElementById('movieGrid');
  const loadMoreBtn = document.getElementById('loadMore');
  const genreFilter = document.getElementById('genreFilter') || document.getElementById('yearSelectCustom');

  if (!container) return;
  refreshLibrary(container, loadMoreBtn);
  addCardListeners(container, loadMoreBtn);
}

function renderEmptyState(container, loadMoreBtn, genreFilter) {
  if (loadMoreBtn) loadMoreBtn.classList.add('is-hidden');
  if (genreFilter) genreFilter.classList.add('is-hidden');
  
  container.innerHTML = `
    <div class="empty-state" style="text-align: center; padding: 60px 20px; width: 100%; grid-column: 1 / -1;">
      <p class="empty-title" style="font-family: 'Lora', serif; font-size: 2rem; color: #2a3c24; margin-bottom: 15px;">Sepetiniz Boş</p>
      <p class="empty-text" style="color: #6b7a65; font-size: 1.1rem; line-height: 1.6; margin-bottom: 25px;">
        Doğayı yaşam alanınıza taşımak için<br>henüz bir fidan seçmediniz.
      </p>
      <a href="./catalog.html" class="btn-search-more" target="_self" style="display: inline-block; background: #2a3c24; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: 600; transition: 0.3s;">Fidanlara Göz At</a>
    </div>
  `;
}

function populateGenreDropdown(genreFilter) {
  if (!genreFilter) return;

  const list = genreFilter.querySelector('.custom-select__list');
  const button = genreFilter.querySelector('.custom-select__button') || genreFilter.querySelector('.custom-select__btn');
  const label = genreFilter.querySelector('.custom-select__label');

  if (!list || !button || !label) return;

  list.innerHTML = ''; 

  const availableCategories = new Set();
  allMovies.forEach(m => {
    if (m.category) availableCategories.add(m.category);
  });

  const allItem = document.createElement('li');
  allItem.dataset.value = 'all';
  allItem.textContent = 'Tüm Kategoriler';
  allItem.classList.add('selected');
  list.appendChild(allItem);

  availableCategories.forEach(categoryName => {
    const li = document.createElement('li');
    li.dataset.value = categoryName;
    li.textContent = categoryName;
    list.appendChild(li);
  });

  const toggleList = open => {
    if (open) {
      list.classList.remove('hide');
      if(button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'true');
    } else {
      list.classList.add('hide');
      if(button.hasAttribute('aria-expanded')) button.setAttribute('aria-expanded', 'false');
    }
  };

  button.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !list.classList.contains('hide');
    toggleList(!isOpen);
  });

  document.addEventListener('click', e => {
    if (!genreFilter.contains(e.target)) toggleList(false);
  });

  list.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;

    list.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    label.textContent = li.textContent;
    toggleList(false);

    const selectedCategory = li.dataset.value;
    currentPage = 1;

    const container = document.getElementById('libraryGallery') || document.getElementById('movieGrid');
    const loadMoreBtn = document.getElementById('loadMore');
    if(container) container.innerHTML = '';

    filteredMovies = selectedCategory === 'all'
      ? allMovies
      : allMovies.filter(m => m.category === selectedCategory);

    renderLibrarySlice(container, loadMoreBtn);
  });
}

function renderLibrarySlice(container, loadMoreBtn) {
  if (!container) return;

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const slice = filteredMovies.slice(start, end);

  if (loadMoreBtn) loadMoreBtn.classList.add('is-hidden'); // Sayfalama butonunu gizle
  
  renderMovies(slice, container, false);
}

function renderMovies(moviesList, container, clear = true) {
  if (clear) container.innerHTML = '';

  // 1. Ürün Kartlarını Oluştur
  const markup = moviesList.map((fidan) => {
    const shortName = fidan.title ? fidan.title.split(' ')[0] : 'Fidan';
    const poster = fidan.image ? fidan.image : `https://placehold.co/300x350/eef2eb/2a3c24?text=${encodeURIComponent(shortName)}`;
    
    const qty = fidan.qty || 1;
    const totalPrice = (fidan.price * qty).toFixed(2);

    return `
      <li class="movie-card" data-id="${fidan.id}" style="background: #ffffff; padding: 15px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: default; text-align: left; display: flex; flex-direction: column;">
        <img class="movie-card__poster" src="${poster}" alt="${fidan.title}" loading="lazy" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 15px;" />
        
        <div class="movie-card__info" style="display: flex; flex-direction: column; flex: 1;">
          <h3 class="movie-card__title" style="font-size: 18px; font-weight: 700; color: #2a3c24; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fidan.title}</h3>
          
          <div class="movie-card__meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <span class="movie-card__text" style="font-weight: 700; color: #4caf50;">${qty} Adet</span>
            <span class="movie-card__stars" style="font-weight: 700; color: #2a3c24; font-size: 16px;">₺${totalPrice}</span>
          </div>
          
          <button class="remove-cart-btn" data-id="${fidan.id}" style="margin-top: auto; width: 100%; background: #eef2eb; color: #2a3c24; border: none; padding: 10px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s;">🗑️ Sepetten Çıkar</button>
        </div>
      </li>`;
  });

  container.innerHTML += markup.join('');

  // 2. WHATSAPP SİPARİŞ ÖZETİ PANELİNİ EN ALTA EKLE
  if (moviesList.length > 0) {
    const cartTotal = moviesList.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    const summaryHTML = `
      <li style="grid-column: 1 / -1; background: #2a3c24; border-radius: 20px; padding: 30px; display: flex; justify-content: space-between; align-items: center; color: white; margin-top: 30px; flex-wrap: wrap; gap: 20px;">
        <div>
          <h3 style="font-size: 24px; font-family: 'Lora', serif; margin-bottom: 5px; color: #fff;">Sipariş Özeti</h3>
          <p style="font-size: 15px; color: #d5dcd2;">Sipariş onayı ve kargo adımları WhatsApp üzerinden planlanacaktır.</p>
        </div>
        
        <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap;">
          <div style="text-align: right;">
            <p style="font-size: 14px; color: #d5dcd2; margin-bottom: 2px;">Genel Toplam</p>
            <span style="font-size: 32px; font-weight: 800; color: #fff;">₺${cartTotal.toFixed(2)}</span>
          </div>
          <button id="wpCheckoutBtn" style="background: #25D366; color: white; border: none; padding: 16px 32px; border-radius: 30px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; font-family: inherit; box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            WhatsApp ile Sipariş Ver
          </button>
        </div>
      </li>
    `;
    container.innerHTML += summaryHTML;

    // 3. WHATSAPP MESAJI OLUŞTURMA İŞLEMİ
    const wpBtn = container.querySelector('#wpCheckoutBtn');
    if (wpBtn) {
      wpBtn.addEventListener('click', () => {
        let wpMessage = "🌿 *Merhaba, Fidan Dünyası'ndan sipariş vermek istiyorum:*\n\n";
        
        moviesList.forEach((item, idx) => {
          const itemTotal = (item.price * (item.qty || 1)).toFixed(2);
          wpMessage += `${idx + 1}. ${item.title} - ${item.qty} Adet (₺${itemTotal})\n`;
        });
        
        wpMessage += `\n*Genel Toplam: ₺${cartTotal.toFixed(2)}*\n\nTeşekkürler!`;
        
        const encodedMessage = encodeURIComponent(wpMessage);
        const phoneNumber = "905345749021"; // Verdiğin Numara (+90 formatında)
        
        // Yeni sekmede WhatsApp'ı hazır metinle aç
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      });
    }
  }
}

function addCardListeners(container, loadMoreBtn) {
  if (container.dataset.listenerAttached === 'true') return;

  container.addEventListener('click', e => {
    // Sepetten Çıkarma İşlemi
    const removeBtn = e.target.closest('.remove-cart-btn');
    if (removeBtn) {
      e.stopPropagation();
      const idToRemove = removeBtn.dataset.id;
      removeFromStorage(idToRemove);
      refreshLibrary(container, loadMoreBtn);
      return;
    }
  });

  container.dataset.listenerAttached = 'true';
}

function removeFromStorage(id) {
  let cart = JSON.parse(localStorage.getItem('fidanCart')) || [];
  cart = cart.filter(item => item.id != id);
  localStorage.setItem('fidanCart', JSON.stringify(cart));
}

function refreshLibrary(container, loadMoreBtn) {
  allMovies = JSON.parse(localStorage.getItem('fidanCart')) || [];
  filteredMovies = [...allMovies];
  currentPage = 1;
  container.innerHTML = '';

  if (allMovies.length === 0) {
    renderEmptyState(container, loadMoreBtn, document.getElementById('genreFilter') || document.getElementById('yearSelectCustom'));
    return;
  }
  
  populateGenreDropdown(document.getElementById('genreFilter') || document.getElementById('yearSelectCustom'));
  renderLibrarySlice(container, loadMoreBtn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapLibraryPage, { once: true });
} else {
  bootstrapLibraryPage();
}