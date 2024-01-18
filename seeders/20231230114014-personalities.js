"use strict";
const { faker } = require("@faker-js/faker");
const { PersonalityInfo, RadioTracks } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const personality = await PersonalityInfo.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const tracks = await RadioTracks.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const filteredPersonality = personality.map((item) => item.id);
    const filteredTracks = tracks.map((item) => item.id);
    let data = [];
    for (let index = 0; index < 100; index++) {
      const randomPersonality = Math.floor(
        Math.random() * filteredPersonality.length
      );
      const randomTracks = Math.floor(Math.random() * filteredTracks.length);
      const randomized = {
        id: faker.string.uuid(),
        tracks_id: filteredTracks[randomTracks],
        personality_id: filteredPersonality[randomPersonality],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      data.push(randomized);
    }
    await queryInterface.bulkInsert("Personalities", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Personalities", null, {});
  },
};
