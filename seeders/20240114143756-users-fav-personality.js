"use strict";
const { faker } = require("@faker-js/faker");
const { PersonalityInfo, Users } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const personality = await PersonalityInfo.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const users = await Users.findAll({
      attributes: ["id"],
      limit: 50,
      order: Sequelize.literal("rand()"),
    });
    const filteredPersonality = personality.map((item) => item.id);
    const filteredUsers = users.map((item) => item.id);
    let data = [];
    for (let index = 0; index < 100; index++) {
      const randomPersonality = Math.floor(
        Math.random() * filteredPersonality.length
      );
      const randomUsers = Math.floor(Math.random() * filteredUsers.length);
      const randomized = {
        users_id: filteredUsers[randomUsers],
        personality_id: filteredPersonality[randomPersonality],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      data.push(randomized);
    }
    await queryInterface.bulkInsert("UsersFavPersonality", data, []);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsersFavPersonality", null, {});
  },
};
