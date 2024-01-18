const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin-controller");
const { accessOnlyAdmin } = require("../middleware/auth-middleware");

router.get("/statistics", [accessOnlyAdmin], controller.statistics);

module.exports = router;
