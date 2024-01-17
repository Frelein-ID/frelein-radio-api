const {
  INVALID_ENDPOINT,
  DATA_DELETED,
  RESPONSE_500,
  INVALID_TOKEN,
  INVALID_ID,
  INVALID_ID_NULL,
} = require("../constants/constants");
const model = require("../models");
const History = model.History;
const UsersFavRadioInfo = model.UsersFavRadioInfo;
const { verifyToken } = require("../utils/token-utils");

const getDataBefore = async (endpoint) => {
  let data = null;
};

const recordHistory = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: INVALID_TOKEN });
    }
    let id = null;
    let dataBefore = null;
    id = req.params.id;
    const decoded = verifyToken(token);
    const userId = decoded.user.id ? decoded.user.id : null;
    const endpoint = req.originalUrl;
    const action = req.method;
    const dataAfter = req.body;
    if (action === "POST") {
      switch (endpoint) {
        case "/favorites/radio-info":
          try {
            await History.create({
              users_id: userId,
              endpoint: endpoint,
              action: action,
              dataBefore: dataBefore,
              dataAfter: dataAfter,
            });
            break;
          } catch (error) {
            console.log({ error });
            break;
          }
        default:
          console.log(INVALID_ENDPOINT);
          break;
      }
    }
    if (action === "UPDATE") {
    }
    if (action === "DELETE") {
      switch (endpoint) {
        case `/favorites/radio-info/${id}`:
          try {
            dataBefore = await UsersFavRadioInfo.findOne({
              where: {
                id: req.params.id,
              },
            });
            if (dataBefore != null) {
              await History.create({
                users_id: userId,
                endpoint: endpoint,
                action: action,
                dataBefore: dataBefore,
                dataAfter: null,
              });
              break;
            }
            return res.status(404).json(INVALID_ID);
          } catch (error) {
            console.log({ error });
            break;
          }
        default:
          console.log(INVALID_ENDPOINT);
          break;
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: RESPONSE_500 });
  }
};

module.exports = { recordHistory };
