"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // const usersData = Array.from({ length: 100 }, () => ({
    //   name: faker.person.fullName(),
    //   name_jp: faker.person.fullName(),
    //   image: faker.image.avatar(),
    //   description: faker.lorem.lines(2),
    //   website: faker.lorem.lines(),
    //   social: faker.lorem.lines(),
    //   schedule: faker.lorem.lines(),
    //   start_time: faker.date.anytime(),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }));
    // await queryInterface.bulkInsert("user", usersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("radio-info", null, {});
  },
};
