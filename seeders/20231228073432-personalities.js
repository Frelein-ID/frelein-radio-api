"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const PersonalitiesData = Array.from({ length: 100 }, () => ({
      tracks_id: faker.number.int({ min: 1, max: 100 }),
      personality_id: faker.number.int({ min: 1, max: 2 }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("personalities", PersonalitiesData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("personalities", null, {});
  },
};
