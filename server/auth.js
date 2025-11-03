const jwt = require("jsonwebtoken");

function signToken(userId) {
  return jwt.sign(
    {
      userId: userId
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function verifyUser(req) {
  try {
    const token = req.cookies.token;
    if (!token) return null;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return verified.userId;
  } catch (err) {
    return null;
  }
}

module.exports = {
  signToken,
  verifyUser,
};