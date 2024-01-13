require("dotenv").config();
/**
 * @module
 * @name token-utils
 *  */

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

/**
 * @function
 * @summary This function is used to generate token with JWT using user credentials.
 * @param {User} user - The {@link Users User} object for which the token is to be generated.
 * @returns {JSON} token.
 */
const generateToken = (user) => {
  return jwt.sign({ user }, secret, {
    expiresIn: "1d",
  });
};

/**
 * @function
 * @summary This function is used to verify the JWT token. The required parameter is the User object and the return value is the decoded token.
 * @param {String} token - JWT token to be verified.
 * @returns {JSON} The decoded token.
 */
const verifyToken = (token) => {
  return jwt.verify(token.replace("Bearer ", ""), secret);
};

module.exports = { generateToken, verifyToken };
