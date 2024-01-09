require("dotenv").config();
const { verifyToken } = require("../utils/token-utils");

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

module.exports = {
  accessAllUser,
  accessOnlyAdmin,
};
