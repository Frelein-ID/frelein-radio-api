const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc A data object that contains data related to the personality who fills the radio track.
   * @property {String} id - UUIDv4 which represents the personalities ID.
   * @property {String} tracks_id - UUIDv4 which represents the radio tracks ID refering to {@link RadioTracks}.
   * @property {String} personality_id - UUIDv4 which represents the personality info ID refering to {@link PersonalityInfo}.
   * @property {Date} createdAt - The time personalities created.
   * @property {Date} updatedAt - The time personalities updated.
   */
  const Personalities = sequelize.define(
    "Personalities",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      tracks_id: {
        type: DataTypes.UUID,
        references: {
          model: "RadioTracks",
          key: "id",
        },
        allowNull: false,
      },
      personality_id: {
        type: DataTypes.UUID,
        references: {
          model: "PersonalityInfo",
          key: "id",
        },
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "Personalities",
    }
  );

  return Personalities;
};
