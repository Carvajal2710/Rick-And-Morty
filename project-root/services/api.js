const apiURL = "https://rickandmortyapi.com/api/character";
const handleFetch = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error, status: ${response.status}`);
  }
  return await response.json();
};

//Funcion de busqueda y los filtros
const fetchCharacters = async (page, query = "", status = "") => {
  try {
    let url = `${apiURL}?page=${page}`;
    if (query) {
      url += `&name=${query}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    const response = await fetch(url);
    return handleFetch(response);
  } catch (error) {
    console.error("error fetching data", error);
    throw error;
  }
};
//funcion para obtener los id de los personajes
const fetchCharacterById = async (id) => {
  try {
    const response = await fetch(`${apiURL}/${id}`);
    return handleFetch(response);
  } catch (error) {
    console.error("error fetching character", error);
    throw error;
  }
};

export { fetchCharacters, fetchCharacterById };
