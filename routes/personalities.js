var express = require("express");
var router = express.Router();
const controller = require("../controllers/personalities-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

/* GET all personality info */
router.get("/", [accessAllUser], controller.getAll);

/* GET personality info by ID */
router.get("/:id", [accessAllUser], controller.get);

/* POST personality info */
router.post("/", [accessOnlyAdmin, recordHistory], controller.create);

/* UPDATE personality info by ID */
router.put("/:id", [accessOnlyAdmin, recordHistory], controller.update);

/* DELETE personality info by ID */
router.delete("/:id", [accessOnlyAdmin, recordHistory], controller.delete);

module.exports = router;
