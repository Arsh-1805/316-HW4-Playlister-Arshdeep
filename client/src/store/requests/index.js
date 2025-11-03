/*
 * Store/Playlist HTTP API using Fetch (axios-like return shape)
 */

const API_BASE_URL = "http://localhost:4000/api";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  return { data, status: res.status };
}

/** CREATE NEW PLAYLIST */
export const createPlaylist = (newListName, songs, ownerEmail, ownerUserName) =>
  fetchJSON(`${API_BASE_URL}/playlist/`, {
    method: "POST",
    body: JSON.stringify({
      name: newListName,
      songs,
      ownerEmail,
      ownerUserName,
    }),
  });

/** DELETE PLAYLIST BY ID */
export const deletePlaylistById = (id) =>
  fetchJSON(`${API_BASE_URL}/playlist/${id}`, { method: "DELETE" });

/** GET PLAYLIST BY ID */
export const getPlaylistById = (id) =>
  fetchJSON(`${API_BASE_URL}/playlist/${id}`, { method: "GET" });

/** GET PLAYLIST PAIRS */
export const getPlaylistPairs = () =>
  fetchJSON(`${API_BASE_URL}/playlistpairs/`, { method: "GET" });

/** UPDATE PLAYLIST BY ID */
export const updatePlaylistById = (id, updatedPlaylist) =>
  fetchJSON(`${API_BASE_URL}/playlist/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedPlaylist),
  });

const apis = {
  createPlaylist,
  deletePlaylistById,
  getPlaylistById,
  getPlaylistPairs,
  updatePlaylistById,
};
export default apis;
