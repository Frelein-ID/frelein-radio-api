require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
  return jwt.sign({ user }, secret, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token.replace("Bearer ", ""), secret);
};

module.exports = { generateToken, verifyToken };
