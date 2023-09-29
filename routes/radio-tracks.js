var express = require("express");
var router = express.Router();

const Validator = require("fastest-validator");
const { RadioTracks } = require("../models");

const v = new Validator();

/* GET radio tracks */
router.get("/", async (req, res, next) => {
  const radiotracks = await RadioTracks.findAll();
  if (radiotracks.length === 0) {
    return res.status(404).json({
      error: "404",
      message: "Radio tracks not found",
    });
  }
  return res.status(200).json(radiotracks);
});

/* GET radio tracks by ID*/
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const radiotracks = await RadioTracks.findByPk(id);
  if (!radiotracks) {
    return res.status(404).json({
      error: "404 not found",
      message: "Radio tracks not found",
    });
  }
  return res.status(200).json(radiotracks);
});

/* POST radio tracks. */
router.post("/", async (req, res, next) => {
  const schema = {
    radio_info: "integer",
    radio_oa: "string|optional",
    description: "string|optional",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  } else {
    const radiotracks = await RadioTracks.create(req.body);
    res.json(radiotracks);
  }
});

/* UPDATE radio tracks */
router.put("/:id", async (req, res, next) => {
  const schema = {
    name: "string|optional",
    image: "string|optional",
    description: "string|optional",
  };
  const id = req.params.id;
  let radiotracks = await RadioTracks.findByPk(id);

  if (!radiotracks) {
    return res.json({ message: "Error, radio tracks not found" });
  }

  radiotracks = await radiotracks.update(req.body);

  res.json(radiotracks);
});

/* DELETE radio tracks */
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const radiotracks = await RadioTracks.findByPk(id);
  if (!radiotracks) {
    return res.status(404).json({
      error: "404 not found",
      message: "Radio tracks not found",
    });
  }
  await radiotracks.destroy();

  res.status(200).json({
    message: "Deleted successfully!",
  });
});

module.exports = router;
