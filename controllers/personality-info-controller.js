const Validator = require("fastest-validator");
const model = require("../models");
const PersonalityInfo = model.PersonalityInfo;
const v = new Validator();

// Add new personality info
exports.createNewPersonality = async (req, res) => {
  try {
    const schema = {
      name: "string|min:3|max:255",
      name_jp: "string|min:3|max:255",
      nickname: "string|min:3|max:255",
      birthdate: "string",
      birthplace: "string|optional",
      bloodtype: {
        type: "string",
        items: "string",
        enum: ["A", "B", "AB", "O"],
      },
      description: "string|optional",
      source: "string|optional",
      image: "string|optional",
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    const personalityinfo = await PersonalityInfo.create(req.body);
    return res.status(200).json(personalityinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Update personality info by id
exports.updatePersonalityById = async (req, res) => {
  try {
    const schema = {
      name: "string|min:3|max:255|optional",
      name_jp: "string|min:3|max:255|optional",
      nickname: "string|min:3|max:255|optional",
      birthdate: "string|optional",
      birthplace: "string|optional",
      bloodtype: {
        type: "string",
        items: "string",
        enum: ["A", "B", "AB", "O"],
        optional: true,
      },
      description: "string|optional",
      source: "string|optional",
      image: "string|optional",
    };
    const id = req.params.id;
    let personalityinfo = await PersonalityInfo.findByPk(id);
    const validate = v.validate(req.body, schema);
    if (!personalityinfo) {
      return res.status(400).json({
        message: "Error, personality not found",
      });
    }
    if (validate.length) {
      return res.status(400).json(validate);
    }
    personalityinfo = await personalityinfo.update(req.body);
    return res.status(200).json(personalityinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get all personality info
exports.getAllPersonalityInfo = async (req, res) => {
  try {
    const personalityinfo = await PersonalityInfo.findAll();
    if (personalityinfo.length === 0) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Personality info not found",
      });
    }
    return res.status(200).json(personalityinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get personality info by id
exports.getPersonalityInfoByID = async (req, res) => {
  try {
    const id = req.params.id;
    const personalityinfo = await PersonalityInfo.findByPk(id);
    if (!personalityinfo) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Personality info not found",
      });
    }
    return res.status(200).json(personalityinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Delete personality info by id
exports.deletePersonalityInfoByID = async (req, res) => {
  try {
    const id = req.params.id;
    const personalityinfo = await PersonalityInfo.findByPk(id);
    if (!personalityinfo) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Personality not found",
      });
    }
    await personalityinfo.destroy();
    return res.status(200).json({
      message: "Deleted successfully!",
    });
  } catch (error) {
    return res.json({ error });
  }
};
