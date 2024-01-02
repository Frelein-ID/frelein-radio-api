const Validator = require("fastest-validator");
const model = require("../models");
const RadioInfo = model.RadioInfo;
const RadioTracks = model.RadioTracks;
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const v = new Validator();

// Add radio info
exports.createRadioInfo = async (req, res) => {
  try {
    // Define validation schema
    const schema = {
      name: "string|min:3|max:255",
      name_jp: "string|min:3|max:255",
      image: "string|optional",
      description: "string|optional",
      webiste: "string|optional",
      social: "string|optional",
      schedule: "string",
      start_time: "string",
    };

    // Validate request body
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }

    // Create radio info
    const radioinfo = await RadioInfo.create(req.body);

    // Return created radio info
    return res.status(200).json(radioinfo);
  } catch (error) {
    // Return error response
    return res.json({ error });
  }
};

// Update radio info
exports.updateRadioInfo = async (req, res) => {
  try {
    const schema = {
      name: "string|optional|min:3|max:255",
      name_jp: "string|optional|min:3|max:255",
      image: "string|optional",
      description: "string|optional",
      webiste: "string|optional",
      social: "string|optional",
      schedule: "string|optional",
      start_time: "string|optional",
    };
    const id = req.params.id;
    let radioinfo = await RadioInfo.findByPk(id);
    const validate = v.validate(req.body, schema);
    if (!radioinfo) {
      return res.json({ message: "Error, radio info not found" });
    }
    if (validate.length) {
      return res.status(400).json(validate);
    }
    radioinfo = await radioinfo.update(req.body);
    return res.status(200).json(radioinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get all radio info
exports.getAllRadioInfo = async (req, res) => {
  try {
    const radioinfo = await RadioInfo.findAll();
    if (radioinfo.length === 0) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio info not found",
      });
    }
    return res.status(200).json(radioinfo);
  } catch (error) {
    return res.json({ error });
  }
};

// Get radio info by ID
exports.getRadioInfoByID = async (req, res) => {
  const id = req.params.id;
  const radioinfo = await RadioInfo.findByPk(id);
  const radiotracks = await RadioTracks.findAll({
    where: { radio_info: id },
  });
  const tracks = [];
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
      error: "404 Not Found",
      message: "Radio info not found",
    });
  }
  return res.status(200).json(result);
};

// Delete radio info by ID
exports.deleteRadioInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const radioinfo = await RadioInfo.findByPk(id);
    if (!radioinfo) {
      return res.status(404).json({
        error: "404 Not Found",
        message: "Radio info not found",
      });
    }
    await radioinfo.destroy();
    return res.status(200).json({
      message: "Deleted successfully!",
    });
  } catch (error) {
    res.json({ error });
  }
};
