const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/playlist-controller');

router.post('/playlist', PlaylistController.createPlaylist);
router.put('/playlist/:id', PlaylistController.updatePlaylist);
router.delete('/playlist/:id', PlaylistController.deletePlaylist);
router.get('/playlist/:id', PlaylistController.getPlaylistById);
router.get('/playlistpairs', PlaylistController.getPlaylistPairs);
router.get('/playlists', PlaylistController.getPlaylists);

module.exports = router;