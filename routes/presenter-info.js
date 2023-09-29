var express = require("express");
var router = express.Router();

const Validator = require("fastest-validator");
const { PresenterInfo } = require("../models");

const v = new Validator();

/* GET presenter info */
router.get("/", async (req, res, next) => {
  const presenterinfo = await PresenterInfo.findAll();
  if (presenterinfo.length === 0) {
    return res.status(404).json({
      error: "404",
      message: "Radio info not found",
    });
  }
  return res.json(presenterinfo);
});

/* GET presenter info by ID*/
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const presenterinfo = await PresenterInfo.findByPk(id);
  if (!presenterinfo) {
    return res.status(404).json({
      error: "404 not found",
      message: "Presenter info not found",
    });
  }
  return res.status(200).json(presenterinfo);
});

/* POST presenter info. */
router.post("/", async (req, res, next) => {
  const schema = {
    name: "string|min:3|max:255",
    name_kanji: "string|min:3|max:255",
    nickname: "string|min:3|max:255",
    birthdate: "string",
    birthplace: "string|optional",
    bloodtype: { type: "string", items: "string", enum: ["A", "B", "AB", "O"] },
    description: "string|optional",
    trivia: "string|optional",
    source: "string|optional",
    image: "string|optional",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  } else {
    const presenterinfo = await PresenterInfo.create(req.body);
    res.json(presenterinfo);
  }
});

/* UPDATE presenter info */
router.put("/:id", async (req, res, next) => {
  const schema = {
    name: "string|min:3|max:255|optional",
    name_kanji: "string|min:3|max:255|optional",
    nickname: "string|min:3|max:255|optional",
    birthdate: "string|optional",
    birthplace: "string|optional",
    bloodtype: {
      type: "string|optional",
      items: "string",
      enum: ["A", "B", "AB", "O"],
    },
    description: "string|optional",
    trivia: "string|optional",
    source: "string|optional",
    image: "string|optional",
  };
  const id = req.params.id;
  let presenterinfo = await PresenterInfo.findByPk(id);

  if (!presenterinfo) {
    return res.json({ message: "Error, presenter not found" });
  }

  presenterinfo = await presenterinfo.update(req.body);

  res.json(presenterinfo);
});

/* DELETE presenter info */
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const presenterinfo = await PresenterInfo.findByPk(id);
  if (!presenterinfo) {
    return res.status(404).json({
      error: "404 not found",
      message: "Presenter not found",
    });
  }
  await presenterinfo.destroy();

  res.status(200).json({
    message: "Deleted successfully!",
  });
});

module.exports = router;
