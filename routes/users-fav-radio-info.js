var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-radio-info-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItself,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

// GET all users fav radio tracks by user id
router.get("/", [accessOnlyAdmin], controller.getAll);

// GET all users fav radio tracks by user id
router.get("/:userId", [accessAllUser, accessByUserItself], controller.get);

// POST users fav radio tracks
router.post(
  "/:userId",
  [accessAllUser, accessByUserItself, recordHistory],
  controller.create
);

// DELETE users fav radio tracks by ID
router.delete(
  "/:userId",
  [accessAllUser, accessByUserItself, recordHistory],
  controller.delete
);

module.exports = router;
