const express = require("express");
const router = express.Router();

const { generateToken } = require("../utils/tokenUtils");

router.post("/profile", (req, res) => {
  // Proses validasi kredensial (dapat menggunakan Sequelize atau lainnya)
  const { username, password } = req.body;

  // Contoh sederhana: Jika kredensial benar, kirim token
  if (username === "user" && password === "pass") {
    const token = generateToken(username);
    res.json({ token });
  } else {
    res.status(401).send("Login gagal");
  }
});

module.exports = router;
