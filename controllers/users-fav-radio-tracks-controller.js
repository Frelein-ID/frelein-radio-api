const Validator = require("fastest-validator");
const model = require("../models");
const UsersFavRadioTracks = model.UsersFavRadioTracks;
const v = new Validator();

exports.createUsersFavRadioTracks = async (req, res) => {
  try {
    const schema = {
      users_id: "string",
      tracks_id: "string",
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    const usersFavRadioTracks = await UsersFavRadioTracks.create(req.body);
    return res.json(usersFavRadioTracks);
  } catch (error) {
    return res.json(error);
  }
};

exports.getAllUsersFavRadioTracks = async (req, res) => {
  const usersFavRadioTracks = await UsersFavRadioTracks.findAll();
  return res.status(200).json(usersFavRadioTracks);
};

exports.getUsersFavRadioTracksByID = async (req, res) => {
  const id = req.params.id;
  const usersFavRadioTracks = await UsersFavRadioTracks.findOne({
    where: { tracks_id: id },
  });
  return res.status(200).json(usersFavRadioTracks);
};

exports.deleteUsersFavRadioTracks = async (req, res) => {
  const id = req.params.id;
  const usersFavRadioTracks = await UsersFavRadioTracks.findByPk(id);
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
