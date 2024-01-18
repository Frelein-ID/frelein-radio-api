module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc A data object that contains data related to the users favorite personality.
   * @property {String} users_id - UUIDv4 which represents the users ID refering to {@link Users}.
   * @property {String} personality_id - UUIDv4 which represents the personality info ID refering to {@link PersonalityInfo}.
   * @property {Date} createdAt - The time personalities created.
   * @property {Date} updatedAt - The time personalities updated.
   */
  const UsersFavPersonality = sequelize.define(
    "UsersFavPersonality",
    {
      users_id: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
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
      tableName: "UsersFavPersonality",
    }
  );

  return UsersFavPersonality;
};
