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
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    // check if data is already added or not
    const users_id = req.params.userId;
    const radio_info_id = req.body.radio_info_id;
    if (users_id) {
      const userData = await UsersFavRadioInfo.findOne({
        where: { users_id: users_id },
      });
      if (userData && userData.radio_info_id === radio_info_id) {
        return res.status(400).json({
          error: RESPONSE_400,
          message: USER_FAVORITE_RADIO_INFO_EXIST,
        });
      }
    }
    const fav = await UsersFavRadioInfo.create({
      users_id: users_id,
      radio_info_id: radio_info_id,
    });
    increaseRadioInfoFavCount(radio_info_id);
    return res.json({
      message: USER_FAVORITE_RADIO_INFO_SUCCESS_ADD,
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
 * @memberof module:users-fav-radio-info
 * @summary A function to get all data about users favorite radio info.
 * @name getAll
 * @returns {JSON} An object that contains list about users favorite radio info.
 * */
exports.getAll = async (req, res) => {
  try {
    const fav = await UsersFavRadioInfo.findAll();
    if (!fav) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_FAVORITE_RADIO_INFO_NOT_FOUND,
      });
    }
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
        createdAt: fav.createdAt,
        updatedAt: fav.updatedAt,
      };
      result.push(data);
    }
    if (result.length == 0) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_FAVORITE_RADIO_INFO_NOT_FOUND,
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
 * @memberof module:users-fav-radio-info
 * @summary A function to get delete users favorite radio info.
 * @param {String} id - UUIDv4 which represents users favorite radio info's ID.
 * @name delete
 * @returns {JSON} An object that contains message about users favorite radio info deletion.
 * */
exports.delete = async (req, res) => {
  try {
    const radio_info_id = req.body.radio_info_id;
    const fav = await UsersFavRadioInfo.findOne({
      where: { radio_info_id: radio_info_id },
    });
    if (fav == null) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_FAVORITE_RADIO_INFO_FAILURE_DELETE_NOT_FOUND,
      });
    }
    await fav.destroy();
    decreaseRadioInfoFavCount(radio_info_id);
    return res.status(200).json({
      message: USER_FAVORITE_RADIO_INFO_SUCCESS_DELETE,
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
