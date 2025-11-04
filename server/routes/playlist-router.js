const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/playlist-controller');

router.get('/playlistpairs', PlaylistController.getPlaylistPairs);

router.get('/playlist/:id', PlaylistController.getPlaylistById);

router.delete('/playlist/:id', PlaylistController.deletePlaylist);

router.put('/playlist/:id', PlaylistController.updatePlaylist);

module.exports = router;
