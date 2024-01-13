/**
 * @module
 * @name users-fav-personality
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const {
  RESPONSE_400,
  USER_FAVORITE_PERSONALITY_EXIST,
  USER_FAVORITE_PERSONALITY_SUCCESS_ADD,
  RESPONSE_404,
  USER_FAVORITE_PERSONALITY_NOT_FOUND,
  USER_FAVORITE_PERSONALITY_SUCCESS_DELETE,
  RESPONSE_500,
} = require("../constants/constants");
const Personality = model.Personality;
const UsersFavPersonality = model.UsersFavPersonality;
const v = new Validator();

// Define validation schema
const schema = {
  users_id: "string",
  personality_id: "string",
};

/**
 * @function
 * @memberof module:users-fav-personality
 * @summary A function to add new users favorite personality.
 * @name create
 * @param {String} users_id - UUIDv4 which represents user's ID.
 * @param {String} personality_id - UUIDv4 which represents personality's ID.
 * @returns {JSON} An object that contains both an error message and a successful about users favorite personality.
 * */
exports.create = async (req, res) => {
  try {
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json({
        error: RESPONSE_400,
        message: validate,
      });
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
          message: USER_FAVORITE_PERSONALITY_EXIST,
        });
      }
    }
    const fav = await UsersFavPersonality.create(req.body);
    return res.json({
      message: USER_FAVORITE_PERSONALITY_SUCCESS_ADD,
      id: fav.id,
      createdAt: fav.createdAt,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      error: RESPONSE_500,
      message: error.message,
    });
  }
};

/**
 * @function
 * @memberof module:users-fav-personality
 * @summary A function to get all data about users favorite personality.
 * @name getAll
 * @returns {JSON} An object that contains list about users favorite personality.
 * */
exports.getAll = async (req, res) => {
  try {
    const fav = await UsersFavPersonality.findAll();
    return res.status(200).json(fav);
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      error: RESPONSE_500,
      message: error.message,
    });
  }
};

/**
 * @function
 * @memberof module:users-fav-personality
 * @summary A function to get a specific data about users favorite personality.
 * @param {String} id - UUIDv4 which represents user's ID.
 * @name getAll
 * @returns {JSON} An object that contains a specific data about users favorite personality.
 * */
exports.get = async (req, res) => {
  try {
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
        error: RESPONSE_404,
        message: USER_FAVORITE_PERSONALITY_NOT_FOUND,
      });
    }
    const result_final = [...new Set(result.map(JSON.stringify))].map(
      JSON.parse
    );
    return res.status(200).json(result_final);
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      error: RESPONSE_500,
      message: error.message,
    });
  }
};

/**
 * @function
 * @memberof module:users-fav-personality
 * @summary A function to get delete users favorite personality.
 * @param {String} id - UUIDv4 which represents user's ID.
 * @name delete
 * @returns {JSON} An object that contains message about users favorite personality deletion.
 * */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const fav = await UsersFavPersonality.findByPk(id);
    if (!fav) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_FAVORITE_PERSONALITY_NOT_FOUND,
      });
    }
    await fav.destroy();
    return res.status(200).json({
      message: USER_FAVORITE_PERSONALITY_SUCCESS_DELETE,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      error: RESPONSE_500,
      message: error.message,
    });
  }
};
