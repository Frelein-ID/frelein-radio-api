var express = require("express");
var router = express.Router();
const controller = require("../controllers/radio-tracks-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  verifyAccessToken,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

/* GET all radio tracks */
router.get("/", [verifyAccessToken, accessAllUser], controller.getAll);

/* GET radio track by ID */
router.get("/:id", [verifyAccessToken, accessAllUser], controller.get);

/* POST radio track */
router.post(
  "/",
  [verifyAccessToken, accessOnlyAdmin, recordHistory],
  controller.create
);

/* UPDATE radio track by ID */
router.put(
  "/:id",
  [verifyAccessToken, accessOnlyAdmin, recordHistory],
  controller.update
);

/* DELETE radio track by ID */
router.delete(
  "/:id",
  [verifyAccessToken, accessOnlyAdmin, recordHistory],
  controller.delete
);

module.exports = router;
