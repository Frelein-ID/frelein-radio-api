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
  LOGIN_FAILURE_INVALID_EMAIL: LOGIN_FAILURE_INVALID_CREDENTIALS,
  RESPONSE_500,
  LOGIN_FAILURE_INVALID_EMAIL,
  LOGIN_FAILURE_INVALID_PASSWORD,
  RESPONSE_200,
  RESPONSE_400,
  RESPONSE_401,
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
 * @summary A function to register user using some params such as username, email, password and name. It returns a message contains success or failure registration process including error message if exist.
 * @param {String} username - User's username.
 * @param {String} email - User's email.
 * @param {String} password - User's password.
 * @param {String} name - User's full name.
 * @returns {JSON} A message contains success or failure registration process including error message if exist.
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
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // Check if username already exists
    const checkUsername = await User.findOne({
      where: { username: username },
    });
    if (checkUsername != null) {
      // Return registration process failure because of username already exist on database
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
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
        status: 400,
        statusText: RESPONSE_400,
        message: REGISTER_FAILURE_UNIQUE_EMAIL,
      });
    }
    // Register user's data into database
    await User.create({ role, username, email, password, name });
    // Return registration success message
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: REGISTER_SUCCESS,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth
 * @name login
 * @summary A function to helps user login to the system. It require email and password to verify the user account. The process start with email verification then if valid it will return an object containing the user's ID and token to access.
 * @param {String} email - The email used by the user to log in.
 * @param {String} password - The password used by the user to log in.
 * @returns {JSON} An object containing the user's ID and token to access.
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
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: LOGIN_FAILURE_INVALID_EMAIL,
      });
    }

    // Compare provided password with user's hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If password is not valid
    if (!isValidPassword) {
      // Return unauthorized error
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: LOGIN_FAILURE_INVALID_PASSWORD,
      });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      role: user.role,
    });
    // Update user last login
    await user.update({ lastLogin: new Date() });
    // Return token
    res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: {
        id: user.id,
        token: token,
      },
      message: LOGIN_SUCCESS,
    });
  } catch (error) {
    // Log error and return internal server error
    console.error(error);
    res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: SERVER_ERROR_INTERNAL_SERVER_ERROR,
    });
  }
};
