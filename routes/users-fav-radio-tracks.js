var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-radio-tracks-controller");
const { accessAllUser } = require("../middleware/auth-middleware");

// GET all users fav radio tracks by user id
router.get("/:id", [accessAllUser], controller.getUsersFavRadioTracksByUserID);

// POST users fav radio tracks
router.post("/", [accessAllUser], controller.createUsersFavRadioTracks);

// DELETE users fav radio tracks by ID
router.delete("/:id", [accessAllUser], controller.deleteUsersFavRadioTracks);

module.exports = router;
