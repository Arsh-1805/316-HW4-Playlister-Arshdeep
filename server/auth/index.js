const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

function signToken(userId) {
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

function verifyUser(req) {
    try {
        const token = req.cookies.token;
        if (!token) return null;
        const verified = jwt.verify(token, secret);
        return verified.userId;
    } catch (err) {
        return null;
    }
}

module.exports = { signToken, verifyUser };