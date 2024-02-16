/**
 * @module
 * @name auth-middleware
 *  */

// Import required modules
require("dotenv").config();
const { verifyToken } = require("../utils/token-utils");
const model = require("../models");
const {
  RESPONSE_400,
  ERROR_USER_AGENT_NULL,
  INVALID_ACCESS_DENIED,
  RESPONSE_401,
  INVALID_TOKEN_NOT_PROVIDED,
  RESPONSE_403,
  INVALID_ONLY_ADMIN,
  RESPONSE_500,
  INVALID_CREDENTIALS,
  INVALID_UNAUTHORIZED,
  INVALID_ACCESS_TOKEN_NOT_PROVIDED,
  INVALID_ACCESS_TOKEN,
  HEADERS_AUTHORIZATION,
  HEADERS_ACCESS_TOKEN,
  INVALID_TOKEN,
  ROLE_ADMIN,
  ROLE_USER,
  HEADERS_USER_AGENT,
} = require("../constants/constants");
const User = model.Users;
const LoginLogs = model.LoginLogs;

/**
 * @function
 * @memberof module:auth-middleware
 * @name verifyAccessToken
 * @summary Decode user's token and get user information to filter route can be accessed by all user.
 * */
const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.header(HEADERS_ACCESS_TOKEN);

    if (!token) {
      return res.status(401).json({
        status: 401,
        statusText: RESPONSE_401,
        message: INVALID_ACCESS_TOKEN_NOT_PROVIDED,
      });
    }

    if (token !== process.env.ACCESS_TOKEN) {
      return res.status(403).json({
        status: 403,
        statusText: RESPONSE_403,
        message: INVALID_ACCESS_TOKEN,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      statusText: RESPONSE_401,
      message: INVALID_TOKEN,
      error: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth-middleware
 * @name accessAllUser
 * @summary Decode user's token and get user information to filter route can be accessed by all user.
 * */
const accessAllUser = (req, res, next) => {
  try {
    const token = req.header(HEADERS_AUTHORIZATION);

    if (!token) {
      return res.status(401).json({
        status: 401,
        statusText: RESPONSE_401,
        message: INVALID_TOKEN_NOT_PROVIDED,
      });
    }
    const decoded = verifyToken(token);

    if (decoded.user.role !== ROLE_USER && decoded.user.role !== ROLE_ADMIN) {
      return res.status(403).json({
        status: 403,
        statusText: RESPONSE_403,
        message: INVALID_UNAUTHORIZED,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      statusText: RESPONSE_401,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth-middleware
 * @name accessByUserItself
 * @summary Decode user's token and get user information to filter route only can be accessed by current user.
 * */
const accessByUserItself = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const token = req.header(HEADERS_AUTHORIZATION);
    const decoded = verifyToken(token);
    if (decoded.user.id !== userId) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: INVALID_ACCESS_DENIED,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth-middleware
 * @name accessByUserItselfAndAdmin
 * @summary Decode user's token and get user information to filter route only can be accessed by current user and admins.
 * */
const accessByUserItselfAndAdmin = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const token = req.header(HEADERS_AUTHORIZATION);
    const decoded = verifyToken(token);
    const admin = await User.findOne({ where: { role: ROLE_ADMIN } });

    if (decoded.user.role === ROLE_ADMIN || decoded.user.role === ROLE_USER) {
      if (decoded.user.id === userId || decoded.user.id === admin.id) {
        next();
      } else {
        return res.status(400).json({
          status: 400,
          statusText: RESPONSE_400,
          message: INVALID_ACCESS_DENIED,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth-middleware
 * @name accessOnlyAdmin
 * @summary Decode user's token and get user information to filter route only can be accessed by admin.
 * */
const accessOnlyAdmin = (req, res, next) => {
  try {
    const token = req.header(HEADERS_AUTHORIZATION);

    if (!token) {
      return res.status(401).json({
        status: 401,
        statusText: RESPONSE_401,
        message: INVALID_TOKEN_NOT_PROVIDED,
      });
    }

    const decoded = verifyToken(token);

    if (decoded.user.role !== ROLE_ADMIN) {
      return res.status(403).json({
        status: 403,
        statusText: RESPONSE_403,
        message: INVALID_ONLY_ADMIN,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

/**
 * @function
 * @memberof module:auth-middleware
 * @name logLogin
 * @summary Log user login activity.
 * @param {String} email - User's email.
 * @param {String} ipAddress - User's IP Address.
 * @param {String} userAgent - User's user agent.
 * @param {String} loginTime - User's login time.
 * */
const logLogin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    const ipAddress = req.ip;
    const userAgent = req.get(HEADERS_USER_AGENT);
    if (!user) {
      return res.status(401).json({
        status: 401,
        statusText: RESPONSE_401,
        message: INVALID_CREDENTIALS,
      });
    }
    if (!userAgent) {
      return res.status(400).json({
        status: 400,
        statusText: RESPONSE_400,
        message: ERROR_USER_AGENT_NULL,
      });
    }
    await LoginLogs.create({
      users_id: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent,
      loginTime: new Date(),
    });
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};

module.exports = {
  verifyAccessToken,
  logLogin,
  accessAllUser,
  accessOnlyAdmin,
  accessByUserItself,
  accessByUserItselfAndAdmin,
};
