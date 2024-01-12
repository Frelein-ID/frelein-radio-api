var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-personality-controller");
const { accessAllUser } = require("../middleware/auth-middleware");

router.get("/", [accessAllUser], controller.getAllUsersFavPersonality);

// GET all users fav personality by user id
router.get("/:id", [accessAllUser], controller.getUsersFavPersonalityByUserID);

// POST users fav personality
router.post("/", [accessAllUser], controller.createUsersFavPersonality);

// DELETE users fav personality by ID
router.delete("/:id", [accessAllUser], controller.deleteUsersFavPersonality);

module.exports = router;
