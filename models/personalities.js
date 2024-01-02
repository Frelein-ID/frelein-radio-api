const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
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
