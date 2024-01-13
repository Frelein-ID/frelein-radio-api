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
  ERROR_500,
} = require("../constants/constants");

const schema = {
  tracks_id: "string",
  personality_id: "string",
};

exports.create = async (req, res) => {
  try {
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json({
        error: RESPONSE_400,
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
    const isDataValid = checkData?.isNewRecord;
    // if (isTrackValid === false) {
    //   // Return registration process failure because of username already exist on database
    //   return res.status(400).json({
    //     message: REGISTER_FAILURE_UNIQUE_USERNAME,
    //   });
    // }
    // const radiotracks = await RadioTracks.create(req.body);
    // return res.status(200).json({
    //   message: PERSONALITIES_SUCCESS_CREATED,
    //   data: radiotracks,
    // });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: ERROR_500 });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  let personalities = await Personalities.findByPk(id);
  if (!personalities) {
    return res.status(404).json({
      error: RESPONSE_404,
      message: PERSONALITIES_FAILURE_NOT_FOUND,
    });
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json({
      error: RESPONSE_400,
      message: validate,
    });
  }
  personalities = await Personalities.update(req.body);
  return res.status(200).json({
    message: PERSONALITIES_SUCCESS_UPDATED,
    data: personalities,
  });
};

exports.getAll = async (req, res) => {
  const personalities = await Personalities.findAll();
  return res.status(200).json(personalities);
};

exports.get = async (req, res) => {
  let result = [];
  const id = req.params.id;
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
      error: "404 Not Found",
      message: "Personality info not found",
    });
  }
  const result_final = [...new Set(result.map(JSON.stringify))].map(JSON.parse);
  return res.status(200).json(result_final);
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
