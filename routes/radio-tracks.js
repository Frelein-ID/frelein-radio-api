var express = require("express");
var router = express.Router();

const controller = require("../controllers/radio-tracks-controller");

/* GET all radio tracks */
router.get("/", controller.getAll);

/* GET radio track by ID */
router.get("/:id", controller.get);

/* POST radio track */
router.post("/", controller.create);

/* UPDATE radio track by ID */
router.put("/:id", controller.update);

/* DELETE radio track by ID */
router.delete("/:id", controller.delete);

module.exports = router;
