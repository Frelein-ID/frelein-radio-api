const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
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
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      birthplace: {
        type: DataTypes.STRING,
      },
      bloodtype: {
        type: DataTypes.ENUM("A", "B", "AB", "O"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.STRING,
      },
      source: {
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
      tableName: "PersonalityInfo",
    }
  );

  return PersonalityInfo;
};
