const model = require("../models");
const History = model.History;
const UsersFavRadioInfo = model.UsersFavRadioInfo;
const { verifyToken } = require("../utils/token-utils");

const recordHistory = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const decoded = verifyToken(token);
    const userId = decoded.user.id ? decoded.user.id : null;
    const endpoint = req.originalUrl;
    const action = req.method;
    const dataAfter = req.body;
    if (action === "POST") {
      const getDataBefore = async (endpoint) => {
        let data = null;
        switch (endpoint) {
          case "/favorites/radio-info":
            data = await UsersFavRadioInfo.findOne({
              where: {
                users_id: req.body.users_id,
                radio_info_id: req.body.radio_info_id,
              },
            });
            return data;
          default:
            console.log("Invalid Endpoint");
        }
      };
      let dataBefore = null;
      dataBefore = await getDataBefore(endpoint);
      await History.create({
        users_id: userId,
        endpoint: endpoint,
        action: action,
        dataBefore: dataBefore,
        dataAfter: dataAfter,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { recordHistory };
