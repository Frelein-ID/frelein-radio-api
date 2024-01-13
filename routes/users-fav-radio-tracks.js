var express = require("express");
var router = express.Router();
const controller = require("../controllers/users-fav-radio-tracks-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

// GET all users fav radio tracks
router.get("/", [accessOnlyAdmin], controller.getAll);

// GET all users fav radio tracks by user id
router.get("/:id", [accessAllUser], controller.get);

// POST users fav radio tracks
router.post("/", [accessAllUser], controller.create);

// DELETE users fav radio tracks by ID
router.delete("/:id", [accessAllUser], controller.delete);

module.exports = router;
