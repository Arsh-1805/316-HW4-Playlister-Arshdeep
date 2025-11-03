const express = require("express");
const router = express.Router();
const PlaylistController = require("../controllers/playlist-controller");
const auth = require('../auth');

router.get("/playlistpairs", PlaylistController.getPlaylistPairs);
router.get("/playlist/:id", PlaylistController.getPlaylistById);
router.post("/playlist/", PlaylistController.createPlaylist);
router.put("/playlist/:id", PlaylistController.updatePlaylistById);
router.delete("/playlist/:id", PlaylistController.deletePlaylistById);

module.exports = router;