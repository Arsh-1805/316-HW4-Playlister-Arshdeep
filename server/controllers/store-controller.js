// server/controllers/store-controller.js
const Playlist = require('../models/playlist-model');

// GET /store/playlistpairs
async function getPlaylistPairs(req, res) {
  try {
    const playlists = await Playlist.find({});
    const pairs = playlists.map((p) => ({
      _id: p._id,
      name: p.name,
      ownerEmail: p.ownerEmail,
    }));
    return res.status(200).json(pairs);
  } catch (err) {
    console.error('getPlaylistPairs error:', err);
    return res.status(500).json({ error: 'Failed to fetch playlists' });
  }
}

// GET /store/playlist/:id
async function getPlaylistById(req, res) {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    return res.status(200).json(playlist);
  } catch (err) {
    console.error('getPlaylistById error:', err);
    return res.status(500).json({ error: 'Failed to fetch playlist' });
  }
}

// POST /store/playlist
async function createPlaylist(req, res) {
  try {
    const newPlaylist = new Playlist(req.body);
    await newPlaylist.save();
    return res.status(200).json(newPlaylist);
  } catch (err) {
    console.error('createPlaylist error:', err);
    return res.status(500).json({ error: 'Failed to create playlist' });
  }
}

// PUT /store/playlist/:id
async function updatePlaylistById(req, res) {
  try {
    const updated = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updated);
  } catch (err) {
    console.error('updatePlaylistById error:', err);
    return res.status(500).json({ error: 'Failed to update playlist' });
  }
}

// DELETE /store/playlist/:id
async function deletePlaylistById(req, res) {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Playlist deleted' });
  } catch (err) {
    console.error('deletePlaylistById error:', err);
    return res.status(500).json({ error: 'Failed to delete playlist' });
  }
}

module.exports = {
  getPlaylistPairs,
  getPlaylistById,
  createPlaylist,
  updatePlaylistById,
  deletePlaylistById,
};
