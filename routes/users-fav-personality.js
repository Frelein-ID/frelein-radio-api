var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-personality-controller");

/* GET all users fav radio tracks */
router.get("/", controller.getAllUsersFavPersonality);

/* POST users fav radio tracks */
router.post("/", controller.createUsersFavPersonality);

/* UPDATE users fav radio tracks by ID */
router.put("/:id", controller.updateUsersFavPersonality);

/* DELETE users fav radio tracks by ID */
router.delete("/:id", controller.deleteUsersFavPersonality);

module.exports = router;
