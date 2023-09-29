"use strict";

require("dotenv").config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("radio-tracks", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      radio_info: {
        type: Sequelize.INTEGER,
        references: {
          model: "radio-info",
          key: "id",
        },
        allowNull: false,
      },
      radio_oa: {
        type: Sequelize.DATEONLY,
      },
      presenter: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      src: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("radio-tracks");
  },
};
