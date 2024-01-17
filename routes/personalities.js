var express = require("express");
var router = express.Router();
const controller = require("../controllers/personalities-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

/* GET all personality info */
router.get("/", [accessAllUser], controller.getAll);

/* GET personality info by ID */
router.get("/:id", [accessAllUser], controller.get);

/* POST personality info */
router.post("/", [accessOnlyAdmin], controller.create);

/* UPDATE personality info by ID */
router.put("/:id", [accessOnlyAdmin], controller.update);

/* DELETE personality info by ID */
router.delete("/:id", [accessOnlyAdmin], controller.delete);

module.exports = router;
