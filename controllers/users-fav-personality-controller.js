const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const User = model.User;
const UsersFavRadioInfo = model.UsersFavRadioInfo;
const v = new Validator();

// Add personalities
exports.createUsersFavPersonality = async (req, res) => {
  const schema = {
    users_id: "string",
    tracks_id: "string",
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  const usersFavRadioTracks = await UsersFavRadioInfo.create(req.body);
  return res.json(usersFavRadioTracks);
};

// Update personalities
exports.updateUsersFavPersonality = async (req, res) => {
  const schema = {
    users_id: "string",
    tracks_id: "string",
  };
  const id = req.params.id;
  let usersFavRadioTracks = await UsersFavRadioInfo.findByPk(id);
  if (!usersFavRadioTracks) {
    return res
      .status(404)
      .json({ message: "Error, user favorite radio tracks not found" });
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  usersFavRadioTracks = await usersFavRadioTracks.update(req.body);
  return res.status(200).json(usersFavRadioTracks);
};

// Get all radio tracks
exports.getAllUsersFavPersonality = async (req, res) => {
  const usersFavRadioTracks = await UsersFavRadioInfo.findAll();
  return res.status(200).json(usersFavRadioTracks);
};

// Get users fav radio tracks by user id
// To check if current radio tracks is favorited by user or not
exports.getUsersFavPersonalityByID = async (req, res) => {
  const id = req.params.id;
  const usersFavRadioTracks = await UsersFavRadioInfo.findOne({
    where: { tracks_id: id },
  });
  return res.status(200).json(usersFavRadioTracks);
};

// Delete personalities
exports.deleteUsersFavPersonality = async (req, res) => {
  const id = req.params.id;
  const usersFavRadioTracks = await UsersFavRadioInfo.findByPk(id);
  if (!usersFavRadioTracks) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "User favorite radio tracks not found",
    });
  }
  await usersFavRadioTracks.destroy();
  return res.status(200).json({
    message: "User favorite radio tracks deleted successfully!",
  });
};
