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
