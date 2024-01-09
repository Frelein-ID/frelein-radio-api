const Validator = require("fastest-validator");
const model = require("../models");
const UsersFavRadioInfo = model.UsersFavRadioInfo;
const RadioInfo = model.RadioInfo;
const v = new Validator();

// Add new user favorite radio info
exports.createUsersFavRadioInfo = async (req, res) => {
  try {
    const schema = {
      users_id: "string",
      radio_info_id: "string",
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    // check if data is already added or not
    const users_id = req.body.users_id;
    const radio_info_id = req.body.radio_info_id;
    if (users_id) {
      const userData = await UsersFavRadioInfo.findOne({
        where: { users_id: users_id },
      });
      if (userData && userData.radio_info_id === radio_info_id) {
        return res.status(400).json({
          message: "Radio info is already in your favorites",
        });
      }
    }
    const fav = await UsersFavRadioInfo.create(req.body);
    return res.json({
      message: "Radio info successfully added into favorites",
      id: fav.id,
      createdAt: fav.createdAt,
    });
  } catch (error) {
    return res.json({ error });
  }
};

// Get all user favorite radio info
// To analyze data
exports.getAllUsersFavRadioInfo = async (req, res) => {
  const fav = await UsersFavRadioInfo.findAll();
  return res.status(200).json(fav);
};

// Get users fav radio tracks by user id
exports.getUsersFavRadioInfoByUserID = async (req, res) => {
  let result = [];
  const id = req.params.id;
  const favList = await UsersFavRadioInfo.findAll({
    where: { users_id: id },
  });
  for (var fav of favList) {
    const fav_data = await RadioInfo.findByPk(fav.radio_info_id);
    const data = {
      id: fav_data.id,
      name: fav_data?.name,
      name_jp: fav_data?.name_jp,
      image: fav_data?.image,
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

// Delete users favorite radio info
exports.deleteUsersFavRadioInfo = async (req, res) => {
  const id = req.params.id;
  const fav = await UsersFavRadioInfo.findByPk(id);
  if (!fav) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "User favorite radio info not found",
    });
  }
  await fav.destroy();
  return res.status(200).json({
    message: "Radio info deleted from your favorites successfully!",
  });
};
