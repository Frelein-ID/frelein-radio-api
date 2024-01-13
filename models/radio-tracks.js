const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc The object model that contains radio tracks data that will be included in the RadioTracks table.
   * @property {String} id - UUIDv4 which represents the radio tracks's ID.
   * @property {Number=} episode - Radio tracks's episode.
   * @property {String} radio_info - UUIDv4 which represents the radio information's ID, refers to {@link RadioInfo}.
   * @property {Date=} radio_oa - When the radio is on air.
   * @property {String=} image - An url links which represents the radio tracks's image.
   * @property {Text} src - Radio streaming source.
   * @property {Date} createdAt - The time the radio tracks was created.
   * @property {Date} updatedAt - The last time the radio tracks was updated.
   */
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
        allowNull: true,
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
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
