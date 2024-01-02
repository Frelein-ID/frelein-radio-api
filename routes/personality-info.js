var express = require("express");
var router = express.Router();
const controller = require("../controllers/personality-info-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

/* GET all personality info */
router.get("/", accessAllUser, controller.getAllPersonalityInfo);

/* GET personality info by ID */
router.get("/:id", accessAllUser, controller.getPersonalityInfoByID);

/* POST personality info */
router.post("/", accessOnlyAdmin, controller.createNewPersonality);

/* UPDATE personality info by ID */
router.put("/:id", accessOnlyAdmin, controller.updatePersonalityById);

/* DELETE personality info by ID */
router.delete("/:id", accessOnlyAdmin, controller.deletePersonalityInfoByID);

module.exports = router;
