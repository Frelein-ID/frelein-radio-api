/**
 * @module
 * @name personalities
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const v = new Validator();
const {
  RESPONSE_400,
  RESPONSE_404,
  PERSONALITIES_SUCCESS_CREATED,
  PERSONALITIES_SUCCESS_UPDATED,
  PERSONALITIES_FAILURE_NOT_FOUND,
  RESPONSE_500,
  PERSONALITIES_FAILURE_EXISTS,
  RESPONSE_200,
  PERSONALITIES_FAILURE_UPDATE,
  RESPONSE_201,
  PERSONALITIES_SUCCESS_DELETED,
} = require("../constants/constants");

// Define schema for personalities
const schema = {
  tracks_id: "string",
  personality_id: "string",
};

/**
 * @function
 * @memberof module:personalities
 * @name create
 * @summary A function to assign personality into radio tracks so users can see who's the personality of the current tracks.
 * @param {String} tracks_id - Radio track's ID.
 * @param {String} personality_id - Personalities ID.
 * @returns {JSON} A message contains success or failure personalities creation process including error message if exist.
 * */
exports.create = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // Check if tracks and personality already exists
    const checkData = await Personalities.findOne({
      where: {
        tracks_id: req.body.tracks_id,
        personality_id: req.body.personality_id,
      },
    });
    console.log({ checkData });
    // If data is not null then return bad request message
    if (checkData) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: PERSONALITIES_FAILURE_EXISTS,
      });
    }
    // Insert data to database
    const data = await Personalities.create(req.body);
    return res.status(201).json({
      status: 201,
      statusText: RESPONSE_201,
      message: PERSONALITIES_SUCCESS_CREATED,
      data: data,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:personalities
 * @name update
 * @summary A function to reassign personality into radio tracks so users can see who's the personality of the current tracks.
 * @param {String} tracks_id - Radio track's ID.
 * @param {String} personality_id - Personalities ID.
 * @returns {JSON} A message contains success or failure personalities creation process including error message if exist.
 * */
exports.update = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // get id from params
    const id = req.params.id;
    const personalities = await Personalities.findByPk(id);
    // Check if data exists or not
    if (!personalities) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITIES_FAILURE_NOT_FOUND,
      });
    }
    // Update the data
    data = await personalities.update(req.body);
    // Return success
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: PERSONALITIES_SUCCESS_UPDATED,
      data: data,
    });
  } catch (error) {
    // Error handling
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: PERSONALITIES_FAILURE_UPDATE,
    });
  }
};

/**
 * @function
 * @memberof module:personalities
 * @name getAll
 * @summary A function to get all personality into radio tracks so users can see who's the personality of the current tracks.
 * @returns {JSON} A list of personalities.
 * */
exports.getAll = async (req, res) => {
  try {
    // get all personalities data from db
    const personalities = await Personalities.findAll();
    // if data doesn't exists return 404
    if (personalities.length == 0) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITIES_FAILURE_NOT_FOUND,
      });
    }
    // if data exists return its data
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: personalities,
    });
  } catch (error) {
    // handle errors
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
 * @memberof module:personalities
 * @name get
 * @summary A function to get a specific personality into radio tracks so users can see who's the personality of the current tracks.
 * @param  {String} id Personalities ID.
 * @returns {JSON} A specific information about personalities.
 * */
exports.get = async (req, res) => {
  try {
    // get id from params
    const id = req.params.id;
    // get all personalities data from db
    const personalities = await Personalities.findByPk(id);
    // if data doesn't exists return 404
    if (!personalities) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITIES_FAILURE_NOT_FOUND,
      });
    }
    // if data exists return its data
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: personalities,
    });
  } catch (error) {
    // handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Personalities.findByPk(id);
    if (!response) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITIES_FAILURE_NOT_FOUND,
      });
    }
    await response.destroy();
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: PERSONALITIES_SUCCESS_DELETED,
    });
  } catch (error) {
    // handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};
