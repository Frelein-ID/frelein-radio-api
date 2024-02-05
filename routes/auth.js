const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth-controller");
const {
  verifyAccessToken,
  logLogin,
} = require("../middleware/auth-middleware");

router.post("/login", [verifyAccessToken, logLogin], controller.login);

router.post("/register", [verifyAccessToken], controller.register);

module.exports = router;
