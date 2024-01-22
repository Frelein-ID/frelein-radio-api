var express = require("express");
var router = express.Router();
const controller = require("../controllers/radio-info-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

/* GET all radio info */
router.get("/", [accessAllUser], controller.getAll);

/* GET radio info by ID*/
router.get("/:id", [accessAllUser], controller.get);

/* POST radio info */
router.post("/", [accessOnlyAdmin, recordHistory], controller.create);

/* UPDATE radio info by ID */
router.put("/:id", [accessOnlyAdmin, recordHistory], controller.update);

/* DELETE radio info by ID */
router.delete("/:id", [accessOnlyAdmin, recordHistory], controller.delete);

module.exports = router;
