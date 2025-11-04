const mongoose = require("mongoose");
const DatabaseManager = require("../DatabaseManager");
const Playlist = require("../../models/playlist-model");
const User = require("../../models/user-model");

class MongoDatabaseManager extends DatabaseManager {
  async init() {
    const url = process.env.DB_CONNECT || "mongodb://127.0.0.1:27017/playlister";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[DB] Connected to MongoDB");
  }

  async connect() {
    return this.init();
  }

  async getUserByEmail(email) {
    return User.findOne({ email });
  }

  async createPlaylist(data) {
    const playlist = new Playlist(data);
    return playlist.save();
  }

  async getPlaylistById(id) {
    return Playlist.findById(id);
  }

  async getPlaylistPairs(ownerEmail) {
    const lists = await Playlist.find({ ownerEmail });
    return lists.map((p) => ({ _id: p._id, name: p.name }));
  }

  async updatePlaylist(id, data) {
    return Playlist.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePlaylist(id) {
    return Playlist.findByIdAndDelete(id);
  }
}

module.exports = MongoDatabaseManager;
