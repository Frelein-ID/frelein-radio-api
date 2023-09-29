var express = require("express");
var router = express.Router();

const Validator = require("fastest-validator");
const { RadioInfo } = require("../models");

const v = new Validator();

/* GET radio info */
router.get("/", async (req, res, next) => {
  const radioinfo = await RadioInfo.findAll();
  if (radioinfo.length === 0) {
    return res.status(404).json({
      error: "404",
      message: "Radio info not found",
    });
  }
  return res.json(radioinfo);
});

/* GET radio info by ID*/
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const radioinfo = await RadioInfo.findByPk(id);
  if (!radioinfo) {
    return res.status(404).json({
      error: "404 not found",
      message: "Radio info not found",
    });
  }
  return res.status(200).json(radioinfo);
});

/* POST radio info. */
router.post("/", async (req, res, next) => {
  const schema = {
    name: "string",
    image: "string|optional",
    description: "string|optional",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  } else {
    const radioinfo = await RadioInfo.create(req.body);
    res.json(radioinfo);
  }
});

/* UPDATE radio info */
router.put("/:id", async (req, res, next) => {
  const schema = {
    name: "string|optional",
    image: "string|optional",
    description: "string|optional",
  };
  const id = req.params.id;
  let radioinfo = await RadioInfo.findByPk(id);

  if (!radioinfo) {
    return res.json({ message: "Error, radio info not found" });
  }

  radioinfo = await radioinfo.update(req.body);

  res.json(radioinfo);
});

/* DELETE radio info */
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const radioinfo = await RadioInfo.findByPk(id);
  if (!radioinfo) {
    return res.status(404).json({
      error: "404 not found",
      message: "Radio info not found",
    });
  }
  await radioinfo.destroy();

  res.status(200).json({
    message: "Deleted successfully!",
  });
});

module.exports = router;
