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
const PersonalityInfo = model.PersonalityInfo;
const UsersFavPersonality = model.UsersFavPersonality;
const v = new Validator();
const {
  decreasePersonalityInfoFavCount,
  increasePersonalityInfoFavCount,
} = require("../utils/fav-personality-utils");

// Define validation schema
const schema = {
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
    const users_id = req.params.userId;
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
    const fav = await UsersFavPersonality.create({
      users_id: users_id,
      personality_id: personality_id,
    });
    increasePersonalityInfoFavCount(personality_id);
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
    const id = req.params.userId;
    const favList = await UsersFavPersonality.findAll({
      where: { users_id: id },
    });
    for (var fav of favList) {
      const fav_data = await PersonalityInfo.findByPk(fav.personality_id);
      const data = {
        personality_id: fav_data.id,
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
    return res.status(200).json(favList);
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
 * @param {String} id - UUIDv4 which represents user's favorite personality ID.
 * @name delete
 * @returns {JSON} delete failed or successful message.
 * */
exports.delete = async (req, res) => {
  try {
    const personality_id = req.body.personality_id;
    const fav = await UsersFavPersonality.findOne({
      where: { personality_id: personality_id },
    });
    if (!fav) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_FAVORITE_PERSONALITY_NOT_FOUND,
      });
    }
    await fav.destroy();
    decreasePersonalityInfoFavCount(personality_id);
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
