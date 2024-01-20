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
    // If data is not null then return bad request message
    if (checkData != null) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: PERSONALITIES_FAILURE_EXISTS,
      });
    }
    // Insert data to database
    await RadioTracks.create(req.body);
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: PERSONALITIES_SUCCESS_CREATED,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      error: error,
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
    const id = req.params.id;
    let personalities = await Personalities.findByPk(id);
    // Check if data exists or not
    if (!personalities) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITIES_FAILURE_NOT_FOUND,
      });
    }
    // Update the data
    personalities = await Personalities.update(req.body);
    // Return success
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: PERSONALITIES_SUCCESS_UPDATED,
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
    const personalities = await Personalities.findAll();
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: personalities,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      error: error,
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
    let result = [];
    const id = req.params.id;
    // Check if
    const personalities_list = await Personalities.findAll({
      where: { tracks_id: id },
    });
    for (var personality of personalities_list) {
      const person_data = await PersonalityInfo.findByPk(
        personality.personality_id
      );
      const personality_info = {
        name: person_data?.name,
        name_jp: person_data?.name_kanji,
        nickname: person_data?.nickname,
        image: person_data?.image,
      };
      result.push(personality_info);
    }
    if (result.length == 0) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITIES_FAILURE_NOT_FOUND,
      });
    }
    const result_final = [...new Set(result.map(JSON.stringify))].map(
      JSON.parse
    );
    return res.status(200).json({
      status: 404,
      statusText: RESPONSE_404,
      data: result_final,
    });
  } catch (error) {}
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const radiotracks = await RadioTracks.findByPk(id);
  if (!radiotracks) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "Radio tracks not found",
    });
  }
  await radiotracks.destroy();
  return res.status(200).json({
    message: "Deleted successfully!",
  });
};
