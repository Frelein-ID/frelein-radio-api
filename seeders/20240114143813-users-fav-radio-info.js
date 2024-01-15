"use strict";
const { faker } = require("@faker-js/faker");
const { RadioInfo, Users } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const radio = await RadioInfo.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const users = await Users.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const filteredRadio = radio.map((item) => item.id);
    const filteredUsers = users.map((item) => item.id);
    const randomRadio = Math.floor(Math.random() * filteredRadio.length);
    const randomUsers = Math.floor(Math.random() * filteredUsers.length);
    const data = Array.from({ length: 100 }, () => ({
      id: faker.string.uuid(),
      users_id: filteredUsers[randomUsers],
      radio_info_id: filteredRadio[randomRadio],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("UsersFavRadioInfo", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsersFavRadioInfo", null, {});
  },
};
