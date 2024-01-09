const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
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
