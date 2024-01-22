var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-radio-tracks-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItselfAndAdmin,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

// GET all users fav radio tracks
router.get("/", [accessOnlyAdmin], controller.getAll);

// GET all users fav radio tracks by user id
router.get("/:userId", [accessByUserItselfAndAdmin], controller.get);

// POST users fav radio tracks
router.post(
  "/:userId",
  [accessByUserItselfAndAdmin, recordHistory],
  controller.create
);

// DELETE users fav radio tracks by ID
router.delete(
  "/:userId",
  [accessByUserItselfAndAdmin, recordHistory],
  controller.delete
);

module.exports = router;
