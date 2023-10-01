var express = require("express");
var router = express.Router();
const controller = require("../controllers/presenter-info-controller");

/* GET all presenter info */
router.get("/", controller.getAllPresenterInfo);

/* GET presenter info by ID */
router.get("/:id", controller.getPresenterInfoByID);

/* POST presenter info */
router.post("/", controller.createNewPresenter);

/* UPDATE presenter info by ID */
router.put("/:id", controller.updatePresenterById);

/* DELETE presenter info by ID */
router.delete("/:id", controller.deletePresenterInfoByID);

module.exports = router;
