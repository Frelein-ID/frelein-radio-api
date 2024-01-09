const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const RadioInfo = model.RadioInfo;
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const v = new Validator();

// Add personalities
exports.createPersonalities = async (req, res) => {
  const schema = {
    tracks_id: "string",
    personality_id: "string",
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  const radiotracks = await RadioTracks.create(req.body);
  return res.json(radiotracks);
};

// Update personalities
exports.updatePersonalities = async (req, res) => {
  const schema = {
    tracks_id: "string",
    personality_id: "string",
  };
  const id = req.params.id;
  let radiotracks = await RadioTracks.findByPk(id);
  if (!radiotracks) {
    return res.status(404).json({ message: "Error, radio tracks not found" });
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  radiotracks = await radiotracks.update(req.body);
  return res.status(200).json(radiotracks);
};

// Get all radio tracks
exports.getAllPersonalities = async (req, res) => {
  const personalities = await Personalities.findAll();
  return res.status(200).json(personalities);
};

// Get personalities by radio tracks id
exports.getPersonalitiesByRadioTracksID = async (req, res) => {
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

// Delete personalities
exports.deletePersonalitiesByID = async (req, res) => {
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
