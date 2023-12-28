module.exports = (sequelize, DataTypes) => {
  const Personalities = sequelize.define(
    "Personalities",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tracks_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "radio-tracks",
          key: "id",
        },
        allowNull: false,
      },
      personality_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "personality-info",
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
      tableName: "personalities",
    }
  );

  return Personalities;
};
