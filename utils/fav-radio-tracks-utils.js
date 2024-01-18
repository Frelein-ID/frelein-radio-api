const model = require("../models");
const RadioTracks = model.RadioTracks;

const increaseRadioTracksFavCount = async (id) => {
  try {
    const radio = await RadioTracks.findByPk(id);
    const favCount = radio.favoritedBy;
    await radio.update({
      favoritedBy: favCount + 1,
    });
  } catch (error) {
    console.log({ error });
    return { error };
  }
};

const decreaseRadioTracksFavCount = async (id) => {
  try {
    const radio = await RadioTracks.findByPk(id);
    const favCount = radio.favoritedBy;
    await radio.update({
      favoritedBy: favCount - 1,
    });
  } catch (error) {
    console.log({ error });
    return { error };
  }
};

module.exports = { increaseRadioTracksFavCount, decreaseRadioTracksFavCount };
