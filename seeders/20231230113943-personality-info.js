"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = Array.from({ length: 100 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      name_jp: faker.person.firstName(),
      nickname: faker.person.lastName(),
      birthdate: faker.date.anytime(),
      birthplace: faker.location.state(),
      bloodtype: faker.helpers.arrayElement(["A", "B", "AB", "O"]),
      description: faker.lorem.lines({ min: 1, max: 5 }),
      image: faker.internet.avatar(),
      source: faker.internet.url(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("PersonalityInfo", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PersonalityInfo", null, {});
  },
};
