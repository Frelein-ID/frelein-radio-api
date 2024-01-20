/**
 * @module
 * @name admin
 *  */

// Import required modules
const Validator = require("fastest-validator");
const model = require("../models");
const RadioTracks = model.RadioTracks;
const RadioInfo = model.RadioInfo;
const PersonalityInfo = model.PersonalityInfo;
const Users = model.Users;
const LoginLogs = model.LoginLogs;
const v = new Validator();
const { RESPONSE_500, RESPONSE_200 } = require("../constants/constants");

/**
 * @function
 * @memberof module:admin
 * @name statistics
 * @summary A function to get statistics about the systems.
 * @param {String} token - User's token
 * @returns {JSON} An object contains statistics about the systems.
 * */
exports.statistics = async (req, res) => {
  try {
    // Basic statistics
    let total_tracks = 0;
    let total_radio = 0;
    let total_personality = 0;
    let total_users = 0;
    const track = await RadioTracks.findAll();
    const radio = await RadioInfo.findAll();
    const personality = await PersonalityInfo.findAll();
    const users = await Users.findAll();
    const loginLogs = await LoginLogs.findAll();
    total_tracks = track.length;
    total_radio = radio.length;
    total_personality = personality.length;
    total_users = users.length;
    // Chart statistics
    const sortByLoginTime = (a, b) => a.loginTime - b.loginTime;

    // Fungsi untuk menghitung jumlah login per tanggal
    const countLoginsLast7Days = (history) => {
      const loginCountsPerDate = {};
      const now = new Date();

      // Filter data untuk 7 hari terakhir
      const last7DaysData = history.filter(
        (entry) =>
          entry.loginTime >= new Date(now - 7 * 24 * 60 * 60 * 1000) &&
          entry.loginTime <= now
      );

      // Urutkan data berdasarkan timestamp
      last7DaysData.sort(sortByLoginTime);

      last7DaysData.forEach((entry) => {
        // Ambil informasi tanggal dari timestamp
        const date = entry.loginTime.toISOString().split("T")[0];

        // Inisialisasi jumlah login per tanggal jika belum ada
        if (!loginCountsPerDate[date]) {
          loginCountsPerDate[date] = 0;
        }

        // Hitung jumlah login per tanggal
        loginCountsPerDate[date].totalLogins++;

        // Hitung jumlah login per user
        if (!loginCountsPerDate[date]) {
          loginCountsPerDate[date] = 1;
        } else {
          loginCountsPerDate[date]++;
        }
      });

      const loginCountsArray = Object.entries(loginCountsPerDate).map(
        ([date, value]) => ({
          date: date,
          value: value,
        })
      );

      return loginCountsArray;
    };
    // Fungsi untuk menghitung jumlah user register per hari
    const countRegisterLast7Days = (history) => {
      const loginCountsPerDate = {};
      const now = new Date();

      // Filter data untuk 7 hari terakhir
      const last7DaysData = history.filter(
        (entry) =>
          entry.createdAt >= new Date(now - 7 * 24 * 60 * 60 * 1000) &&
          entry.createdAt <= now
      );

      // Urutkan data berdasarkan timestamp
      last7DaysData.sort(sortByLoginTime);

      last7DaysData.forEach((entry) => {
        // Ambil informasi tanggal dari timestamp
        const date = entry.createdAt.toISOString().split("T")[0];

        // Inisialisasi jumlah login per tanggal jika belum ada
        if (!loginCountsPerDate[date]) {
          loginCountsPerDate[date] = 0;
        }

        // Hitung jumlah login per tanggal
        loginCountsPerDate[date].totalLogins++;

        // Hitung jumlah login per user
        if (!loginCountsPerDate[date]) {
          loginCountsPerDate[date] = 1;
        } else {
          loginCountsPerDate[date]++;
        }
      });

      const loginCountsArray = Object.entries(loginCountsPerDate).map(
        ([date, value]) => ({
          date: date,
          value: value,
        })
      );

      return loginCountsArray;
    };
    const users_login_last_week = countLoginsLast7Days(loginLogs);
    const users_register_lask_week = countRegisterLast7Days(users);
    return res.status(200).json({
      status: 200,
      statusText: RESPONSE_200,
      total_tracks,
      total_radio,
      total_personality,
      total_users,
      users_login_last_week,
      users_register_lask_week,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      status: 500,
      statusText: RESPONSE_500,
      message: error,
    });
  }
};
