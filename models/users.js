const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   * @classdesc The object model that contains user data that will be entered in the user table.
   * @property {String} id - UUIDv4 which represents the user's ID.
   * @property {('admin' | 'user')} role - An enum that has only admin and user values, represents the user's role.
   * @property {String} username - User's username.
   * @property {String} email - User's email.
   * @property {String} password - User's password.
   * @property {String} name - User's full name.
   * @property {String=} image - An url links which represents the user's image.
   * @property {Date} createdAt - The time the user account was created.
   * @property {Date} updatedAt - The last time the user account was updated.
   */
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
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
      hooks: {
        beforeCreate: async (user) => {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          user.password = hashedPassword;
        },
      },
    },
    {
      tableName: "Users",
    }
  );

  Users.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return Users;
};
