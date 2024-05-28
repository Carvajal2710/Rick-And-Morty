document.addEventListener("DOMContentLoaded", () => {
    const apiURL = 'https://rickandmortyapi.com/api/character';
    const charactersDiv = document.getElementById('characters');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageInfo = document.getElementById('page-info');
    let currentPage = 1;
    let totalPages = 1;

    // Función para obtener datos de la API
    function fetchCharacters(page) {
        fetch(`${apiURL}?page=${page}`)
            .then(response => response.json())
            .then(data => {
                displayCharacters(data.results);
                currentPage = page;
                totalPages = data.info.pages;
                updateButtons();
                updatePageInfo();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Función para mostrar los personajes en la página
    function displayCharacters(characters) {
        charactersDiv.innerHTML = ''; // Limpiar el contenido anterior
        characters.slice(0, 6).forEach(character => {
            const characterElement = document.createElement('div');
            characterElement.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
                <h2>${character.name}</h2>
                <p><strong>Status:</strong> ${character.status}</p>
                <p><strong>Species:</strong> ${character.species}</p>
                <p><strong>Type:</strong> ${character.type || 'Unknown'}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
                <p><strong>Origin:</strong> ${character.origin.name}</p>
                <p><strong>Location:</strong> ${character.location.name}</p>
                
            `;
            charactersDiv.appendChild(characterElement);
        });
    }

    // Función para actualizar el estado de los botones
    function updateButtons() {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    // Función para actualizar la información de la página
    function updatePageInfo() {
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }

    // Evento para el botón de siguiente página
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchCharacters(currentPage + 1);
        }
    });

    // Evento para el botón de página anterior
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchCharacters(currentPage - 1);
        }
    });

    // Llamada inicial para obtener y mostrar personajes
    fetchCharacters(currentPage);
});
