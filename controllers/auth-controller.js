/**
 * @module
 * @name auth
 *  */

// Import required modules
const Validator = require("fastest-validator");
const bcrypt = require("bcrypt");
const model = require("../models");
const User = model.Users;
const v = new Validator();
const { generateToken } = require("../utils/token-utils");
const {
  REGISTER_SUCCESS,
  REGISTER_FAILURE_UNIQUE_USERNAME,
  REGISTER_FAILURE_UNIQUE_EMAIL,
  LOGIN_FAILURE_INVALID_CREDENTIALS,
  RESPONSE_500,
} = require("../constants/constants");

// Define schema for user registration
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

/**
 * @function
 * @memberof module:auth
 * @name register
 * @param {String} username - User's username.
 * @param {String} email - User's email.
 * @param {String} password - User's password.
 * @param {String} name - User's full name.
 * @returns {JSON} An object that contains both an error message and a successful registration message.
 * */
exports.register = async (req, res) => {
  try {
    // Declare variable
    const role = "user";
    // Destructure request body
    const { username, email, password, name } = req.body;

    // Validate request body against schema using fastest-validator
    const validate = v.validate(req.body, schema);
    if (validate.length) {
      // Return validation errors
      return res.status(400).json(validate);
    }
    // Check if username already exists
    const checkUsername = await User.findOne({
      where: { username: username },
    });
    if (checkUsername != null) {
      // Return registration process failure because of username already exist on database
      return res.status(400).json({
        message: REGISTER_FAILURE_UNIQUE_USERNAME,
      });
    }
    // Check if email already exists
    const checkEmail = await User.findOne({
      where: { email: email },
    });
    if (checkEmail != null) {
      // Return registration process failure because of email already exist on database
      return res.status(400).json({
        message: REGISTER_FAILURE_UNIQUE_EMAIL,
      });
    }
    // Register user's data into database
    await User.create({ role, username, email, password, name });
    // Return registration success message
    return res.status(200).json({
      message: REGISTER_SUCCESS,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: RESPONSE_500 });
  }
};

/**
 * @function
 * @memberof module:auth
 * @name login
 * @param {String} email - The email used by the user to log in.
 * @param {String} password - The password used by the user to log in.
 * @returns {JSON} An object with generated JWT token.
 * */
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // If user not found
    if (!user) {
      // Return unauthorized error
      return res.status(401).json({ error: LOGIN_FAILURE_INVALID_CREDENTIALS });
    }

    // Compare provided password with user's hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If password is not valid
    if (!isValidPassword) {
      // Return unauthorized error
      return res.status(401).json({ error: LOGIN_FAILURE_INVALID_CREDENTIALS });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      role: user.role,
    });
    // Return token
    res.json({ token });
  } catch (error) {
    // Log error and return internal server error
    console.error(error);
    res.status(500).json({ error: SERVER_ERROR_INTERNAL_SERVER_ERROR });
  }
};
