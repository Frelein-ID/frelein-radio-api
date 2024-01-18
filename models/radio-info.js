const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc The object model that contains radio information data that will be included in the RadioInfo table.
   * @property {String} id - UUIDv4 which represents the radio information's ID.
   * @property {String} name - Radio information's name.
   * @property {String=} name_jp - Radio information's name in Japanese.
   * @property {String=} image - An url links which represents the radio information's image.
   * @property {Text=} description - Description about the radio.
   * @property {String=} website - A link where you can stream the radio live.
   * @property {String=} social - Social media links of the radio.
   * @property {Text=} schedule - Radio on air schedule.
   * @property {Time=} start_time - Radio on air schedule in time.
   * @property {Date} createdAt - The time the radio information was created.
   * @property {Date} updatedAt - The last time the radio information was updated.
   */
  const RadioInfo = sequelize.define(
    "RadioInfo",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_jp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      social: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      schedule: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      favoritedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: "RadioInfo",
    }
  );

  return RadioInfo;
};
