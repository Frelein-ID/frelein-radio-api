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
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const userData = Array.from({ length: 100 }, () => ({
      id: faker.string.uuid(),
      ipAddress: faker.internet.ip(),
      users_id: filtered[randomIndex],
      userAgent: faker.internet.userAgent(),
      loginTime: faker.date.anytime(),
    }));
    await queryInterface.bulkInsert("LoginLogs", userData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("LoginLogs", null, {});
  },
};
