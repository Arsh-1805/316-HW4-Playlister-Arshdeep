const API_BASE_URL = "http://localhost:4000";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",            
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  const data = await res.json();
  return { status: res.status, data };
}

export const getPlaylistPairs = () =>
  fetchJSON(`${API_BASE_URL}/api/playlistpairs`, {
    method: "GET",
  });

export const createPlaylist = () =>
  fetchJSON(`${API_BASE_URL}/store/playlist`, {
    method: "POST",
    body: JSON.stringify({}), 
  });

export const updatePlaylist = (id, playlist) =>
  fetchJSON(`${API_BASE_URL}/store/playlist/${id}`, {
    method: "PUT",
    body: JSON.stringify({ playlist }),
  });

export const deletePlaylist = (id) =>
  fetchJSON(`${API_BASE_URL}/store/playlist/${id}`, {
    method: "DELETE",
  });

const apis = {
  getPlaylistPairs,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
};

export default apis;
