const Validator = require("fastest-validator");
const model = require("../models");
const PresenterInfo = model.PresenterInfo;
const v = new Validator();

// Add new presenter info
exports.createNewPresenter = async (req, res) => {
  try {
    const schema = {
      name: "string|min:3|max:255",
      name_kanji: "string|min:3|max:255",
      nickname: "string|min:3|max:255",
      birthdate: "string",
      birthplace: "string|optional",
      bloodtype: {
        type: "string",
        items: "string",
        enum: ["A", "B", "AB", "O"],
      },
      description: "string|optional",
      trivia: "string|optional",
      source: "string|optional",
      image: "string|optional",
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    const presenterinfo = await PresenterInfo.create(req.body);
    return res.status(200).json(presenterinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Update presenter info by id
exports.updatePresenterById = async (req, res) => {
  try {
    const schema = {
      name: "string|min:3|max:255|optional",
      name_kanji: "string|min:3|max:255|optional",
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
      trivia: "string|optional",
      source: "string|optional",
      image: "string|optional",
    };
    const id = req.params.id;
    let presenterinfo = await PresenterInfo.findByPk(id);
    const validate = v.validate(req.body, schema);
    if (!presenterinfo) {
      return res.status(400).json({
        message: "Error, presenter not found",
      });
    }
    if (validate.length) {
      return res.status(400).json(validate);
    }
    presenterinfo = await presenterinfo.update(req.body);
    return res.status(200).json(presenterinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get all presenter info
exports.getAllPresenterInfo = async (req, res) => {
  try {
    const presenterinfo = await PresenterInfo.findAll();
    if (presenterinfo.length === 0) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Presenter info not found",
      });
    }
    return res.status(200).json(presenterinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get presenter info by id
exports.getPresenterInfoByID = async (req, res) => {
  try {
    const id = req.params.id;
    const presenterinfo = await PresenterInfo.findByPk(id);
    if (!presenterinfo) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Presenter info not found",
      });
    }
    return res.status(200).json(presenterinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Delete presenter info by id
exports.deletePresenterInfoByID = async (req, res) => {
  try {
    const id = req.params.id;
    const presenterinfo = await PresenterInfo.findByPk(id);
    if (!presenterinfo) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Presenter not found",
      });
    }
    await presenterinfo.destroy();
    return res.status(200).json({
      message: "Deleted successfully!",
    });
  } catch (error) {
    return res.json({ error });
  }
};
