var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-radio-info-controller");
const { accessAllUser } = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history");

// GET all users fav radio tracks by user id
router.get("/:id", [accessAllUser], controller.getUsersFavRadioInfoByUserID);

// POST users fav radio tracks
router.post(
  "/",
  [accessAllUser, recordHistory],
  controller.createUsersFavRadioInfo
);

// DELETE users fav radio tracks by ID
router.delete("/:id", [accessAllUser], controller.deleteUsersFavRadioInfo);

module.exports = router;
