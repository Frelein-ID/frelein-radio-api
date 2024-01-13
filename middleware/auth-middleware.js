/**
 * @module
 * @name auth-middleware
 *  */

// Import required modules
require("dotenv").config();
const { verifyToken } = require("../utils/token-utils");
const model = require("../models");
const User = model.Users;
const LoginLogs = model.LoginLogs;

/**
 * @function
 * @memberof module:auth-middleware
 * @name accessAllUser
 * @summary Decode user's token and get user information to filter route only can be accessed by user.
 * @param {String} token - User's token JWT.
 * */
const accessAllUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.user.role !== "user" && decoded.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      error: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth-middleware
 * @name accessOnlyAdmin
 * @summary Decode user's token and get user information to filter route only can be accessed by admin.
 * @param {String} token - User's token JWT.
 * */
const accessOnlyAdmin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized. Only admin allowed." });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      error: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth-middleware
 * @name logLogin
 * @summary Log user login activity.
 * @param {String} email - User's email.
 * @param {String} ipAddress - User's IP Address.
 * @param {String} userAgent - User's user agent.
 * @param {String} loginTime - User's login time.
 * */
const logLogin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    const ipAddress = req.ip;
    const userAgent = req.get("user-agent");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    await LoginLogs.create({
      users_id: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent,
      loginTime: new Date(),
    });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  logLogin,
  accessAllUser,
  accessOnlyAdmin,
};
