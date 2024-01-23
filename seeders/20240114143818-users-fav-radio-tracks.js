"use strict";
const { faker } = require("@faker-js/faker");
const { RadioTracks, Users } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const radio = await RadioTracks.findAll({
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
    let data = [];
    for (let index = 0; index < 100; index++) {
      const randomRadio = Math.floor(Math.random() * filteredRadio.length);
      const randomUsers = Math.floor(Math.random() * filteredUsers.length);
      const randomized = {
        id: faker.string.uuid(),
        users_id: filteredUsers[randomUsers],
        tracks_id: filteredRadio[randomRadio],
        favoritedAt: new Date(),
      };
      data.push(randomized);
    }
    await queryInterface.bulkInsert("UsersFavRadioTracks", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsersFavRadioTracks", null, {});
  },
};
