const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const v = new Validator();

// Add radio tracks
exports.createRadioTracks = async (req, res) => {
  try {
    const schema = {
      radio_info: "integer",
      radio_oa: "string|optional",
      description: "string|optional",
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    const radiotracks = await RadioTracks.create(req.body);
    return res.json(radiotracks);
  } catch (error) {
    return res.json({ error });
  }
};

// Update radio tracks
exports.updateRadioTracks = async (req, res) => {
  try {
    const schema = {
      name: "string|optional",
      image: "string|optional",
      description: "string|optional",
    };
    const id = req.params.id;
    let radiotracks = await RadioTracks.findByPk(id);
    if (!radiotracks) {
      return res.status(404).json({ message: "Error, radio tracks not found" });
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    radiotracks = await radiotracks.update(req.body);
    return res.status(200).json(radiotracks);
  } catch (error) {
    return res.json({ error });
  }
};

// Get all radio tracks
exports.getAllRadioTracks = async (req, res) => {
  try {
    const radiotracks = await RadioTracks.findAll();
    if (radiotracks.length === 0) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio tracks not found",
      });
    }
    return res.status(200).json(radiotracks);
  } catch (error) {
    return res.json({ error });
  }
};

// Get radio tracks by ID
exports.getRadioTrackByID = async (req, res) => {
  try {
    const id = req.params.id;
    const radiotracks = await RadioTracks.findByPk(id);
    if (!radiotracks) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio tracks not found",
      });
    }
    return res.status(200).json(radiotracks);
  } catch (error) {
    return res.json({ error });
  }
};

// Delete radio tracks by ID
exports.deleteRadioTrackByID = async (req, res) => {
  try {
    const id = req.params.id;
    const radiotracks = await RadioTracks.findByPk(id);
    if (!radiotracks) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio tracks not found",
      });
    }
    await radiotracks.destroy();
    return res.status(200).json({
      message: "Deleted successfully!",
    });
  } catch (error) {
    return res.json({ error });
  }
};
