var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");
const controller = require("../controllers/radio-info-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

const v = new Validator();

/* GET all radio info */
router.get("/", accessAllUser, controller.getAllRadioInfo);

/* GET radio info by ID*/
router.get("/:id", accessAllUser, controller.getRadioInfoByID);

/* POST radio info */
router.post("/", accessOnlyAdmin, controller.createRadioInfo);

/* UPDATE radio info by ID */
router.put("/:id", accessOnlyAdmin, controller.updateRadioInfo);

/* DELETE radio info by ID */
router.delete("/:id", accessOnlyAdmin, controller.deleteRadioInfo);

module.exports = router;
