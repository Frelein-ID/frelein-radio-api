"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("presenter-info", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_kanji: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING,
      },
      birthdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      birthplace: {
        type: Sequelize.STRING,
      },
      bloodtype: {
        type: Sequelize.ENUM("A", "B", "AB", "O"),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      trivia: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.STRING,
      },
      source: {
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
    await queryInterface.dropTable("presenter-info");
  },
};
