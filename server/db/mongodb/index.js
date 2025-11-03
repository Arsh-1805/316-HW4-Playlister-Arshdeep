const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; 
  }
}

module.exports = { connect, mongoose };