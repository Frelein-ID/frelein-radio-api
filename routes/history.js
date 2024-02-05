var express = require("express");
var router = express.Router();
const controller = require("../controllers/history-controller");
const {
  verifyAccessToken,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

/* GET all history */
router.get("/", [verifyAccessToken, accessOnlyAdmin], controller.getAll);

/* GET history by ID */
router.get("/:id", [verifyAccessToken, accessOnlyAdmin], controller.get);

module.exports = router;
