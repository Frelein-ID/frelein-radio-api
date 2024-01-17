const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
} = require("../middleware/auth-middleware");

router.get("/", [accessOnlyAdmin], controller.getAll);

router.get("/:id", [accessAllUser], controller.get);

router.get("/:id/mine", [accessAllUser], controller.getMyData);

router.put("/:id/change-password", [accessAllUser], controller.updatePassword);

router.put("/:id", [accessOnlyAdmin], controller.updateUser);

router.delete("/:id", [accessOnlyAdmin], controller.delete);

module.exports = router;
