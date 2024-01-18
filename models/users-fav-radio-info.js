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
      tableName: "UsersFavRadioInfo",
    }
  );

  return UsersFavRadioInfo;
};
