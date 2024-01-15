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
    const randomPersonality = Math.floor(
      Math.random() * filteredPersonality.length
    );
    const randomUsers = Math.floor(Math.random() * filteredUsers.length);
    const data = Array.from({ length: 100 }, () => ({
      id: faker.string.uuid(),
      users_id: filteredUsers[randomUsers],
      personality_id: filteredPersonality[randomPersonality],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert("UsersFavPersonality", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsersFavPersonality", null, {});
  },
};
