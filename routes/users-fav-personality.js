var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-personality-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItselfAndAdmin,
  verifyAccessToken,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

router.get("/", [verifyAccessToken, accessOnlyAdmin], controller.getAll);

// GET all users fav personality by user id
router.get(
  "/:userId",
  [verifyAccessToken, accessByUserItselfAndAdmin],
  controller.get
);

// POST users fav personality
router.post(
  "/:userId",
  [verifyAccessToken, accessByUserItselfAndAdmin, recordHistory],
  controller.create
);

// DELETE users fav personality by ID
router.delete(
  "/:userId",
  [verifyAccessToken, accessByUserItselfAndAdmin, recordHistory],
  controller.delete
);

module.exports = router;
