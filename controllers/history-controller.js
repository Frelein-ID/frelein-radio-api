/**
 * @module
 * @name history
 *  */

// Import required modules
const model = require("../models");
const {
  RESPONSE_500,
  RESPONSE_404,
  RESPONSE_200,
  HISTORY_NOT_FOUND,
} = require("../constants/constants");
const History = model.History;

/**
 * @function
 * @memberof module:history
 * @summary A function to get all history information stored in database.
 * @name getAll
 * @returns {JSON} An object that contains history information.
 * */
exports.getAll = async (req, res) => {
  try {
    // Find all history info
    const data = await History.findAll();
    // If no history info found
    if (data.length === 0) {
      // Return not found error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: HISTORY_NOT_FOUND,
      });
    }
    // Return history info
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: data,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:history-info
 * @summary A function to get a specific history information stored in database by it's ID.
 * @name get
 * @param {String} id - UUIDv4 which is represents an ID of history information.
 * @returns {JSON} An object that contains a specific history information.
 * */
exports.get = async (req, res) => {
  try {
    // Get the ID from params
    const id = req.params.id;
    // Find history info by ID
    const data = await History.findByPk(id);
    // If no history info found
    if (!data) {
      // Return not found error
      return res.status(404).json({
        status: 404,
        statusText: RESPONSE_404,
        message: HISTORY_NOT_FOUND,
      });
    }
    // Return history info
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      data: data,
    });
  } catch (error) {
    // Handle error
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};
