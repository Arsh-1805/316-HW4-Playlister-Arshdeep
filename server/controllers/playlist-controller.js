// server/controllers/playlist-controller.js
const Playlist = require('../models/playlist-model');
const User = require('../models/user-model');
const auth = require('../auth');

/*
    Controller functions for playlist endpoints
*/

const createPlaylist = (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });
    }

    const body = req.body;
    console.log("createPlaylist body:", body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        });
    }

    const playlist = new Playlist(body);
    if (!playlist) {
        return res.status(400).json({ success: false, error: 'Playlist not created' });
    }

    // tie it to the logged-in user
    User.findById(userId, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ errorMessage: 'User not found' });
        }

        // make sure playlist has an ownerEmail
        if (!playlist.ownerEmail) {
            playlist.ownerEmail = user.email;
        }

        user.playlists.push(playlist._id);

        user.save().then(() => {
            playlist.save()
                .then(() => {
                    return res.status(201).json({ playlist });
                })
                .catch(error => {
                    console.warn('playlist save error:', error);
                    return res.status(400).json({
                        errorMessage: 'Playlist Not Created!'
                    });
                });
        });
    });
};

const deletePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });
    }

    console.log("delete Playlist with id:", req.params.id);

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
        return res.status(404).json({ errorMessage: 'Playlist not found!' });
    }

    const owner = await User.findOne({ email: playlist.ownerEmail });
    if (!owner || owner._id.toString() !== userId.toString()) {
        return res.status(400).json({ errorMessage: 'authentication error' });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
};

const getPlaylistById = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });
    }

    console.log("Find Playlist with id:", req.params.id);

    const list = await Playlist.findById(req.params.id);
    if (!list) {
        return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const owner = await User.findOne({ email: list.ownerEmail });
    if (!owner || owner._id.toString() !== userId.toString()) {
        return res.status(400).json({ success: false, description: 'authentication error' });
    }

    return res.status(200).json({ success: true, playlist: list });
};

const getPlaylistPairs = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });
    }

    console.log("getPlaylistPairs");

    try {
        const user = await User.findById(userId);
        console.log("find user with id", userId);

        if (!user) {
            return res.status(404).json({ errorMessage: "User not found" });
        }

        // find playlists for this user
        console.log("find all Playlists owned by", user.email);
        const playlists = await Playlist.find({ ownerEmail: user.email });
        console.log("found Playlists:", JSON.stringify(playlists));

        // THIS is the shape the React client expects
        const pairs = playlists.map(list => ({
            _id: list._id,
            name: list.name,
            ownerEmail: list.ownerEmail,
        }));

        return res.status(200).json({
            success: true,
            idNamePairs: pairs
        });
    } catch (err) {
        console.error("getPlaylistPairs error:", err);
        return res.status(500).json({ errorMessage: "Failed to get playlist pairs" });
    }
};

const getPlaylists = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });
    }

    const playlists = await Playlist.find({});
    if (!playlists.length) {
        return res.status(404).json({ success: false, error: 'Playlists not found' });
    }
    return res.status(200).json({ success: true, data: playlists });
};

const updatePlaylist = async (req, res) => {
    const userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(401).json({ errorMessage: 'UNAUTHORIZED' });
    }

    const body = req.body;
    console.log("updatePlaylist:", body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found!' });
    }

    const owner = await User.findOne({ email: playlist.ownerEmail });
    if (!owner || owner._id.toString() !== userId.toString()) {
        return res.status(400).json({ success: false, description: 'authentication error' });
    }

    playlist.name = body.playlist.name;
    playlist.songs = body.playlist.songs;

    try {
        await playlist.save();
        return res.status(200).json({
            success: true,
            id: playlist._id,
            message: 'Playlist updated!',
        });
    } catch (error) {
        console.log("FAILURE:", error);
        return res.status(400).json({
            error,
            message: 'Playlist not updated!',
        });
    }
};

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
};
