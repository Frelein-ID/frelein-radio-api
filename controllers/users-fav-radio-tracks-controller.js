/**
 * @module
 * @name users-fav-radio-tracks
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const UsersFavRadioTracks = model.UsersFavRadioTracks;
const RadioTracks = model.RadioTracks;
const RadioInfo = model.RadioInfo;
const v = new Validator();

const {
  RESPONSE_400,
  RESPONSE_404,
  RESPONSE_500,
  USER_FAVORITE_RADIO_TRACKS_EXIST,
  USER_FAVORITE_RADIO_TRACKS_SUCCESS_DELETE,
  USER_FAVORITE_RADIO_TRACKS_SUCCESS_ADD,
  USER_FAVORITE_RADIO_TRACKS_NOT_FOUND,
} = require("../constants/constants");

// Define validation schema
const schema = {
  users_id: "string",
  tracks_id: "string",
};

/**
 * @function
 * @memberof module:users-fav-radio-tracks
 * @summary A function to add new users favorite radio tracks.
 * @name create
 * @param {String} users_id - UUIDv4 which represents user's ID.
 * @param {String} tracks_id - UUIDv4 which represents radio track's ID.
 * @returns {JSON} An object that contains both an error message and a successful about users favorite radio tracks.
 * */
exports.create = async (req, res) => {
  try {
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
          error: RESPONSE_400,
          message: USER_FAVORITE_RADIO_TRACKS_EXIST,
        });
      }
    }
    const fav = await UsersFavRadioTracks.create(req.body);
    return res.json({
      message: USER_FAVORITE_RADIO_TRACKS_SUCCESS_ADD,
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
 * @memberof module:users-fav-radio-tracks
 * @summary A function to get all data about users favorite radio tracks.
 * @name getAll
 * @returns {JSON} An object that contains list about users favorite radio tracks.
 * */
exports.getAll = async (req, res) => {
  try {
    const fav = await UsersFavRadioTracks.findAll();
    if (fav.length == 0) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_FAVORITE_RADIO_TRACKS_NOT_FOUND,
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
 * @memberof module:users-fav-radio-tracks
 * @summary A function to get a specific data about users favorite radio tracks.
 * @param {String} id - UUIDv4 which represents user's ID.
 * @name get
 * @returns {JSON} An object that contains a specific data about users favorite radio tracks.
 * */
exports.get = async (req, res) => {
  try {
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
        error: RESPONSE_404,
        message: USER_FAVORITE_RADIO_TRACKS_NOT_FOUND,
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
 * @memberof module:users-fav-radio-tracks
 * @summary A function to get delete users favorite radio tracks.
 * @param {String} id - UUIDv4 which represents users favorite radio track's ID.
 * @name delete
 * @returns {JSON} An object that contains message about users favorite radio info tracks.
 * */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const fav = await UsersFavRadioTracks.findByPk(id);
    if (fav.length == 0) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_FAVORITE_RADIO_TRACKS_NOT_FOUND,
      });
    }
    await fav.destroy();
    return res.status(200).json({
      message: USER_FAVORITE_RADIO_TRACKS_SUCCESS_DELETE,
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
