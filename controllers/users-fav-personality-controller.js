const Validator = require("fastest-validator");
const model = require("../models");
const Personality = model.Personality;
const UsersFavPersonality = model.UsersFavPersonality;
const v = new Validator();

// Add personalities
exports.createUsersFavPersonality = async (req, res) => {
  try {
    const schema = {
      users_id: "string",
      personality_id: "string",
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    // check if data is already added or not
    const users_id = req.body.users_id;
    const personality_id = req.body.personality_id;
    if (users_id) {
      const userData = await UsersFavPersonality.findOne({
        where: { users_id: users_id },
      });
      if (userData && userData.personality_id === personality_id) {
        return res.status(400).json({
          message: "This personality is already in your favorites",
        });
      }
    }
    const fav = await UsersFavPersonality.create(req.body);
    return res.json({
      message: "This personality successfully added into favorites",
      id: fav.id,
      createdAt: fav.createdAt,
    });
  } catch (error) {
    return res.json({ error });
  }
};

// Get all user favorite personality
// To analyze data
exports.getAllUsersFavPersonality = async (req, res) => {
  const fav = await UsersFavPersonality.findAll();
  return res.status(200).json(fav);
};

// Get users fav personality by user id
exports.getUsersFavPersonalityByUserID = async (req, res) => {
  let result = [];
  const id = req.params.id;
  const favList = await UsersFavPersonality.findAll({
    where: { users_id: id },
  });
  for (var fav of favList) {
    const fav_data = await Personality.findByPk(fav.personality_id);
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
      message: "You didn't have any favorite personalities",
    });
  }
  const result_final = [...new Set(result.map(JSON.stringify))].map(JSON.parse);
  return res.status(200).json(result_final);
};

// Delete personalities
exports.deleteUsersFavPersonality = async (req, res) => {
  const id = req.params.id;
  const fav = await UsersFavPersonality.findByPk(id);
  if (!fav) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "You don't have any favorites personality",
    });
  }
  await fav.destroy();
  return res.status(200).json({
    message: "This personality deleted from your favorites successfully!",
  });
};
