const Validator = require("fastest-validator");
const model = require("../models");
const UsersFavRadioTracks = model.UsersFavRadioTracks;
const RadioTracks = model.RadioTracks;
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
    // check if data is already added or not
    const users_id = req.body.users_id;
    const tracks_id = req.body.tracks_id;
    if (users_id) {
      const userData = await UsersFavRadioTracks.findOne({
        where: { users_id: users_id },
      });
      if (userData && userData.tracks_id === tracks_id) {
        return res.status(400).json({
          message: "Radio tracks is already in your favorites",
        });
      }
    }
    const fav = await UsersFavRadioTracks.create(req.body);
    return res.json({
      message: "Radio tracks successfully added into favorites",
      id: fav.id,
      createdAt: fav.createdAt,
    });
  } catch (error) {
    return res.json({ error });
  }
};

exports.getAllUsersFavRadioTracks = async (req, res) => {
  const fav = await UsersFavRadioTracks.findAll();
  return res.status(200).json(fav);
};

exports.getUsersFavRadioTracksByUserID = async (req, res) => {
  let result = [];
  const id = req.params.id;
  const favList = await UsersFavRadioTracks.findAll({
    where: { users_id: id },
  });
  for (var fav of favList) {
    const fav_data = await RadioTracks.findByPk(fav.tracks_id);
    const radio_info = await RadioInfo.findByPk(fav_data.radio_info);
    const data = {
      id: fav_data.id,
      name: radio_info?.name,
      name_jp: radio_info?.name_jp,
      image: fav_data?.image,
      radio_oa: fav_data?.radio_oa,
      episode: fav_data?.episode,
      createdAt: fav.createdAt,
      updatedAt: fav.updatedAt,
    };
    result.push(data);
  }
  if (result.length == 0) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "Users fav radio tracks not found",
    });
  }
  const result_final = [...new Set(result.map(JSON.stringify))].map(JSON.parse);
  return res.status(200).json(result_final);
};

exports.deleteUsersFavRadioTracks = async (req, res) => {
  const id = req.params.id;
  const fav = await UsersFavRadioTracks.findByPk(id);
  if (!fav) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "You don't have any radio tracks favorites",
    });
  }
  await fav.destroy();
  return res.status(200).json({
    message: "Radio info deleted from your favorites successfully!",
  });
};
