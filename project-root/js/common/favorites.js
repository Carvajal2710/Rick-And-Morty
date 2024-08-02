//almacenar favoritos en el localstorage
const favoritesKey = "favorites";

//funcion para obtenr favoritos de localstorage
const getFavoritesFromStorage = () => {
  const storedFavorites = localStorage.getItem(favoritesKey);
  console.log("Favorites from storage:", storedFavorites);
  return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
};

let favorites = getFavoritesFromStorage();

//funcion para guardar en el localstorage
const saveFavoritesToStorage = () => {
  localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
  console.log("Favorites saved to storage:", [...favorites]);
};

//funcion para alternar el estado de favoritos
const toggleFavorite = (characterId) => {
  if (favorites.has(characterId)) {
    favorites.delete(characterId);
    Swal.fire("Se a quitado de favoritos");
  } else {
    favorites.add(characterId);
    Swal.fire("Se a añadido a favoritos");
  }
  saveFavoritesToStorage();
  return favorites.has(characterId);
};
// verificamos si es un personaje favorito
const isFavorite = (characterId) => favorites.has(characterId);

// Función temporal para verificar el contenido de localStorage
const logFavorites = () => {
  console.log(
    "Current favorites in localStorage:",
    JSON.parse(localStorage.getItem(favoritesKey))
  );
};

export { toggleFavorite, isFavorite, logFavorites, getFavoritesFromStorage };
