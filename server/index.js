const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// import routers AFTER middleware
const authRouter = require('./routes/auth-router');
const playlistRouter = require('./routes/playlist-router');
const storeRouter = require('./routes/store-router');

app.use('/auth', authRouter);
app.use('/api', playlistRouter);
app.use('/store', storeRouter);

// db
const db = require('./db');
db.on('error', console.error.bind(console, 'Database connection error:'));

app.listen(PORT, () => console.log(`Playlister Server running on port ${PORT}`));