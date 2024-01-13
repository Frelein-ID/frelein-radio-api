var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-personality-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

router.get("/", [accessOnlyAdmin], controller.getAll);

// GET all users fav personality by user id
router.get("/:id", [accessAllUser], controller.get);

// POST users fav personality
router.post("/", [accessAllUser], controller.create);

// DELETE users fav personality by ID
router.delete("/:id", [accessAllUser], controller.delete);

module.exports = router;
