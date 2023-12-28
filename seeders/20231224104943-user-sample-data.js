"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // const usersData = Array.from({ length: 100 }, () => ({
    //   name: faker.person.fullName(),
    //   role: "user",
    //   username: faker.internet.userName(),
    //   email: faker.internet.email(),
    //   password: "$2b$10$X3ylOmNU6/J4c2RgUgR1Oe0vHV4bsEnBt0lT1DFREPV6NT7U5EVWS", // bcrypt hash of 'password'
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }));
    // await queryInterface.bulkInsert("user", usersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
  },
};
