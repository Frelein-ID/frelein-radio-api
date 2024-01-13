const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc The object model that contains data that will be inserted into the history table to record data changes that occur in the tables in the system.
   * @property {String} id - UUIDv4 which represents the history ID.
   * @property {String} users_id - UUIDv4 which represents the user's ID refering to {@link Users Users}.
   * @property {String} endpoint - endpoint that refers to the API route.
   * @property {String} action - HTTP method used by the client.
   * @property {Object=} dataBefore - Snapshot of data before change.
   * @property {Object} dataAfter - Snapshot of data after change.
   * @property {Date} createdAt - Time when it happened.
   */
  const History = sequelize.define(
    "History",
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
      endpoint: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataBefore: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      dataAfter: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "History",
      updatedAt: false,
    }
  );

  return History;
};
