/**
 * @module
 * @name user
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const User = model.User;
const v = new Validator();
const {
  RESPONSE_404,
  USER_NOT_FOUND,
  USER_DELETE_SUCCESS,
  RESPONSE_500,
} = require("../constants/constants");

// Define validation schema
const schema = {
  username: "string|optional|min:3|max:255",
  email: "string|optional",
  password: "string|optional",
  name: "string|optional|min:3|max:255",
  image: "string|optional",
};

/**
 * @function
 * @memberof module:user
 * @summary A function to update user data.
 * @name update
 * @param {Integer=} username - User's username.
 * @param {String} email - User's email.
 * @param {String=} password - User's password.
 * @param {String=} name - User's full name.
 * @param {String=} image - User's image url.
 * @returns {JSON} An object that contains both an error message and a successful about user.
 * */
exports.updateUser = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, schema);
    // If validation fails
    if (validate.length) {
      return res.status(400).json(validate);
    }
    // Get id from params
    const id = req.params.id;
    // Get user data using it's ID
    let user = await User.findByPk(id);
    if (!user) {
      // Return error
      return res.json({
        error: RESPONSE_404,
        message: USER_NOT_FOUND,
      });
    }
    radioinfo = await radioinfo.update(req.body);
    return res.status(200).json(radioinfo);
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      error: RESPONSE_500,
      message: error.message,
    });
  }
};

/**
 * @function
 * @memberof module:user
 * @summary A function to update user data.
 * @name delete
 * @param {String} id - UUIDv4 which represents user's ID.
 * @returns {JSON} An object that contains both an error message and a successful about user deletion.
 * */
exports.deleteUser = async (req, res) => {
  try {
    // Get id from params
    const id = req.params.id;
    // Get user data using it's ID
    const user = await User.findByPk(id);
    // If user not found
    if (!user) {
      // Return error
      return res.status(404).json({
        error: RESPONSE_404,
        message: USER_NOT_FOUND,
      });
    }
    // Delete user data
    await user.destroy();
    // Return success
    return res.status(200).json({
      message: USER_DELETE_SUCCESS,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      error: RESPONSE_500,
      message: error.message,
    });
  }
};
