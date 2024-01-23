/**
 * @module
 * @name users-fav-radio-info
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const UsersFavRadioInfo = model.UsersFavRadioInfo;
const RadioInfo = model.RadioInfo;
const v = new Validator();
const {
  RESPONSE_400,
  RESPONSE_404,
  USER_FAVORITE_RADIO_INFO_EXIST,
  USER_FAVORITE_RADIO_INFO_SUCCESS_ADD,
  RESPONSE_500,
  USER_FAVORITE_RADIO_INFO_NOT_FOUND,
  USER_FAVORITE_RADIO_INFO_SUCCESS_DELETE,
  USER_FAVORITE_RADIO_INFO_FAILURE_DELETE_NOT_FOUND,
  RESPONSE_200,
  USER_FAVORITE_ADD_RADIO_INFO_NOT_EXIST,
  TOKEN_NULL,
  UNMATCH_ID,
  RESPONSE_201,
} = require("../constants/constants");
const {
  increaseRadioInfoFavCount,
  decreaseRadioInfoFavCount,
} = require("../utils/fav-radio-info-utils");

// Define validation schema
const schema = {
  radio_info_id: "string",
};

/**
 * @function
 * @memberof module:users-fav-radio-info
 * @summary A function to add new users favorite radio info.
 * @name create
 * @param {String} users_id - UUIDv4 which represents user's ID.
 * @param {String} radio_info_id - UUIDv4 which represents radio info's ID.
 * @returns {JSON} An object that contains both an error message and a successful about users favorite radio info.
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
    const radio_info_id = req.body.radio_info_id;
    // check if radio information added is exist or not
    if (radio_info_id) {
      const radioData = await RadioInfo.findByPk(radio_info_id);
      if (!radioData) {
        return res.status(404).json({
          status: 400,
          statusText: RESPONSE_404,
          message: USER_FAVORITE_ADD_RADIO_INFO_NOT_EXIST,
        });
      }
    }
    // check if data is already added or not
    if (users_id) {
      const userData = await UsersFavRadioInfo.findOne({
        where: { users_id: users_id, radio_info_id: radio_info_id },
      });
      if (userData) {
        return res.status(400).json({
          status: 400,
          statusText: RESPONSE_400,
          message: USER_FAVORITE_RADIO_INFO_EXIST,
        });
      }
    }
    // add new data to db
    const fav = await UsersFavRadioInfo.create({
      users_id: users_id,
      radio_info_id: radio_info_id,
    });
    // update personality info favorite count
    increaseRadioInfoFavCount(radio_info_id);
    // return success message
    return res.status(201).json({
      status: 201,
      statusText: RESPONSE_201,
      message: USER_FAVORITE_RADIO_INFO_SUCCESS_ADD,
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
 * @memberof module:users-fav-radio-info
 * @summary A function to get all data about users favorite radio info.
 * @name getAll
 * @returns {JSON} An object that contains list about users favorite radio info.
 * */
exports.getAll = async (req, res) => {
  try {
    const fav = await UsersFavRadioInfo.findAll();
    if (fav.length == 0) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_RADIO_INFO_NOT_FOUND,
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
 * @memberof module:users-fav-radio-info
 * @summary A function to get a specific data about users favorite radio info.
 * @param {String} id - UUIDv4 which represents user's ID.
 * @name getAll
 * @returns {JSON} An object that contains a specific data about users favorite radio info.
 * */
exports.get = async (req, res) => {
  try {
    let result = [];
    const id = req.params.userId;
    const favList = await UsersFavRadioInfo.findAll({
      where: { users_id: id },
    });
    for (var fav of favList) {
      const fav_data = await RadioInfo.findByPk(fav.radio_info_id);
      const data = {
        radio_info_id: fav_data.id,
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
        message: USER_FAVORITE_RADIO_INFO_NOT_FOUND,
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
 * @memberof module:users-fav-radio-info
 * @summary A function to get delete users favorite radio info.
 * @param {String} id - UUIDv4 which represents users favorite radio info's ID.
 * @name delete
 * @returns {JSON} An object that contains message about users favorite radio info deletion.
 * */
exports.delete = async (req, res) => {
  try {
    // get token from header
    const token = req.header("Authorization");
    // get radio info id from request body
    const radio_info_id = req.body.radio_info_id;
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
    // check if this radio has been favorited by the user or not
    const fav = await UsersFavRadioInfo.findOne({
      where: { radio_info_id: radio_info_id },
    });
    // If empty then return failure
    if (!fav) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_RADIO_INFO_FAILURE_DELETE_NOT_FOUND,
      });
    }
    // If exist then delete the data from db
    await fav.destroy();
    // Update radio info favorite count
    decreaseRadioInfoFavCount(radio_info_id);
    // Return success message
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: USER_FAVORITE_RADIO_INFO_SUCCESS_DELETE,
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
