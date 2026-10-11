export const SAVED_MOVIES_KEY = 'fidan-saved-items'; // Key'i değiştirdik
export const LIBRARY_ADD_EVENT = 'fidan:cart:add';
export const LIBRARY_REMOVE_EVENT = 'fidan:cart:remove';

function safeParseSavedMovies(rawValue) {
  try {
    const parsedValue = JSON.parse(rawValue || '[]');
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error('Kayıtlı fidanları okuma hatası:', error);
    return [];
  }
}

export function readSavedMovies() {
  return safeParseSavedMovies(localStorage.getItem(SAVED_MOVIES_KEY));
}

export function isMovieSaved(fidanId) {
  return readSavedMovies().some(saved => String(saved.id) === String(fidanId));
}

// Gelen veriyi sepet formatına uyarlıyoruz
export function normalizeMovieForLibrary(fidan) {
  return {
    id: fidan.id,
    title: fidan.title,
    image: fidan.image || '',
    price: fidan.price || 0,
    category: fidan.category || 'Belirtilmemiş',
    desc: fidan.desc || ''
  };
}

export function saveMovieToLibrary(fidan) {
  const savedMovies = readSavedMovies();

  if (savedMovies.some(saved => String(saved.id) === String(fidan.id))) {
    return false; // Zaten sepette
  }

  const fidanSummary = normalizeMovieForLibrary(fidan);

  localStorage.setItem(
    SAVED_MOVIES_KEY,
    JSON.stringify([...savedMovies, fidanSummary])
  );

  document.dispatchEvent(
    new CustomEvent(LIBRARY_ADD_EVENT, {
      detail: fidanSummary,
    })
  );

  return true;
}

export function removeMovieFromLibrary(fidanId) {
  const savedMovies = readSavedMovies();
  const nextSavedMovies = savedMovies.filter(
    saved => String(saved.id) !== String(fidanId)
  );

  if (nextSavedMovies.length === savedMovies.length) {
    return false;
  }

  localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(nextSavedMovies));

  document.dispatchEvent(
    new CustomEvent(LIBRARY_REMOVE_EVENT, {
      detail: { movieId: fidanId },
    })
  );

  return true;
}

export function getLatestSavedMovie() {
  const savedMovies = readSavedMovies();
  return savedMovies[savedMovies.length - 1] || null;
}