const STORAGE_KEY = 'afi_favorites';

export function getFavorites(): number[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(productId: number): boolean {
  const favs = getFavorites();
  const index = favs.indexOf(productId);
  if (index === -1) {
    favs.push(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    return true;
  } else {
    favs.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    return false;
  }
}

export function isFavorite(productId: number): boolean {
  return getFavorites().includes(productId);
}
