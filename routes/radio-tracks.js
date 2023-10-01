var express = require("express");
var router = express.Router();

const Validator = require("fastest-validator");
const { RadioTracks } = require("../models");
const controller = require("../controllers/radio-tracks-controller");

const v = new Validator();

/* GET all radio tracks */
router.get("/", controller.getAllRadioTracks);

/* GET radio track by ID */
router.get("/:id", controller.getRadioTrackByID);

/* POST radio track */
router.post("/", controller.createRadioTracks);

/* UPDATE radio track by ID */
router.put("/:id", controller.updateRadioTracks);

/* DELETE radio track by ID */
router.delete("/:id", controller.deleteRadioTrackByID);

module.exports = router;
