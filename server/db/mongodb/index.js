const mongoose = require('mongoose');
const Playlist = require('../../models/playlist-model');
const User = require('../../models/user-model');
const dotenv = require('dotenv');
dotenv.config();

class MongoDBManager {
    async connect() {
        if (mongoose.connection.readyState === 1) return;
        await mongoose
            .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(e => console.error('Mongo connection error', e.message));
    }

    async getUserByEmail(email) {
        await this.connect();
        return await User.findOne({ email });
    }

    async createUser(userData) {
        await this.connect();
        const user = new User(userData);
        return await user.save();
    }

    async getPlaylistPairs() {
        await this.connect();
        const playlists = await Playlist.find({});
        return playlists.map((p) => ({
            _id: p._id,
            name: p.name,
            ownerEmail: p.ownerEmail
        }));
    }

    async getPlaylistById(id) {
        await this.connect();
        return await Playlist.findById(id);
    }

    async createPlaylist(data) {
        await this.connect();
        const playlist = new Playlist(data);
        return await playlist.save();
    }

    async updatePlaylistById(id, data) {
        await this.connect();
        return await Playlist.findByIdAndUpdate(id, data, { new: true });
    }

    async deletePlaylistById(id) {
        await this.connect();
        return await Playlist.findByIdAndDelete(id);
    }
}

module.exports = new MongoDBManager();
