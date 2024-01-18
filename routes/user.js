const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItself,
} = require("../middleware/auth-middleware");

router.get("/", [accessOnlyAdmin], controller.getAll);

router.get("/:userId", [accessAllUser], controller.get);

router.get(
  "/:userId/my",
  [accessAllUser, accessByUserItself],
  controller.getMyData
);

router.put(
  "/:userId/change-password",
  [accessAllUser, accessByUserItself],
  controller.updatePassword
);

router.put(
  "/:userId",
  [accessAllUser, accessByUserItself],
  controller.updateUser
);

router.delete("/:id", [accessOnlyAdmin], controller.delete);

module.exports = router;
