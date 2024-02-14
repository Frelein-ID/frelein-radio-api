const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItselfAndAdmin,
  verifyAccessToken,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

router.get("/", [verifyAccessToken, accessOnlyAdmin], controller.getAll);

router.get("/:userId", [verifyAccessToken, accessAllUser], controller.get);

router.get(
  "/:userId/my",
  [verifyAccessToken, accessByUserItselfAndAdmin],
  controller.getMyData
);

router.put(
  "/:userId/change-password",
  [verifyAccessToken, accessByUserItselfAndAdmin, recordHistory],
  controller.updatePassword
);

router.put(
  "/:userId",
  [verifyAccessToken, accessByUserItselfAndAdmin, recordHistory],
  controller.updateUser
);

router.delete(
  "/:id",
  [verifyAccessToken, accessOnlyAdmin, recordHistory],
  controller.delete
);

module.exports = router;
