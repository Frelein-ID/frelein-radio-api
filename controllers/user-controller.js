/**
 * @module
 * @name user
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const Users = model.Users;
const bcrypt = require("bcrypt");
const v = new Validator();
const { verifyToken } = require("../utils/token-utils");
const {
  RESPONSE_404,
  USER_NOT_FOUND,
  USER_DELETE_SUCCESS,
  RESPONSE_500,
  USER_UPDATE_SUCCESS,
  RESPONSE_400,
  INVALID_ACCESS_DENIED,
  USER_UPDATE_PASSWORD_SUCCESS,
  RESPONSE_200,
} = require("../constants/constants");

// Define validation schema
const userDataSchema = {
  name: "string|optional|min:3|max:255",
  image: "string|optional",
};

const userPasswordSchema = {
  currentPassword: "string",
  password: "string|min:8|max:16",
};

/**
 * @function
 * @memberof module:user
 * @summary A function to get a single user data by it's ID.
 * @name get
 * @param {String} id - User's ID.
 * @returns {JSON} An object that contains a single user data.
 * */
exports.get = async (req, res) => {
  try {
    // Get id from params
    const id = req.params.userId;
    // Get user data using it's ID
    let user = await Users.findByPk(id);
    if (!user) {
      // Return error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_NOT_FOUND,
      });
    }
    return res.status(200).json({
      status: 500,
      statusText: RESPONSE_500,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

exports.getMyData = async (req, res) => {
  try {
    // Get id from token
    const id = req.params.userId;
    // Get user data using it's ID
    let user = await Users.findByPk(id);
    if (!user) {
      // Return error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_NOT_FOUND,
      });
    }
    return res.status(200).json({
      status: 500,
      statusText: RESPONSE_500,
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:user
 * @summary A function to get a list of user data by it's ID.
 * @name getAll
 * @returns {JSON} An object that contains a list of user data.
 * */
exports.getAll = async (req, res) => {
  try {
    // Get all user data
    const user = await Users.findAll();
    // If no user found
    if (user.length === 0) {
      // Return not found error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_NOT_FOUND,
      });
    }
    // Return all user
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: user,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:user
 * @summary A function to update user data.
 * @name updateUser
 * @param {String} id - User's ID.
 * @param {String=} name - User's full name.
 * @param {String=} image - User's image url.
 * @returns {JSON} An object that contains both an error message and a successful about user.
 * */
exports.updateUser = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, userDataSchema);
    // If validation fails
    if (validate.length) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // Get id from params
    const id = req.params.userId;
    // Get user data using it's ID
    let user = await Users.findByPk(id);
    if (!user) {
      // Return error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_NOT_FOUND,
      });
    }
    await user.update({
      name: req.body.name,
      image: req.body.image,
    });
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: USER_UPDATE_SUCCESS,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    // Validate request body
    const validate = v.validate(req.body, userPasswordSchema);
    // If validation fails
    if (validate.length) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: validate,
      });
    }
    // Get id from params
    const id = req.params.userId;
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    const decoded = verifyToken(token);
    // check if password change target and current logged in user is same
    // so this logged in user cannot change the other user password by the ID itself
    if (decoded.user.id === id) {
      // Get user data using it's ID
      let user = await Users.findByPk(id);
      if (!user) {
        // Return error
        return res.json({
          status: 404,
          statusText: RESPONSE_404,
          message: USER_NOT_FOUND,
        });
      }
      // compare current password with stored hashed password
      const isValidPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      // if password valid, hash provided password and update it's password
      if (isValidPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        data = await user.update({
          password: hashedPassword,
        });
      }
      // return success message
      return res.status(200).json({
        status: 200,
        statusText: RESPONSE_200,
        message: USER_UPDATE_PASSWORD_SUCCESS,
      });
    }
    // return error
    return res.status(400).json({
      status: 400,
      statusText: RESPONSE_400,
      message: INVALID_ACCESS_DENIED,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:user
 * @summary A function to delete user data.
 * @name delete
 * @param {String} id - UUIDv4 which represents user's ID.
 * @returns {JSON} An object that contains both an error message and a successful about user deletion.
 * */
exports.delete = async (req, res) => {
  try {
    // Get id from params
    const id = req.params.id;
    // Get user data using it's ID
    const user = await Users.findByPk(id);
    // If user not found
    if (!user) {
      // Return error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: USER_NOT_FOUND,
      });
    }
    // Delete user data
    await user.destroy();
    // Return success
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      message: USER_DELETE_SUCCESS,
    });
  } catch (error) {
    // Handle errors
    console.log({ error });
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};
