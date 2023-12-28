require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

module.exports = { generateToken, verifyToken };
