const model = require("../models");
const PersonalityInfo = model.PersonalityInfo;

const increasePersonalityInfoFavCount = async (id) => {
  try {
    const personality = await PersonalityInfo.findByPk(id);
    const favCount = personality.favoritedBy;
    await personality.update({
      favoritedBy: favCount + 1,
    });
  } catch (error) {
    console.log({ error });
    return { error };
  }
};

const decreasePersonalityInfoFavCount = async (id) => {
  try {
    const personality = await PersonalityInfo.findByPk(id);
    const favCount = personality.favoritedBy;
    await personality.update({
      favoritedBy: favCount - 1,
    });
  } catch (error) {
    console.log({ error });
    return { error };
  }
};

module.exports = {
  increasePersonalityInfoFavCount,
  decreasePersonalityInfoFavCount,
};
