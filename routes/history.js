var express = require("express");
var router = express.Router();
const controller = require("../controllers/history-controller");
const { accessOnlyAdmin } = require("../middleware/auth-middleware");

/* GET all history */
router.get("/", [accessOnlyAdmin], controller.getAll);

/* GET history by ID */
router.get("/:id", [accessOnlyAdmin], controller.get);

module.exports = router;
