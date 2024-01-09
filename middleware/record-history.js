const db = require("../models");
const usersFavRadioInfo = db.usersFavRadioInfo;

const recordHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const endpoint = req.originalUrl;
    const action = req.method;
    const dataAfter = req.body;
    if (action !== "GET") {
      const getDataBefore = async (endpoint) => {
        switch (endpoint) {
          case "/favorites/radio-info":
            const data = await usersFavRadioInfo.findByPk(req.body.id);
            return data;
          case 2:
            console.log("Nilai sama dengan 2");
            break;
          case 3:
            console.log("Nilai sama dengan 3");
            break;
          default:
            console.log("Invalid Endpoint");
        }
      };
      const dataBefore = await getDataBefore(endpoint);
      await db.History.create({
        userId,
        endpoint,
        action,
        dataBefore,
        dataAfter,
      });
    }

    next();
  } catch (error) {
    console.error("Error recording history:", error);
    next();
  }
};

module.exports = recordHistory;
