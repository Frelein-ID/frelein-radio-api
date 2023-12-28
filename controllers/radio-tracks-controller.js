const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const RadioInfo = model.RadioInfo;
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const v = new Validator();

// Add radio tracks
exports.createRadioTracks = async (req, res) => {
  const schema = {
    episode: "number|integer|optional",
    radio_info: "number|integer",
    radio_oa: "string|optional",
    image: "string|optional",
    src: "string|optional",
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  const radiotracks = await RadioTracks.create(req.body);
  return res.json(radiotracks);
};

// Update radio tracks
exports.updateRadioTracks = async (req, res) => {
  const schema = {
    episode: "integer|optional",
    radio_info: "integer|optional",
    radio_oa: "string|optional",
    image: "string|optional",
    src: "string|optional",
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
exports.getAllRadioTracks = async (req, res) => {
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
      updatedAt: radio?.updatedAt,
    };
    result.push(radioData);
  }
  if (radiotracks.length === 0) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "Radio tracks not found",
    });
  }
  return res.status(200).json(result);
};

// Get radio tracks by ID
exports.getRadioTrackByID = async (req, res) => {
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
    updatedAt: radiotracks?.updatedAt,
  };
  return res.status(200).json(result);
};

// Delete radio tracks by ID
exports.deleteRadioTrackByID = async (req, res) => {
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
