var express = require("express");
var router = express.Router();
const controller = require("../controllers/personality-info-controller");

/* GET all personality info */
router.get("/", controller.getAllPersonalityInfo);

/* GET personality info by ID */
router.get("/:id", controller.getPersonalityInfoByID);

/* POST personality info */
router.post("/", controller.createNewPersonality);

/* UPDATE personality info by ID */
router.put("/:id", controller.updatePersonalityById);

/* DELETE personality info by ID */
router.delete("/:id", controller.deletePersonalityInfoByID);

module.exports = router;
