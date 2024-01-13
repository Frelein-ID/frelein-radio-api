var express = require("express");
var router = express.Router();
const controller = require("../controllers/personalities-controller");

/* GET all personality info */
router.get("/", controller.getAll);

/* GET personality info by ID */
router.get("/:id", controller.get);

/* POST personality info */
router.post("/", controller.create);

/* UPDATE personality info by ID */
router.put("/:id", controller.update);

/* DELETE personality info by ID */
router.delete("/:id", controller.delete);

module.exports = router;
