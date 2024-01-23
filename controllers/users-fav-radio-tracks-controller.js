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
  RESPONSE_200,
  TOKEN_NULL,
  UNMATCH_ID,
  RESPONSE_201,
  USER_FAVORITE_ADD_RADIO_TRACKS_NOT_EXIST,
} = require("../constants/constants");
const {
  decreaseRadioTracksFavCount,
  increaseRadioTracksFavCount,
} = require("../utils/fav-radio-tracks-utils");

// Define validation schema
const schema = {
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
    const tracks_id = req.body.tracks_id;
    // check if radio tracks added is exist or not
    if (tracks_id) {
      const tracksData = await RadioTracks.findByPk(tracks_id);
      if (!tracksData) {
        return res.status(404).json({
          status: 404,
          statusText: RESPONSE_404,
          message: USER_FAVORITE_ADD_RADIO_TRACKS_NOT_EXIST,
        });
      }
    }
    // check if data is already added or not
    if (users_id) {
      const userData = await UsersFavRadioTracks.findOne({
        where: { users_id: users_id, tracks_id: tracks_id },
      });
      if (userData) {
        return res.status(400).json({
          status: 400,
          statusText: RESPONSE_400,
          message: USER_FAVORITE_RADIO_TRACKS_EXIST,
        });
      }
    }
    // add new data to db
    const fav = await UsersFavRadioTracks.create({
      users_id: users_id,
      tracks_id: tracks_id,
    });
    // update radio tracks favorite count
    increaseRadioTracksFavCount(tracks_id);
    // return success message
    return res.status(201).json({
      status: 201,
      statusText: RESPONSE_201,
      message: USER_FAVORITE_RADIO_TRACKS_SUCCESS_ADD,
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
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_RADIO_TRACKS_NOT_FOUND,
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
 * @memberof module:users-fav-radio-tracks
 * @summary A function to get a specific data about users favorite radio tracks.
 * @param {String} id - UUIDv4 which represents user's ID.
 * @name get
 * @returns {JSON} An object that contains a specific data about users favorite radio tracks.
 * */
exports.get = async (req, res) => {
  try {
    let result = [];
    const id = req.params.userId;
    const favList = await UsersFavRadioTracks.findAll({
      where: { users_id: id },
    });
    for (var fav of favList) {
      const fav_data = await RadioTracks.findByPk(fav.tracks_id);
      const radio_info = await RadioInfo.findByPk(fav_data.radio_info);
      const data = {
        tracks_id: fav_data.id,
        name: radio_info?.name,
        name_jp: radio_info?.name_jp,
        image: fav_data?.image,
        radio_oa: fav_data?.radio_oa,
        episode: fav_data?.episode,
        favoritedAt: fav.favoritedAt,
      };
      result.push(data);
    }
    if (result.length == 0) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_RADIO_TRACKS_NOT_FOUND,
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
 * @memberof module:users-fav-radio-tracks
 * @summary A function to delete users favorite radio tracks.
 * @param {String} id - UUIDv4 which represents users favorite radio track's ID.
 * @name delete
 * @returns {JSON} An object that contains message about users favorite radio info tracks.
 * */
exports.delete = async (req, res) => {
  try {
    // get token from header
    const token = req.header("Authorization");
    // get radio tracks id from request body
    const tracks_id = req.body.tracks_id;
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
    const fav = await UsersFavRadioTracks.findOne({
      where: { tracks_id: tracks_id },
    });
    // If empty then return failure
    if (!fav) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_FAVORITE_RADIO_TRACKS_NOT_FOUND,
      });
    }
    // If exist then delete the data from db
    await fav.destroy();
    // Update radio tracks favorite count
    decreaseRadioTracksFavCount(tracks_id);
    // Return success message
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: USER_FAVORITE_RADIO_TRACKS_SUCCESS_DELETE,
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
