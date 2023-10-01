const Validator = require("fastest-validator");
const model = require("../models");
const RadioInfo = model.RadioInfo;
const v = new Validator();

// Add radio info
exports.createRadioInfo = async (req, res) => {
  try {
    // Define validation schema
    const schema = {
      name: "string|min:3|max:255",
      name_jp: "string|min:3|max:255",
      image: "string|optional",
      description: "string|optional|min:3",
    };

    // Validate request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }

    // Create radio info
    const radioinfo = await RadioInfo.create(req.body);

    // Return created radio info
    return res.status(200).json(radioinfo);
  } catch (error) {
    // Return error response
    return res.json({ error });
  }
};

// Update radio info
exports.updateRadioInfo = async (req, res) => {
  try {
    const schema = {
      name: "string|optional|min:3|max:255",
      name_jp: "string|optional|min:3|max:255",
      image: "string|optional",
      description: "string|optional",
    };
    const id = req.params.id;
    let radioinfo = await RadioInfo.findByPk(id);
    const validate = v.validate(req.body, schema);
    if (!radioinfo) {
      return res.json({ message: "Error, radio info not found" });
    }
    if (validate.length) {
      return res.status(400).json(validate);
    }
    radioinfo = await radioinfo.update(req.body);
    return res.status(200).json(radioinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get all radio info
exports.getAllRadioInfo = async (req, res) => {
  try {
    const radioinfo = await RadioInfo.findAll();
    if (radioinfo.length === 0) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio info not found",
      });
    }
    return res.status(200).json(radioinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get radio info by ID
exports.getRadioInfoByID = async (req, res) => {
  try {
    const id = req.params.id;
    const radioinfo = await RadioInfo.findByPk(id);
    if (!radioinfo) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio info not found",
      });
    }
    return res.status(200).json(radioinfo);
  } catch (error) {
    res.json({ error });
  }
};

// Delete radio info by ID
exports.deleteRadioInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const radioinfo = await RadioInfo.findByPk(id);
    if (!radioinfo) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio info not found",
      });
    }
    await radioinfo.destroy();
    return res.status(200).json({
      message: "Deleted successfully!",
    });
  } catch (error) {
    res.json({ error });
  }
};
