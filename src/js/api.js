// Fidan Dünyası projesi için dış API (TMDB) bağlantıları tamamen devre dışı bırakılmıştır.
// Projenin çökmemesi ve diğer dosyalardaki import'ların hata vermemesi için 
// fonksiyon isimleri korunmuş, ancak içleri boşaltılmıştır (Lokal statik veri kullanılıyor).

export const TMDB_CONFIG_ERROR = 'API bağlantısı iptal edildi, lokal fidan verileri kullanılıyor.';
export const hasTmdbKey = () => true;
export const getApiKey = () => 'NO_API_KEY_NEEDED';

export const getTrending = async (timeWindow = 'day') => {
  return { results: [] };
};

export const getTrendingPaged = async (page = 1, timeWindow = 'week') => {
  return { results: [], total_pages: 1 };
};

export const getUpcoming = async () => {
  return { results: [] };
};

export const searchMovies = async (query, page = 1, year = '') => {
  return { results: [], total_pages: 1 };
};

export const getMovieDetails = async (movieId) => {
  return {};
};

export const getMovieVideos = async (movieId) => {
  return { results: [] };
};

export const getGenres = async () => {
  return new Map();
};

export const convertGenreIdsToNames = async (genreIds) => {
  return [];
};