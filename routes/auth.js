const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/secure-route", authenticateToken, (req, res) => {
  // Hanya dapat diakses dengan token yang valid
  res.json({ data: "Data aman", user: req.user });
});

module.exports = router;
