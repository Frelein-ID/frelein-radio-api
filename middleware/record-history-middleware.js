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
const Users = model.Users;
const RadioInfo = model.RadioInfo;
const RadioTracks = model.RadioTracks;
const PersonalityInfo = model.PersonalityInfo;
const Personalities = model.Personalities;
const UsersFavRadioInfo = model.UsersFavRadioInfo;
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
        case `/radio-info/${id}`:
          try {
            dataBefore = await RadioInfo.findByPk(req.params.id);
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/radio-tracks/${id}`:
          try {
            dataBefore = await RadioTracks.findByPk(req.params.id);
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/personality-info/${id}`:
          try {
            dataBefore = await PersonalityInfo.findByPk(req.params.id);
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/personalities/${id}`:
          try {
            dataBefore = await Personalities.findByPk(req.params.id);
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/user/${id}`:
          try {
            dataBefore = await Users.findByPk(req.params.id);
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/user/${id}/change-password`:
          try {
            dataBefore = await Users.findByPk(req.params.id);
          } catch (error) {
            console.log({ error });
          }
          break;
        default:
          console.log(INVALID_ENDPOINT);
          break;
      }
      createHistory();
    }
    if (action === "DELETE") {
      switch (endpoint) {
        case `/radio-info/${id}`:
          try {
            dataBefore = await RadioInfo.findByPk(req.params.id);
            dataAfter = null;
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/radio-tracks/${id}`:
          try {
            dataBefore = await RadioTracks.findByPk(req.params.id);
            dataAfter = null;
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/personality-info/${id}`:
          try {
            dataBefore = await PersonalityInfo.findByPk(req.params.id);
            dataAfter = null;
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/personalities/${id}`:
          try {
            dataBefore = await Personalities.findByPk(req.params.id);
            dataAfter = null;
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/user/${id}`:
          try {
            dataBefore = await Users.findByPk(req.params.id);
            dataAfter = null;
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/favorites/personality/${userId}`:
          try {
            dataBefore = await UsersFavPersonality.findOne({
              where: {
                users_id: req.params.userId,
                personality_id: req.body.personality_id,
              },
            });
            dataAfter = null;
          } catch (error) {
            console.log({ error });
          }
          break;
        case `/favorites/radio-info/${userId}`:
          try {
            dataBefore = await UsersFavRadioInfo.findOne({
              where: {
                users_id: req.params.userId,
                radio_info_id: req.body.radio_info_id,
              },
            });
            dataAfter = null;
          } catch (error) {
            console.log({ error });
          }
        case `/favorites/radio-tracks/${userId}`:
          try {
            dataBefore = await UsersFavRadioTracks.findOne({
              where: {
                users_id: req.params.userId,
                tracks_id: req.body.tracks_id,
              },
            });
            dataAfter = null;
          } catch (error) {
            console.log({ error });
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
