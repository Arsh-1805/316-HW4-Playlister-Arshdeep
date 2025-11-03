const dotenv = require('dotenv');
dotenv.config();

const manager = (process.env.DB_MANAGER || 'mongo').toLowerCase();

let db;
if (manager === 'postgres') {
  db = require('./postgresql');
  console.log('Using PostgreSQL DatabaseManager');
} else {
  db = require('./mongodb');
  console.log('Using MongoDB DatabaseManager');
}

module.exports = db;