const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
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
