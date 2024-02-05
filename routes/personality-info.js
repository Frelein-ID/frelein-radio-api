var express = require("express");
var router = express.Router();
const controller = require("../controllers/personality-info-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  verifyAccessToken,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

/* GET all personality info */
router.get("/", [verifyAccessToken, accessAllUser], controller.getAll);

/* GET personality info by ID */
router.get("/:id", [verifyAccessToken, accessAllUser], controller.get);

/* POST personality info */
router.post(
  "/",
  [verifyAccessToken, accessOnlyAdmin, recordHistory],
  controller.create
);

/* UPDATE personality info by ID */
router.put(
  "/:id",
  [verifyAccessToken, accessOnlyAdmin, recordHistory],
  controller.update
);

/* DELETE personality info by ID */
router.delete(
  "/:id",
  [verifyAccessToken, accessOnlyAdmin, recordHistory],
  controller.delete
);

module.exports = router;
