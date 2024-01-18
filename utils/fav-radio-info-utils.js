const model = require("../models");
const RadioInfo = model.RadioInfo;

const increaseRadioInfoFavCount = async (id) => {
  try {
    const radio = await RadioInfo.findByPk(id);
    const favCount = radio.favoritedBy;
    await radio.update({
      favoritedBy: favCount + 1,
    });
  } catch (error) {
    console.log({ error });
    return { error };
  }
};

const decreaseRadioInfoFavCount = async (id) => {
  try {
    const radio = await RadioInfo.findByPk(id);
    const favCount = radio.favoritedBy;
    await radio.update({
      favoritedBy: favCount - 1,
    });
  } catch (error) {
    console.log({ error });
    return { error };
  }
};

module.exports = { increaseRadioInfoFavCount, decreaseRadioInfoFavCount };
