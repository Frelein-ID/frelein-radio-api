module.exports = (sequelize, DataTypes) => {
  const RadioTracks = sequelize.define(
    "RadioTracks",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      radio_info: {
        type: DataTypes.INTEGER,
        references: {
          model: "radio-info",
          key: "id",
        },
        allowNull: false,
      },
      radio_oa: {
        type: DataTypes.STRING,
      },
      artist: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      src: {
        type: DataTypes.STRING,
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
      tableName: "radio-tracks",
    }
  );

  return RadioTracks;
};
