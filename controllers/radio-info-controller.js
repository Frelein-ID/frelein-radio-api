const Validator = require("fastest-validator");
const model = require("../models");
const RadioInfo = model.RadioInfo;
const RadioTracks = model.RadioTracks;
const PersonalityInfo = model.PersonalityInfo;
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
  const { radiotracks } = await RadioTracks.findAll({
    where: { radio_info: radioinfo.id },
  });
  console.log({ radiotracks });
  const oa_list = [];
  for (var radio of radiotracks) {
    const personality1 = await PersonalityInfo.findOne({
      where: { id: radio.personality_1 },
    });
    const personality2 = await PersonalityInfo.findOne({
      where: { id: radio.personality_2 },
    });
    const personality3 = await PersonalityInfo.findOne({
      where: { id: radio.personality_3 },
    });
    const oa_list_data = {
      id: radio.id,
      episode: radio.episode,
      date: radio.radio_oa,
      personality_1: {
        name: personality1?.name,
        name_kanji: personality1?.name_kanji,
      },
      personality_2: {
        name: personality2?.name,
        name_kanji: personality2?.name_kanji,
      },
      personality_3: {
        name: personality3?.name,
        name_kanji: personality3?.name_kanji,
      },
      image: radio?.image,
    };
    oa_list.push(oa_list_data);
  }
  const result = {
    id: radioinfo?.id,
    name: radioinfo?.name,
    name_jp: radioinfo?.name_jp,
    oa_list: oa_list,
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
