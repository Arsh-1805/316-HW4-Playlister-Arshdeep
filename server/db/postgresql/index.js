const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

class PostgresDBManager {
    constructor() {
        this.sequelize = new Sequelize(
            process.env.PG_DB,
            process.env.PG_USER,
            process.env.PG_PASSWORD,
            {
                host: process.env.PG_HOST,
                port: process.env.PG_PORT,
                dialect: 'postgres'
            }
        );

        this.User = this.sequelize.define('User', {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: { type: DataTypes.STRING, unique: true },
            passwordHash: DataTypes.STRING
        });

        this.Playlist = this.sequelize.define('Playlist', {
            name: DataTypes.STRING,
            ownerEmail: DataTypes.STRING,
            songs: DataTypes.JSONB
        });
    }

    async connect() {
        await this.sequelize.authenticate();
        await this.sequelize.sync();
    }

    async getUserByEmail(email) {
        await this.connect();
        return await this.User.findOne({ where: { email } });
    }

    async createUser(userData) {
        await this.connect();
        return await this.User.create(userData);
    }

    async getPlaylistPairs() {
        await this.connect();
        const playlists = await this.Playlist.findAll();
        return playlists.map((p) => ({
            _id: p.id,
            name: p.name,
            ownerEmail: p.ownerEmail
        }));
    }

    async getPlaylistById(id) {
        await this.connect();
        return await this.Playlist.findByPk(id);
    }

    async createPlaylist(data) {
        await this.connect();
        return await this.Playlist.create(data);
    }

    async updatePlaylistById(id, data) {
        await this.connect();
        const playlist = await this.Playlist.findByPk(id);
        return await playlist.update(data);
    }

    async deletePlaylistById(id) {
        await this.connect();
        const playlist = await this.Playlist.findByPk(id);
        return await playlist.destroy();
    }
}

module.exports = new PostgresDBManager();
