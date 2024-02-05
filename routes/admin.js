const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin-controller");
const {
  verifyAccessToken,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

router.get(
  "/statistics",
  [verifyAccessToken, accessOnlyAdmin],
  controller.statistics
);

module.exports = router;
