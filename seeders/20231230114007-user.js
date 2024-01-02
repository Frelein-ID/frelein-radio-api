"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userData = Array.from({ length: 100 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      role: "user",
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("Users", userData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
