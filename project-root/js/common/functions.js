import { fetchCharacters } from "../../services/api.js";
import { toggleFavorite, isFavorite } from "../common/favorites.js";

const charactersDiv = document.getElementById("characters");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageInfo = document.getElementById("page-info");
const searchBox = document.getElementById("search");
const statusFilter = document.getElementById("status-filter");
let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let currentStatusFilter = "";

// Función para mostrar los personajes en la página
const createCharacterElement = (character) => {
  const characterElement = document.createElement("div");
  const isFav = isFavorite(character.id);
  characterElement.innerHTML = `
    <h2 class="nombre">${character.name}</h2>
    <img src="${character.image}" alt="${character.name}">
    <p><strong>Status:</strong> ${character.status}</p>
    <p><strong>Species:</strong> ${character.species}</p>
    <p><strong>Type:</strong> ${character.type || "Unknown"}</p>
    <p><strong>Gender:</strong> ${character.gender}</p>
    <p><strong>Origin:</strong> ${character.origin.name}</p>
    <p><strong>Location:</strong> ${character.location.name}</p>
    <button class="favorite-btn" data-id="${character.id}">
      <i class="fas fa-heart heart ${isFav ? "favorite" : ""}"></i>
    </button>
  `;

  // Añadir evento al botón de favorito
  const favButton = characterElement.querySelector(".favorite-btn");
  if (favButton) {
    favButton.addEventListener("click", (event) => {
      const characterId = parseInt(event.currentTarget.dataset.id);
      const isFav = toggleFavorite(characterId);
      const heart = event.currentTarget.querySelector(".heart");
      heart.classList.toggle("favorite", isFav);
    });
  }

  return characterElement;
};

// Función para mostrar los personajes
const displayCharacters = (characters) => {
  charactersDiv.innerHTML = "";
  characters.slice(0, 6).forEach((character) => {
    const characterElement = createCharacterElement(character);
    charactersDiv.appendChild(characterElement);
  });
};

const updateButtons = () => {
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
};

const updatePageInfo = () => {
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
};

const loadCharacters = (page, query = "", status = "") => {
  fetchCharacters(page, query, status).then((data) => {
    displayCharacters(data.results);
    currentPage = page;
    totalPages = data.info.pages;
    updateButtons();
    updatePageInfo();
  });
};

const searchForCharacters = (query) => {
  currentQuery = query.trim();
  if (currentQuery || currentStatusFilter) {
    loadCharacters(1, currentQuery, currentStatusFilter);
  } else {
    loadCharacters(1, currentQuery);
  }
};

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    if (currentQuery || currentStatusFilter) {
      loadCharacters(currentPage + 1, currentQuery, currentStatusFilter);
    } else {
      loadCharacters(currentPage + 1);
    }
  }
});

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    if (currentQuery || currentStatusFilter) {
      loadCharacters(currentPage - 1, currentQuery, currentStatusFilter);
    } else {
      loadCharacters(currentPage - 1);
    }
  }
});

searchBox.addEventListener("input", () => {
  searchForCharacters(searchBox.value);
});

statusFilter.addEventListener("change", () => {
  currentStatusFilter = statusFilter.value;
  if (currentQuery || currentStatusFilter) {
    loadCharacters(1, currentQuery, currentStatusFilter);
  } else {
    loadCharacters(1, "", currentStatusFilter);
  }
});

// Llamada inicial para obtener y mostrar personajes
loadCharacters(currentPage);
