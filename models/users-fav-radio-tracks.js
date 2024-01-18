const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc A data object that contains data related to the users favorite radio tracks.
   * @property {String} id - UUIDv4 which represents the personalities ID.
   * @property {String} users_id - UUIDv4 which represents the users ID refering to {@link Users}.
   * @property {String} tracks_id - UUIDv4 which represents the radio tracks ID refering to {@link RadioTracks}.
   * @property {Date} createdAt - The time personalities created.
   * @property {Date} updatedAt - The time personalities updated.
   */
  const UsersFavRadioTracks = sequelize.define(
    "UsersFavRadioTracks",
    {
      users_id: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
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
      tableName: "UsersFavRadioTracks",
    }
  );

  return UsersFavRadioTracks;
};
