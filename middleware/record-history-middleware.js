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
const PersonalityInfo = model.PersonalityInfo;
const UsersFavRadioTracks = model.UsersFavRadioTracks;
const UsersFavPersonality = model.UsersFavPersonality;
const { verifyToken } = require("../utils/token-utils");

const recordHistory = async (req, res, next) => {
  try {
    let id = null;
    let userId = null;
    let endpoint = null;
    let action = null;
    let dataBefore = null;
    let dataAfter = null;
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: INVALID_TOKEN });
    }
    const decoded = verifyToken(token);
    id = req.params.id;
    userId = decoded.user.id;
    endpoint = req.originalUrl;
    action = req.method;
    dataBefore = null;
    dataAfter = req.body;
    const createHistory = async () => {
      await History.create({
        users_id: userId,
        endpoint: endpoint,
        action: action,
        dataBefore: dataBefore,
        dataAfter: dataAfter,
      });
    };
    if (action === "POST") {
      try {
        createHistory();
      } catch (error) {
        console.log({ error });
      }
    }
    if (action === "UPDATE") {
      switch (endpoint) {
        case `/personality-info/${id}`:
          try {
            dataBefore = await PersonalityInfo.findByPk(req.params.id);
            break;
          } catch (error) {
            console.log({ error });
            break;
          }
      }
      createHistory();
    }
    if (action === "DELETE") {
      switch (endpoint) {
        case `/personality-info/${id}`:
          try {
            dataBefore = await PersonalityInfo.findByPk(req.params.id);
            dataAfter = null;
            break;
          } catch (error) {
            console.log({ error });
            break;
          }
        case `/favorites/personality/${userId}`:
          try {
            dataBefore = await UsersFavPersonality.findOne({
              where: {
                users_id: req.params.userId,
                personality_id: req.body.personality_id,
              },
            });
            dataAfter = null;
            if (dataBefore != null) {
              createHistory();
              break;
            }
            return res.status(404).json(INVALID_ID);
          } catch (error) {
            console.log({ error });
            break;
          }
        case `/favorites/radio-info/${id}`:
          try {
            dataBefore = await UsersFavRadioInfo.findOne({
              where: {
                radio_info_id: req.body.id,
              },
            });
            if (dataBefore != null) {
              createHistory();
              break;
            }
            return res.status(404).json(INVALID_ID);
          } catch (error) {
            console.log({ error });
            break;
          }
        case `/favorites/radio-tracks/${id}`:
          try {
            dataBefore = await UsersFavRadioTracks.findOne({
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
      createHistory();
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: RESPONSE_500 });
  }
};

module.exports = { recordHistory };
