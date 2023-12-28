"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("personalities", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tracks_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "radio-tracks",
          key: "id",
        },
        allowNull: false,
      },
      personality_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "personality-info",
          key: "id",
        },
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
    await queryInterface.dropTable("personalities");
  },
};
