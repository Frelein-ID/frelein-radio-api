/**
 * @module
 * @name personality-info
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const {
  RESPONSE_500,
  PERSONALITY_INFO_CREATE_SUCCESS,
  RESPONSE_400,
  PERSONALITY_INFO_NOT_FOUND,
  RESPONSE_404,
  PERSONALITY_INFO_DELETE_SUCCESS,
  PERSONALITY_INFO_CREATE_FAILURE_ALREADY_EXIST,
  PERSONALITY_INFO_UPDATE_SUCCESS,
  RESPONSE_200,
  RESPONSE_201,
} = require("../constants/constants");
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const RadioTracks = model.RadioTracks;
const RadioInfo = model.RadioInfo;
const v = new Validator();

// Define schema for personality information
const schema = {
  name: "string|min:3|max:255",
  name_jp: "string|optional",
  nickname: "string|optional",
  birthdate: "string",
  birthplace: "string|optional",
  bloodtype: {
    type: "string",
    items: "string",
    enum: ["Unknown", "A", "B", "AB", "O"],
    optional: true,
  },
  description: "string|optional",
  source: "string|optional",
  image: "string|optional",
};

/**
 * @function
 * @memberof module:personality-info
 * @summary A function to add new personality information.
 * @name create
 * @param {String} name - Personality's full name.
 * @param {String=} name_jp - Personality's name in Japanese.
 * @param {String=} nickname - Personality's nickname.
 * @param {String=} birthdate - Personality's birthdate.
 * @param {String=} birthplace - Personality's birthplace.
 * @param {String=} bloodtype - Personality's bloodtype.
 * @param {String=} description - Personality's description.
 * @param {String=} source - A link source to personality information.
 * @param {String=} image - Personality's image.
 * @returns {JSON} An object that contains both an error message and a successful about personality information.
 * */
exports.create = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, schema);
    // Check for validation errors
    if (validate.length) {
      // Return error response
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // Check if there's already a record with same name
    const checkData = await PersonalityInfo.findOne({
      where: { name: req.body.name },
    });
    // If there's already a record with same name
    if (checkData != null) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: PERSONALITY_INFO_CREATE_FAILURE_ALREADY_EXIST,
      });
    }
    // Create new personality info
    const data = await PersonalityInfo.create(req.body);
    // Return success response
    return res.status(201).json({
      status: 201,
      statusText: RESPONSE_201,
      message: PERSONALITY_INFO_CREATE_SUCCESS,
      data: data,
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
 * @memberof module:personality-info
 * @summary A function to update the personality information.
 * @name update
 * @param {String=} name - Personality's full name.
 * @param {String=} name_jp - Personality's name in Japanese.
 * @param {String=} nickname - Personality's nickname.
 * @param {String=} birthdate - Personality's birthdate.
 * @param {String=} birthplace - Personality's birthplace.
 * @param {String=} bloodtype - Personality's bloodtype.
 * @param {String=} description - Personality's description.
 * @param {String=} source - A link source to personality information.
 * @param {String=} image - Personality's image.
 * @returns {JSON} An object that contains both an error message and a successful about personality information.
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
    // Get id from params
    const id = req.params.id;
    // Get personality info by ID
    const personalityinfo = await PersonalityInfo.findByPk(id);
    if (!personalityinfo) {
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITY_INFO_NOT_FOUND,
      });
    }
    // Update personality info
    const data = await personalityinfo.update(req.body);
    // Return success response
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: PERSONALITY_INFO_UPDATE_SUCCESS,
      data: data,
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
 * @memberof module:personality-info
 * @summary A function to get all of personality information stored in database.
 * @name getAll
 * @returns {JSON} An object that contains personality information.
 * */
exports.getAll = async (req, res) => {
  try {
    // Find all personality info
    const personalityinfo = await PersonalityInfo.findAll();
    // If no personality info found
    if (personalityinfo.length === 0) {
      // Return not found error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITY_INFO_NOT_FOUND,
      });
    }
    // Return personality info
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: personalityinfo,
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
 * @memberof module:personality-info
 * @summary A function to get a specific personality information stored in database by it's ID.
 * @name get
 * @param {String} id - UUIDv4 which is represents an ID of personality information.
 * @returns {JSON} An object that contains a specific personality information.
 * */
exports.get = async (req, res) => {
  try {
    // define empty array to store a list of radio & tracks which personality participated
    const tracks = [];
    const radios = [];
    // Get the ID from params
    const id = req.params.id;
    // Find personality info by ID
    const personalityinfo = await PersonalityInfo.findByPk(id);
    // If no personality info found
    if (!personalityinfo) {
      // Return not found error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITY_INFO_NOT_FOUND,
      });
    }
    let track_list = await Personalities.findAll({
      where: { personality_id: id },
    });
    for (var data of track_list) {
      const trackData = await RadioTracks.findByPk(data.tracks_id);
      const radio = await RadioInfo.findByPk(trackData.radio_info);
      var final_track = {
        id: trackData.id,
        episode: trackData.episode,
        radio: {
          id: radio.id,
          name: radio.name,
          name_jp: radio.name_jp,
          image: radio.image,
        },
        radio_oa: trackData.radio_oa,
        image: trackData.image,
        favoritedBy: trackData.favoritedBy,
      };
      tracks.push(final_track);
    }

    tracks.reduce((acc, currentItem) => {
      const radio = currentItem.radio.id;
      if (!acc[radio]) {
        acc[radio] = [];
      }
      const data = {
        id: currentItem.radio.id,
        name: currentItem.radio.name,
        name_jp: currentItem.radio.name_jp,
        image: currentItem.radio.image,
      };
      radios.push(data);
      return acc;
    }, {});

    const final_radio = radios.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.id === obj.id)
    );

    const final_data = {
      id: personalityinfo.id,
      name: personalityinfo.name,
      name_jp: personalityinfo.name_jp,
      nickname: personalityinfo.nickname,
      birthdate: personalityinfo.birthdate,
      birthplace: personalityinfo.birthplace,
      bloodtype: personalityinfo.bloodtype,
      image: personalityinfo.image,
      description: personalityinfo.description,
      source: personalityinfo.source,
      favoritedBy: personalityinfo.favoritedBy,
      createdAt: personalityinfo.createdAt,
      updatedAt: personalityinfo.updatedAt,
      tracks: tracks,
      radio: final_radio,
    };
    // Return personality info
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: final_data,
    });
  } catch (error) {
    // Handle error
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:personality-info
 * @summary A function to delete a specific personality information stored in database by it's ID.
 * @name delete
 * @param {String} id - UUIDv4 which is represents an ID of personality information.
 * @returns {JSON} An object that contains a message about personality information deletion.
 * */
exports.delete = async (req, res) => {
  try {
    // Get the ID from params
    const id = req.params.id;
    // Find personality info by ID
    const personalityinfo = await PersonalityInfo.findByPk(id);
    // If no personality info found
    if (!personalityinfo) {
      // Return not found error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: PERSONALITY_INFO_NOT_FOUND,
      });
    }
    // Delete the personality information
    await personalityinfo.destroy();
    // Return success message
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: PERSONALITY_INFO_DELETE_SUCCESS,
    });
  } catch (error) {
    // Handle error
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};
