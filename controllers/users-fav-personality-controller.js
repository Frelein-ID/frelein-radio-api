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
  RESPONSE_200,
  TOKEN_NULL,
  UNMATCH_ID,
  RESPONSE_201,
  USER_FAVORITE_ADD_PERSONALITY_NOT_EXIST,
} = require("../constants/constants");
const PersonalityInfo = model.PersonalityInfo;
const UsersFavPersonality = model.UsersFavPersonality;
const v = new Validator();
const {
  decreasePersonalityInfoFavCount,
  increasePersonalityInfoFavCount,
} = require("../utils/fav-personality-utils");
const { verifyToken } = require("../utils/token-utils");

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
    // validate request body
    const validate = v.validate(req.body, schema);
    // if validation error return error message
    if (validate.length) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // data check
    const users_id = req.params.userId;
    const personality_id = req.body.personality_id;
    // check if personality added is exist or not
    if (personality_id) {
      const personalityData = await PersonalityInfo.findByPk(personality_id);
      if (!personalityData) {
        return res.status(404).json({
          status: 404,
          statusText: RESPONSE_404,
          message: USER_FAVORITE_ADD_PERSONALITY_NOT_EXIST,
        });
      }
    }
    // check if data is already added or not
    if (users_id) {
      const userData = await UsersFavPersonality.findOne({
        where: { users_id: users_id, personality_id: personality_id },
      });
      if (userData) {
        return res.status(400).json({
          status: 400,
          statusText: RESPONSE_400,
          message: USER_FAVORITE_PERSONALITY_EXIST,
        });
      }
    }
    // add new data to db
    const fav = await UsersFavPersonality.create({
      users_id: users_id,
      personality_id: personality_id,
    });
    // update personality info favorite count
    increasePersonalityInfoFavCount(personality_id);
    // return success message
    return res.status(201).json({
      status: 201,
      statusText: RESPONSE_201,
      message: USER_FAVORITE_PERSONALITY_SUCCESS_ADD,
      data: fav,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
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
    if (fav.length == 0) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_PERSONALITY_NOT_FOUND,
      });
    }
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: fav,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
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
        favoritedAt: fav.favoritedAt,
      };
      result.push(data);
    }
    if (result.length == 0) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_PERSONALITY_NOT_FOUND,
      });
    }
    const result_final = [...new Set(result.map(JSON.stringify))].map(
      JSON.parse
    );
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: result_final,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
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
    // get token from header
    const token = req.header("Authorization");
    // get personality id from request body
    const personality_id = req.body.personality_id;
    // get user id from request body
    const users_id = req.params.userId;
    // check if token is provided or not
    if (!token) {
      return res.status(401).json({ message: TOKEN_NULL });
    }
    // decode the token
    const decoded = verifyToken(token);
    // check if decoded user same as requesting user
    if (decoded.user.id !== users_id) {
      return res.status(403).json({ message: UNMATCH_ID });
    }
    // check if this personality has been favorited by the user or not
    const fav = await UsersFavPersonality.findOne({
      where: { personality_id: personality_id },
    });
    // If empty then return failure
    if (!fav) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_PERSONALITY_NOT_FOUND,
      });
    }
    // Delete data from db
    await fav.destroy();
    // Update personality info favorite count
    decreasePersonalityInfoFavCount(personality_id);
    // Return success message
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: USER_FAVORITE_PERSONALITY_SUCCESS_DELETE,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};
