try {
  const fidanlarDB = [
    { id: 1, title: "Kiraz Fidanı (Napolyon)", price: 160, category: "Meyve" },
    { id: 2, title: "Portakal Fidanı (Washington)", price: 180, category: "Narenciye" },
    { id: 3, title: "İncir Fidanı (Bursa Siyahı)", price: 140, category: "Meyve" },
    { id: 4, title: "Badem Fidanı (Ferragnes)", price: 170, category: "Meyve" },
    { id: 5, title: "Limon Fidanı (Yediveren)", price: 200, category: "Narenciye" },
    { id: 6, title: "Zeytin Fidanı (Gemlik)", price: 120, category: "Zeytingiller" },
    { id: 7, title: "Elma Fidanı (Amasya)", price: 130, category: "Meyve" },
    { id: 8, title: "Mandalina Fidanı (Satsuma)", price: 190, category: "Narenciye" },
    { id: 9, title: "Ceviz Fidanı (Chandler)", price: 150, category: "Meyve" }
  ];

  let currentCategory = "Tüm Kategoriler";
  let currentSearchQuery = "";
  let currentQty = 1;
  let selectedFidan = null;

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = "position: fixed; bottom: 30px; right: 30px; background: #2a3c24; color: #fff; padding: 16px 24px; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 999999; transform: translateY(100px); opacity: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);";
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 100);
    setTimeout(() => { toast.style.transform = 'translateY(100px)'; toast.style.opacity = '0'; }, 3000);
    setTimeout(() => { toast.remove(); }, 3400);
  }

  function initModalHTML() {
    if (document.getElementById('fidanOzelModal')) return; 

    const modalHTML = `
      <style>
        .f-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 99999; display: flex; align-items: center; justify-content: center; opacity: 1; transition: opacity 0.3s ease; }
        .f-backdrop.is-hidden { opacity: 0; pointer-events: none; }
        .f-modal { background: #fff; width: 90%; max-width: 800px; border-radius: 24px; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); transform: scale(1); transition: transform 0.3s ease; font-family: 'Plus Jakarta Sans', sans-serif; }
        .f-backdrop.is-hidden .f-modal { transform: scale(0.9); }
        .f-close { position: absolute; top: 20px; right: 20px; background: #f5f7f4; color: #2a3c24; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: 0.2s; }
        .f-close:hover { background: #eef2eb; }
        .f-inner { display: flex; gap: 30px; padding: 30px; }
        .f-img { width: 45%; height: 350px; object-fit: cover; border-radius: 16px; background: #eef2eb; }
        .f-details { flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: left;}
        .f-details h2 { font-size: 32px; color: #2a3c24; margin-bottom: 15px; font-family: 'Lora', serif; }
        .f-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .f-badge { background: #eef2eb; color: #2a3c24; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; }
        .f-price { font-size: 28px; font-weight: 800; color: #2a3c24; }
        .f-desc { color: #6b7a65; line-height: 1.6; margin-bottom: 35px; font-size: 15px; }
        .f-actions { display: flex; gap: 20px; align-items: center; }
        .f-qty { display: flex; align-items: center; background: #f5f7f4; border-radius: 30px; padding: 6px; }
        .f-qty button { background: #fff; border: none; width: 45px; height: 45px; border-radius: 50%; font-size: 22px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.05); color: #2a3c24; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .f-qty button:hover { background: #eef2eb; }
        .f-qty span { width: 50px; text-align: center; font-weight: 800; font-size: 20px; color: #2a3c24; }
        .f-add-btn { flex: 1; background: #2a3c24; color: #fff; border: none; padding: 18px 24px; border-radius: 30px; font-size: 16px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .f-add-btn:hover { background: #3b5234; }
        @media (max-width: 768px) { .f-inner { flex-direction: column; padding: 20px; } .f-img { width: 100%; height: 250px; } .f-actions { flex-direction: column; width: 100%; } .f-add-btn { width: 100%; } }
      </style>
      
      <div class="f-backdrop is-hidden" id="fidanOzelModal">
        <div class="f-modal">
          <button class="f-close" id="fCloseBtn">✕</button>
          <div class="f-inner">
            <img id="fModalImg" src="" alt="Fidan" class="f-img">
            <div class="f-details">
              <h2 id="fModalTitle">Fidan Adı</h2>
              <div class="f-meta">
                <span id="fModalCategory" class="f-badge">Kategori</span>
                <span id="fModalPrice" class="f-price">₺0</span>
              </div>
              <p class="f-desc">Özenle yetiştirilmiş, sertifikalı ve yüksek verimli fidan. Bahçenize doğanın dokunuşunu getirin.</p>
              <div class="f-actions">
                <div class="f-qty">
                  <button id="fQtyMinus">-</button>
                  <span id="fQtyValue">1</span>
                  <button id="fQtyPlus">+</button>
                </div>
                <button id="fAddToCartBtn" class="f-add-btn">Sepete Ekle</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('fCloseBtn').addEventListener('click', closeFidanModal);
    document.getElementById('fidanOzelModal').addEventListener('click', (e) => {
      if(e.target.id === 'fidanOzelModal') closeFidanModal();
    });

    // FİYAT GÜNCELLEME EKLENDİ
    document.getElementById('fQtyMinus').addEventListener('click', () => {
      if(currentQty > 1) { 
        currentQty--; 
        document.getElementById('fQtyValue').textContent = currentQty; 
        document.getElementById('fModalPrice').textContent = `₺${selectedFidan.price * currentQty}`;
      }
    });
    
    // FİYAT GÜNCELLEME EKLENDİ
    document.getElementById('fQtyPlus').addEventListener('click', () => {
      currentQty++; 
      document.getElementById('fQtyValue').textContent = currentQty;
      document.getElementById('fModalPrice').textContent = `₺${selectedFidan.price * currentQty}`;
    });

    document.getElementById('fAddToCartBtn').addEventListener('click', () => {
      if(!selectedFidan) return;
      let cart = JSON.parse(localStorage.getItem('fidanCart')) || [];
      const existing = cart.find(item => item.id === selectedFidan.id);
      
      if(existing) {
        existing.qty += currentQty;
      } else {
        cart.push({ ...selectedFidan, qty: currentQty });
      }
      
      localStorage.setItem('fidanCart', JSON.stringify(cart));
      showToast(`🌿 ${selectedFidan.title} (${currentQty} Adet) sepete eklendi!`);
      closeFidanModal();
    });
  }

  function closeFidanModal() {
    const backdrop = document.getElementById('fidanOzelModal');
    if(backdrop) backdrop.classList.add('is-hidden');
  }

  window.acFidanPenceresi = function(id) {
    initModalHTML(); 
    const fidan = fidanlarDB.find(f => f.id == id);
    if(!fidan) return;

    selectedFidan = fidan;
    currentQty = 1;

    document.getElementById('fModalTitle').textContent = fidan.title;
    document.getElementById('fModalPrice').textContent = `₺${fidan.price}`;
    document.getElementById('fModalCategory').textContent = fidan.category;
    const shortName = fidan.title.split(' ')[0];
    document.getElementById('fModalImg').src = `https://placehold.co/400x500/eef2eb/2a3c24?text=${encodeURIComponent(shortName)}`;
    document.getElementById('fQtyValue').textContent = currentQty;

    document.getElementById('fidanOzelModal').classList.remove('is-hidden');
  };

  function renderFidanlar() {
    const grid = document.getElementById('movieGrid');
    const oops = document.getElementById('oopsMessage');
    if(!grid) return;
    
    let filteredList = fidanlarDB.filter(fidan => {
      const matchCategory = currentCategory === "Tüm Kategoriler" || fidan.category === currentCategory;
      const matchSearch = fidan.title.toLowerCase().includes(currentSearchQuery);
      return matchCategory && matchSearch;
    });

    if (filteredList.length === 0) {
      grid.innerHTML = '';
      if(oops) oops.classList.remove('hidden');
      return;
    } else {
      if(oops) oops.classList.add('hidden');
    }

    const markup = filteredList.map(fidan => {
      const shortName = fidan.title.split(' ')[0];
      const placeholderImg = `https://placehold.co/300x350/eef2eb/2a3c24?text=${encodeURIComponent(shortName)}`;

      return `
        <li class="movie-card" onclick="acFidanPenceresi(${fidan.id})" style="cursor: pointer;">
          <img class="movie-card__poster" src="${placeholderImg}" alt="${fidan.title}" loading="lazy" />
          <div class="movie-card__info">
            <h3 class="movie-card__title" title="${fidan.title}">${fidan.title}</h3>
            <div class="movie-card__meta">
              <span class="movie-card__text">${fidan.category}</span>
              <span class="movie-card__stars">₺${fidan.price}</span>
            </div>
          </div>
        </li>
      `;
    }).join('');
    grid.innerHTML = markup;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderFidanlar();

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); currentSearchQuery = searchInput.value.toLowerCase().trim(); renderFidanlar();
      });
      searchInput.addEventListener('input', () => {
        currentSearchQuery = searchInput.value.toLowerCase().trim(); renderFidanlar(); 
      });
    }

    const customSelectBtn = document.querySelector('.custom-select__btn');
    const customSelectList = document.querySelector('.custom-select__list');
    const customSelectLabel = document.querySelector('.custom-select__label');
    
    if (customSelectBtn && customSelectList && customSelectLabel) {
      const categories = ["Tüm Kategoriler", "Meyve", "Narenciye", "Zeytingiller"];
      customSelectList.innerHTML = categories.map(cat => `<li data-value="${cat}">${cat}</li>`).join('');

      customSelectBtn.addEventListener('click', (e) => {
        e.preventDefault(); customSelectList.classList.toggle('hide');
      });

      customSelectList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          currentCategory = e.target.getAttribute('data-value');
          customSelectLabel.textContent = currentCategory;
          customSelectList.classList.add('hide');
          renderFidanlar();
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select')) { customSelectList.classList.add('hide'); }
      });
    }
  });
} catch (error) { console.error("Fidan Dünyası JS Hatası:", error); }