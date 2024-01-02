"use strict";

const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RadioTracks", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false,
      },
      episode: {
        type: Sequelize.INTEGER,
      },
      radio_info: {
        type: DataTypes.UUID,
        references: {
          model: "RadioInfo",
          key: "id",
        },
        allowNull: false,
      },
      radio_oa: {
        type: Sequelize.DATEONLY,
      },
      image: {
        type: Sequelize.TEXT,
      },
      src: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable("RadioTracks");
  },
};
