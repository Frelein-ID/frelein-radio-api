"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const RadioTracksData = Array.from({ length: 100 }, () => ({
      episode: faker.number.int({ min: 1, max: 100 }),
      radio_info: 1,
      radio_oa: faker.date.birthdate(),
      image: faker.image.avatar(),
      src: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("radio-tracks", RadioTracksData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("radio-tracks", null, {});
  },
};
