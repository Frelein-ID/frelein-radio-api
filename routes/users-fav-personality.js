var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-personality-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItself,
} = require("../middleware/auth-middleware");

router.get("/", [accessOnlyAdmin], controller.getAll);

// GET all users fav personality by user id
router.get("/:userId", [accessAllUser, accessByUserItself], controller.get);

// POST users fav personality
router.post("/:userId", [accessAllUser, accessByUserItself], controller.create);

// DELETE users fav personality by ID
router.delete(
  "/:userId/:id",
  [accessAllUser, accessByUserItself],
  controller.delete
);

module.exports = router;
