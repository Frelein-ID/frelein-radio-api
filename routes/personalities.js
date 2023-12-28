var express = require("express");
var router = express.Router();
const controller = require("../controllers/personalities-controller");

/* GET all personality info */
router.get("/", controller.getAllPersonalities);

/* GET personality info by ID */
router.get("/:id", controller.getPersonalitiesByRadioTracksID);

/* POST personality info */
router.post("/", controller.createPersonalities);

/* UPDATE personality info by ID */
router.put("/:id", controller.updatePersonalities);

/* DELETE personality info by ID */
router.delete("/:id", controller.deletePersonalitiesByID);

module.exports = router;
