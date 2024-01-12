require("dotenv").config();
const { verifyToken } = require("../utils/token-utils");
const model = require("../models");
const User = model.Users;
const LoginLogs = model.LoginLogs;

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
