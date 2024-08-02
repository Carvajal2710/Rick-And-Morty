import {
  getFavoritesFromStorage,
  toggleFavorite,
  isFavorite,
} from "../../js/common/favorites.js";
import { fetchCharacterById } from "../../services/api.js";

const favoritesDiv = document.getElementById("favorites");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageInfo = document.getElementById("page-info");

const itemsPerPage = 6; // Número de personajes por página
let currentPage = 1;
let totalPages = 1;
let favorites = [];

// Función para mostrar los personajes favoritos
const displayFavoriteCharacters = async () => {
  favorites = Array.from(getFavoritesFromStorage());
  totalPages = Math.ceil(favorites.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * itemsPerPage; // Calcular el inicio y fin de los personajes al mostrarlos
  const end = start + itemsPerPage;
  const charactersToDisplay = favorites.slice(start, end);

  favoritesDiv.innerHTML = "";

  if (favorites.length === 0) {
    favoritesDiv.innerHTML = "<p>No hay personajes favoritos</p>";
    prevButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  for (const characterId of charactersToDisplay) {
    const character = await fetchCharacterById(characterId);
    const isFav = isFavorite(characterId);
    const characterElement = document.createElement("div");
    characterElement.innerHTML = `
      <h2 class="nombre">${character.name}</h2>
      <img src="${character.image}" alt="${character.name}">
      <p><strong>Status:</strong> ${character.status}</p>
      <p><strong>Species:</strong> ${character.species}</p>
      <p><strong>Type:</strong> ${character.type || "Unknown"}</p>
      <p><strong>Gender:</strong> ${character.gender}</p>
      <p><strong>Origin:</strong> ${character.origin.name}</p>
      <p><strong>Location:</strong> ${character.location.name}</p>
      <button class="favorite-btn" data-id="${characterId}">
        <i class="fas fa-heart heart ${isFav ? "favorite" : ""}"></i>
      </button>
    `;
    favoritesDiv.appendChild(characterElement);
  }

  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`; // Actualizar la info de la página

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  // Añadir evento a los botones de favorito
  document.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const characterId = parseInt(event.currentTarget.dataset.id);
      const isFav = toggleFavorite(characterId);
      const heart = event.currentTarget.querySelector(".heart");
      heart.classList.toggle("favorite", isFav);
      displayFavoriteCharacters(); // Actualizar la lista después de cambiar el estado
    });
  });
};

// Función para manejar el clic en el botón de la página anterior
const handlePrevButtonClick = () => {
  if (currentPage > 1) {
    currentPage--;
    displayFavoriteCharacters();
  }
};

// Función para manejar el clic en el botón de la página siguiente
const handleNextButtonClick = () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayFavoriteCharacters();
  }
};

// Añadir el evento para los botones de paginación
prevButton.addEventListener("click", handlePrevButtonClick);
nextButton.addEventListener("click", handleNextButtonClick);

// Llamada para mostrar personajes favoritos
displayFavoriteCharacters();
