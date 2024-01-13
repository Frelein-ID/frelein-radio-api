const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc The object model that contains data that will be entered into the login log table to record the login history of the user.
   * @property {String} id - UUIDv4 which represents the login log's ID.
   * @property {String} users_id - UUIDv4 which represents the user's ID refering to {@link Users}.
   * @property {String} ipAddress - Client's IP Address.
   * @property {String} userAgent - Client's User Agent.
   * @property {Object} loginTime - User's login time.
   */
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
        allowNull: false,
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
