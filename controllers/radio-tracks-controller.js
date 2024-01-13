/**
 * @module
 * @name radio-tracks
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const RadioInfo = model.RadioInfo;
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const v = new Validator();
const {
  RESPONSE_500,
  RESPONSE_400,
  RESPONSE_404,
  RADIO_TRACKS_NOT_FOUND,
  RADIO_TRACKS_DELETE_SUCCESS,
  RADIO_TRACKS_CREATE_FAILURE_ALREADY_EXIST,
} = require("../constants/constants");

// Define validation schema
const schema = {
  episode: "number|integer|optional",
  radio_info: "string",
  radio_oa: "string|optional",
  image: "string|optional",
  src: "string",
};

/**
 * @function
 * @memberof module:radio-tracks
 * @summary A function to add new radio tracks.
 * @name create
 * @param {Integer=} episode - Radio tracks episode.
 * @param {String} radio_info - Radio information details, refers to {@link RadioInfo RadioInfo}.
 * @param {String=} radio_oa - Radio on air date.
 * @param {String=} image - Radio tracks image link url.
 * @param {String=} src - Radio tracks source.
 * @returns {JSON} An object that contains both an error message and a successful about radio tracks.
 * */
exports.create = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      // Return error if validation fails
      return res.status(400).json({
        error: RESPONSE_400,
        message: validate,
      });
    }
    // Check if there's already a record with same name
    const checkData = await RadioTracks.findOne({
      where: { name: req.body.name },
    });
    // If there's already a record with same name
    if (checkData != null) {
      return res.status(400).json({
        error: RESPONSE_400,
        message: RADIO_TRACKS_CREATE_FAILURE_ALREADY_EXIST,
      });
    }
    // Create radiotracks
    const radiotracks = await RadioTracks.create(req.body);
    // Return success response
    return res.json(radiotracks);
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
 * @memberof module:radio-tracks
 * @summary A function to update radio tracks.
 * @name update
 * @param {Integer=} episode - Radio tracks episode.
 * @param {String=} radio_info - Radio information details, refers to {@link RadioInfo RadioInfo}.
 * @param {String=} radio_oa - Radio on air date.
 * @param {String=} image - Radio tracks image link url.
 * @param {String=} src - Radio tracks source.
 * @returns {JSON} An object that contains both an error message and a successful about radio tracks.
 * */
exports.update = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, schema);
    // If validation fails
    if (validate.length) {
      // Return error
      return res.status(400).json(validate);
    }
    // Get id from params
    const id = req.params.id;
    // Find radio tracks by id
    let radiotracks = await RadioTracks.findByPk(id);
    // If not found
    if (!radiotracks) {
      // Return error
      return res.status(404).json({
        error: RESPONSE_404,
        message: RADIO_TRACKS_NOT_FOUND,
      });
    }
    // Update radio tracks
    radiotracks = await radiotracks.update(req.body);
    // Return success
    return res.status(200).json(radiotracks);
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
 * @memberof module:radio-tracks
 * @summary A function to get all radio tracks.
 * @name getAll
 * @returns {JSON} An object that contains a list of radio tracks.
 * */
exports.getAll = async (req, res) => {
  try {
    const result = [];
    const radiotracks = await RadioTracks.findAll();
    for (var radio of radiotracks) {
      const radioinfo = await RadioInfo.findOne({
        where: { id: radio.radio_info },
      });
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
      const radioData = {
        id: radio?.id,
        name: radioinfo?.name,
        name_jp: radioinfo?.name_jp,
        episode: radio?.episode,
        radio_oa: radio?.radio_oa,
        personalities: personalities_final,
        radio_image: radioinfo?.image,
        track_image: radio?.image,
        src: radio?.src,
        createdAt: radio?.createdAt,
        updatedAt: radio?.updatedAt,
      };
      result.push(radioData);
    }
    if (radiotracks.length === 0) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: RADIO_TRACKS_NOT_FOUND,
      });
    }
    return res.status(200).json(result);
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
 * @memberof module:radio-tracks
 * @summary A function to get a specific radio tracks.
 * @name get
 * @param {String} id - UUIDv4 which represents radio tracks ID.
 * @returns {JSON} An object that contains a specific of radio tracks.
 * */
exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    const radiotracks = await RadioTracks.findByPk(id);
    const radioinfo = await RadioInfo.findByPk(radiotracks.radio_info);
    let personalities = [];
    const personalities_list = await Personalities.findAll({
      where: { tracks_id: id },
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
    const result = {
      id: radiotracks?.id,
      name: radioinfo?.name,
      name_jp: radioinfo?.name_jp,
      episode: radiotracks?.episode,
      radio_oa: radiotracks?.radio_oa,
      personalities: personalities_final,
      radio_image: radioinfo?.image,
      track_image: radiotracks?.image,
      src: radiotracks?.src,
      createdAt: radiotracks?.createdAt,
      updatedAt: radiotracks?.updatedAt,
    };
    return res.status(200).json(result);
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
 * @memberof module:radio-tracks
 * @summary A function to delete a specific radio tracks by it's ID.
 * @name delete
 * @param {String} id - UUIDv4 which represents radio tracks ID.
 * @returns {JSON} An object that contains a message about radio tracks deletion.
 * */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const radiotracks = await RadioTracks.findByPk(id);
    if (!radiotracks) {
      return res.status(404).json({
        error: RESPONSE_404,
        message: RADIO_TRACKS_NOT_FOUND,
      });
    }
    await radiotracks.destroy();
    return res.status(200).json({
      message: RADIO_TRACKS_DELETE_SUCCESS,
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
