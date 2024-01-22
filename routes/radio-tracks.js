var express = require("express");
var router = express.Router();
const controller = require("../controllers/radio-tracks-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

/* GET all radio tracks */
router.get("/", [accessAllUser], controller.getAll);

/* GET radio track by ID */
router.get("/:id", [accessAllUser], controller.get);

/* POST radio track */
router.post("/", [accessOnlyAdmin, recordHistory], controller.create);

/* UPDATE radio track by ID */
router.put("/:id", [accessOnlyAdmin, recordHistory], controller.update);

/* DELETE radio track by ID */
router.delete("/:id", [accessOnlyAdmin, recordHistory], controller.delete);

module.exports = router;
