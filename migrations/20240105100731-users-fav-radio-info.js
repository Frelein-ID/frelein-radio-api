"use strict";

const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UsersFavRadioInfo", {
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
      radio_info_id: {
        type: DataTypes.UUID,
        references: {
          model: "RadioInfo",
          key: "id",
        },
        allowNull: false,
      },
      favoritedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UsersFavRadioInfo");
  },
};
