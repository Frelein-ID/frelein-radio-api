const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth-controller");
const { logLogin } = require("../middleware/auth-middleware");

router.post("/login", [logLogin], controller.login);

router.post("/register", controller.register);

module.exports = router;
