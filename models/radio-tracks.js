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
      episode: {
        type: DataTypes.INTEGER,
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
      tableName: "radio-tracks",
    }
  );

  return RadioTracks;
};
