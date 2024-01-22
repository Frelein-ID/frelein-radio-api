const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const {
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItselfAndAdmin,
} = require("../middleware/auth-middleware");
const { recordHistory } = require("../middleware/record-history-middleware");

router.get("/", [accessOnlyAdmin], controller.getAll);

router.get("/:userId", [accessAllUser], controller.get);

router.get("/:userId/my", [accessByUserItselfAndAdmin], controller.getMyData);

router.put(
  "/:userId/change-password",
  [accessByUserItselfAndAdmin, recordHistory],
  controller.updatePassword
);

router.put(
  "/:userId",
  [accessByUserItselfAndAdmin, recordHistory],
  controller.updateUser
);

router.delete("/:id", [accessOnlyAdmin, recordHistory], controller.delete);

module.exports = router;
