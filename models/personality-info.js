const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc The object model that contains personality information data that will be included in the PersonalityInfo table.
   * @property {String} id - UUIDv4 which represents the personality information's ID.
   * @property {String} name - Personality information's name.
   * @property {String=} name_jp - Personality name in Japanese.
   * @property {String=} nickname - Personality's nickname.
   * @property {String=} birthdate - Personality's birth date.
   * @property {String=} birthplace - Personality's birth place.
   * @property {String} bloodtype - Personality's blood type.
   * @property {String=} image - An url link which represents the personality information's image.
   * @property {Text=} description - Description about the personality.
   * @property {String=} source - Personality information source link.
   * @property {Integer=} favoritedBy - Count favorite of personality.
   * @property {Date} createdAt - The time the personality information was created.
   * @property {Date} updatedAt - The last time the personality information was updated.
   */
  const PersonalityInfo = sequelize.define(
    "PersonalityInfo",
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
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      birthplace: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bloodtype: {
        type: DataTypes.ENUM("Unknown", "A", "B", "AB", "O"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      source: {
        type: DataTypes.STRING,
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
      tableName: "PersonalityInfo",
    }
  );

  return PersonalityInfo;
};
