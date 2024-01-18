"use strict";
const { faker } = require("@faker-js/faker");
const { Users } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user = await Users.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const filtered = user.map((item) => item.id);
    let data = [];
    for (let index = 0; index < 100; index++) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      const randomized = {
        id: faker.string.uuid(),
        ipAddress: faker.internet.ip(),
        users_id: filtered[randomIndex],
        userAgent: faker.internet.userAgent(),
        loginTime: faker.date.recent({ days: 7 }),
      };
      data.push(randomized);
    }
    await queryInterface.bulkInsert("LoginLogs", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("LoginLogs", null, {});
  },
};
