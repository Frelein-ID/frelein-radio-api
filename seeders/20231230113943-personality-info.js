"use strict";

const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const { PersonalityInfo } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentFolderPath = path.resolve(__dirname);
    const seedData = [];
    fs.createReadStream(currentFolderPath + "/data/hinatazaka46-members.csv")
      .pipe(csvParser())
      .on("data", (data) => seedData.push(data))
      .on("end", () => {
        queryInterface.bulkInsert("PersonalityInfo", seedData, {});
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PersonalityInfo", null, {});
  },
};
