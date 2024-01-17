var express = require("express");
var router = express.Router();
const controller = require("../controllers/radio-tracks-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

/* GET all radio tracks */
router.get("/", [accessAllUser], controller.getAll);

/* GET radio track by ID */
router.get("/:id", [accessAllUser], controller.get);

/* POST radio track */
router.post("/", [accessOnlyAdmin], controller.create);

/* UPDATE radio track by ID */
router.put("/:id", [accessOnlyAdmin], controller.update);

/* DELETE radio track by ID */
router.delete("/:id", [accessOnlyAdmin], controller.delete);

module.exports = router;
