const { Sequelize, DataTypes } = require("sequelize");
const DatabaseManager = require("../DatabaseManager");

class PostgresDatabaseManager extends DatabaseManager {
  async init() {
    const sequelize = new Sequelize(
      process.env.PG_DB,
      process.env.PG_USER,
      process.env.PG_PASSWORD,
      {
        host: process.env.PG_HOST || "127.0.0.1",
        port: process.env.PG_PORT || 5432,
        dialect: "postgres",
        logging: false,
      }
    );

    try {
      await sequelize.authenticate();
      console.log("[DB] Connected to PostgreSQL");

      this.Playlist = sequelize.define("Playlist", {
        name: { type: DataTypes.STRING, allowNull: false },
        ownerEmail: { type: DataTypes.STRING, allowNull: false },
        songs: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      });

      this.User = sequelize.define("User", {
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
      });

      await sequelize.sync();
      this.sequelize = sequelize;
    } catch (err) {
      console.error("[DB] Failed to connect to Postgres:", err);
      throw err;
    }
  }

  async connect() {
    return this.init();
  }
  async createPlaylist(data) {
    return this.Playlist.create(data);
  }

  async getPlaylistById(id) {
    return this.Playlist.findByPk(id);
  }

  async getPlaylistPairs(ownerEmail) {
    const lists = await this.Playlist.findAll({
      where: { ownerEmail },
      attributes: ["id", "name"],
    });
    return lists.map((p) => ({ _id: p.id, name: p.name }));
  }

  async updatePlaylist(id, data) {
    const playlist = await this.getPlaylistById(id);
    if (!playlist) return null;
    await playlist.update(data);
    return playlist;
  }

  async deletePlaylist(id) {
    const playlist = await this.getPlaylistById(id);
    if (!playlist) return null;
    await playlist.destroy();
    return playlist;
  }

  async getUserByEmail(email) {
    return this.User.findOne({ where: { email } });
  }
}

module.exports = PostgresDatabaseManager;
