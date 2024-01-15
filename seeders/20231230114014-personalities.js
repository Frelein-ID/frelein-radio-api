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
    const randomPersonality = Math.floor(
      Math.random() * filteredPersonality.length
    );
    const randomTracks = Math.floor(Math.random() * filteredTracks.length);
    const data = Array.from({ length: 100 }, () => ({
      id: faker.string.uuid(),
      tracks_id: filteredTracks[randomTracks],
      personality_id: filteredPersonality[randomPersonality],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("Personalities", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Personalities", null, {});
  },
};
