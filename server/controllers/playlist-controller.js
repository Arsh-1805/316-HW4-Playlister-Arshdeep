const Playlist = require('../models/playlist-model');

const getPlaylistPairs = async (req, res) => {
    try {
        const playlists = await Playlist.find({});
        const pairs = playlists.map((playlist) => ({
            _id: playlist._id,
            name: playlist.name,
            ownerEmail: playlist.ownerEmail
        }));
        return res.status(200).json(pairs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch playlists" });
    }
};

const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist)
            return res.status(404).json({ error: "Playlist not found" });
        res.status(200).json(playlist);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch playlist" });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const newPlaylist = new Playlist(req.body);
        await newPlaylist.save();
        res.status(200).json(newPlaylist);
    } catch (err) {
        res.status(500).json({ error: "Failed to create playlist" });
    }
};

const updatePlaylistById = async (req, res) => {
    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedPlaylist);
    } catch (err) {
        res.status(500).json({ error: "Failed to update playlist" });
    }
};

const deletePlaylistById = async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Playlist deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete playlist" });
    }
};

module.exports = {
    getPlaylistPairs,
    getPlaylistById,
    createPlaylist,
    updatePlaylistById,
    deletePlaylistById
};

