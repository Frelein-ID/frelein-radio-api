const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc A data object that contains data related to the users favorite personality.
   * @property {String} users_id - UUIDv4 which represents the users ID refering to {@link Users}.
   * @property {String} personality_id - UUIDv4 which represents the personality info ID refering to {@link PersonalityInfo}.
   * @property {Date} favoritedAt - The time personalities favorited.
   */
  const UsersFavPersonality = sequelize.define(
    "UsersFavPersonality",
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
      personality_id: {
        type: DataTypes.UUID,
        references: {
          model: "PersonalityInfo",
          key: "id",
        },
        allowNull: false,
      },
      favoritedAt: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(),
        allowNull: false,
      },
    },
    {
      tableName: "UsersFavPersonality",
      createdAt: false,
      updatedAt: false,
    }
  );

  return UsersFavPersonality;
};
