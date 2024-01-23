const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc A data object that contains data related to the users favorite radio information.
   * @property {String} users_id - UUIDv4 which represents the users ID refering to {@link Users}.
   * @property {String} radio_info_id - UUIDv4 which represents the radio information ID refering to {@link RadioInfo}.
   * @property {Date} createdAt - The time personalities created.
   * @property {Date} updatedAt - The time personalities updated.
   */
  const UsersFavRadioInfo = sequelize.define(
    "UsersFavRadioInfo",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      users_id: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      radio_info_id: {
        type: DataTypes.UUID,
        references: {
          model: "RadioInfo",
          key: "id",
        },
        allowNull: false,
      },
      favoritedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "UsersFavRadioInfo",
      createdAt: false,
      updatedAt: false,
    }
  );

  return UsersFavRadioInfo;
};
