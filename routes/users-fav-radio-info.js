var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-radio-info-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItselfAndAdmin,
  verifyAccessToken,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

// GET all users fav radio tracks by user id
router.get("/", [verifyAccessToken, accessOnlyAdmin], controller.getAll);

// GET all users fav radio tracks by user id
router.get(
  "/:userId",
  [verifyAccessToken, accessByUserItselfAndAdmin],
  controller.get
);

// POST users fav radio tracks
router.post(
  "/:userId",
  [verifyAccessToken, accessByUserItselfAndAdmin, recordHistory],
  controller.create
);

// DELETE users fav radio tracks by ID
router.delete(
  "/:userId",
  [verifyAccessToken, accessByUserItselfAndAdmin, recordHistory],
  controller.delete
);

module.exports = router;
