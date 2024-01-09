const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const User = model.User;
const v = new Validator();

// Add personalities
exports.updateUser = async (req, res) => {
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

// Delete user account
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({
      error: "404 Not Found",
      message: "User not found",
    });
  }
  await user.destroy();
  return res.status(200).json({
    message: "User deleted successfully!",
  });
};
