module.exports = (sequelize, DataTypes) => {
  const RadioInfo = sequelize.define(
    "RadioInfo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_jp: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      website: {
        type: DataTypes.STRING,
      },
      social: {
        type: DataTypes.STRING,
      },
      schedule: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
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
      tableName: "radio-info",
    }
  );

  return RadioInfo;
};
