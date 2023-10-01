var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");
const controller = require("../controllers/radio-info-controller");

const v = new Validator();

/* GET all radio info */
router.get("/", controller.getAllRadioInfo);

/* GET radio info by ID*/
router.get("/:id", controller.getRadioInfoByID);

/* POST radio info */
router.post("/", controller.createRadioInfo);

/* UPDATE radio info by ID */
router.put("/:id", controller.updateRadioInfo);

/* DELETE radio info by ID */
router.delete("/:id", controller.deleteRadioInfo);

module.exports = router;
