/**
 * @module
 * @name radio-info
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const {
  RESPONSE_201,
  RESPONSE_400,
  RESPONSE_500,
  RESPONSE_404,
  RADIO_INFO_NOT_FOUND,
  RADIO_INFO_DELETE_SUCCESS,
  RADIO_INFO_CREATE_FAILURE_ALREADY_EXIST,
  RESPONSE_200,
  RADIO_INFO_UPDATE_SUCCESS,
} = require("../constants/constants");
const RadioInfo = model.RadioInfo;
const RadioTracks = model.RadioTracks;
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const v = new Validator();

// Define validation schema
const schema = {
  name: "string|min:3|max:255",
  name_jp: "string|optional",
  image: "string|optional",
  description: "string|optional",
  website: "string|optional",
  social: "string|optional",
  schedule: "string|optional",
  start_time: "string|optional",
};

/**
 * @function
 * @memberof module:radio-info
 * @summary A function to add new radio information.
 * @name create
 * @param {String} name - Radio information name.
 * @param {String=} name_jp - Radio information name in Japanese.
 * @param {String=} image - Radio information image.
 * @param {String=} description - Radio information description.
 * @param {String=} website - Radio information website
 * @param {String=} social - Radio information social links.
 * @param {String=} schedule - Radio information schedule.
 * @param {String=} start_time - Radio information start time.
 * @returns {JSON} An object that contains both an error message and a successful about radio information.
 * */
exports.create = async (req, res) => {
  try {
    // def
    // Validate request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // Check if there's already a record with same name
    const checkData = await RadioInfo.findOne({
      where: { name: req.body.name },
    });
    // If there's already a record with same name
    if (checkData != null) {
      return res.status(400).json({
        error: RESPONSE_400,
        message: RADIO_INFO_CREATE_FAILURE_ALREADY_EXIST,
      });
    }
    // Create radio info
    const radioinfo = await RadioInfo.create(req.body);
    // Return created radio info
    return res.status(201).json({
      status: 201,
      statusText: RESPONSE_201,
      data: radioinfo,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:radio-info
 * @summary A function to add new radio information.
 * @name update
 * @param {String=} name - Radio information name.
 * @param {String=} name_jp - Radio information name in Japanese.
 * @param {String=} image - Radio information image.
 * @param {String=} description - Radio information description.
 * @param {String=} website - Radio information website
 * @param {String=} social - Radio information social links.
 * @param {String=} schedule - Radio information schedule.
 * @param {String=} start_time - Radio information start time.
 * @returns {JSON} An object that contains both an error message and a successful about radio information.
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
    // Check if data exist or not
    const id = req.params.id;
    let radioinfo = await RadioInfo.findByPk(id);
    // Return failure if data not exist
    if (!radioinfo) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: RADIO_INFO_NOT_FOUND,
      });
    }
    // Update the data
    radioinfo = await radioinfo.update(req.body);
    // Send response
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: RADIO_INFO_UPDATE_SUCCESS,
      data: radioinfo,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:radio-info
 * @summary A function to get all of radio information stored in database.
 * @name getAll
 * @returns {JSON} An object that contains radio information.
 * */
exports.getAll = async (req, res) => {
  try {
    const radioinfo = await RadioInfo.findAll();
    if (radioinfo.length === 0) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: RADIO_INFO_NOT_FOUND,
      });
    }
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: radioinfo,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:radio-info
 * @summary A function to get a specific radio information stored in database.
 * @name get
 * @param {String} - UUIDv4 which is represents a radio information ID.
 * @returns {JSON} An object that contains specific radio information.
 * */
exports.get = async (req, res) => {
  try {
    // Get ID from request params
    const id = req.params.id;
    // Find radio info by ID
    const radioinfo = await RadioInfo.findByPk(id);
    // Find radio tracks for the radio info
    let radiotracks = await RadioTracks.findAll({
      where: { radio_info: id },
    });
    // Initialize tracks array
    const tracks = [];
    // Iterate through radio tracks
    console.log({ radiotracks });
    for (var radio of radiotracks) {
      let personalities = [];
      const personalities_list = await Personalities.findAll({
        where: { tracks_id: radio.id },
      });
      for (var personality of personalities_list) {
        const person_data = await PersonalityInfo.findByPk(
          personality.personality_id
        );
        const personality_info = {
          name: person_data?.name,
          name_kanji: person_data?.name_kanji,
          nickname: person_data?.nickname,
          image: person_data?.image,
        };
        personalities.push(personality_info);
      }
      const personalities_final = [
        ...new Set(personalities.map(JSON.stringify)),
      ].map(JSON.parse);
      const tracks_data = {
        id: radio.id,
        episode: radio.episode,
        date: radio.radio_oa,
        personalities: personalities_final,
        image: radio?.image,
      };
      tracks.push(tracks_data);
    }
    const result = {
      id: radioinfo?.id,
      name: radioinfo?.name,
      name_jp: radioinfo?.name_jp,
      tracks: tracks,
      image: radioinfo?.image,
      description: radioinfo?.description,
      website: radioinfo?.website,
      social: radioinfo?.social,
      schedule: radioinfo?.schedule,
      start_time: radioinfo?.start_time,
      updatedAt: radioinfo?.updatedAt,
    };
    if (!radioinfo) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: RADIO_INFO_NOT_FOUND,
      });
    }
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: result,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: 200,
      statusText: RESPONSE_200,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:radio-info
 * @summary A function to delete a specific radio information stored in database.
 * @name delete
 * @param {String} - UUIDv4 which is represents a radio information ID.
 * @returns {JSON} An object that contains a message about radio information deletion.
 * */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const radioinfo = await RadioInfo.findByPk(id);
    if (!radioinfo) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: RADIO_INFO_NOT_FOUND,
      });
    }
    await radioinfo.destroy();
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: RADIO_INFO_DELETE_SUCCESS,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};
