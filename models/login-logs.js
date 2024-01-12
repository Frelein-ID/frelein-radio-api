const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const LoginLogs = sequelize.define(
    "LoginLogs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      users_id: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      loginTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "LoginLogs",
      timestamps: false,
    }
  );

  return LoginLogs;
};
