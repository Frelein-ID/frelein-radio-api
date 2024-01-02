const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const RadioTracks = sequelize.define(
    "RadioTracks",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      episode: {
        type: DataTypes.INTEGER,
      },
      radio_info: {
        type: DataTypes.UUID,
        references: {
          model: "RadioInfo",
          key: "id",
        },
        allowNull: false,
      },
      radio_oa: {
        type: DataTypes.DATEONLY,
      },
      image: {
        type: DataTypes.TEXT,
      },
      src: {
        type: DataTypes.TEXT,
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
      tableName: "RadioTracks",
    }
  );

  return RadioTracks;
};
