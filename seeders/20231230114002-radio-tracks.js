"use strict";
const { faker } = require("@faker-js/faker");
const { RadioInfo } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const radio = await RadioInfo.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const filtered = radio.map((item) => item.id);
    let data = [];
    for (let index = 0; index < 100; index++) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      const randomized = {
        id: faker.string.uuid(),
        episode: faker.number.int({ min: 1, max: 100 }),
        radio_info: filtered[randomIndex],
        radio_oa: faker.date.birthdate(),
        image: faker.image.avatar(),
        src: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      data.push(randomized);
    }
    await queryInterface.bulkInsert("RadioTracks", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RadioTracks", null, {});
  },
};
