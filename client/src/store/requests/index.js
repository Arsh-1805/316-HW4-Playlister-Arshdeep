const API_BASE_URL = "http://localhost:4000/api";

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return await response.json();
}

export const getPlaylistPairs = () => {
  return fetchJSON(`${API_BASE_URL}/playlistpairs`, { method: "GET" });
};

export const getPlaylistById = (id) => {
  return fetchJSON(`${API_BASE_URL}/playlist/${id}`, { method: "GET" });
};

export const createPlaylist = (name, songs, email) => {
  return fetchJSON(`${API_BASE_URL}/playlist/`, {
    method: "POST",
    body: JSON.stringify({ name, songs, ownerEmail: email }),
  });
};

export const updatePlaylistById = (id, playlist) => {
  return fetchJSON(`${API_BASE_URL}/playlist/${id}`, {
    method: "PUT",
    body: JSON.stringify(playlist),
  });
};

export const deletePlaylistById = (id) => {
  return fetchJSON(`${API_BASE_URL}/playlist/${id}`, { method: "DELETE" });
};

const apis = {
  getPlaylistPairs,
  getPlaylistById,
  createPlaylist,
  updatePlaylistById,
  deletePlaylistById,
};

export default apis;
