const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../models");
const User = model.Users;
const v = new Validator();
const { generateToken } = require("../utils/token-utils");

exports.register = async (req, res) => {
  try {
    const { role, username, email, password, name } = req.body;
    const schema = {
      role: {
        type: "string",
        items: "string",
        enum: ["admin", "user"],
      },
      username: "string|min:4|max:255",
      email: "email",
      password: "string|min:3|max:255",
      name: "string|min:3|max:255",
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json(validate);
    }
    await User.create({ role, username, email, password, name });
    return res.status(200).json({
      message: "Account successfully created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
