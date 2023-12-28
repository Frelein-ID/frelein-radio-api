const { verifyToken } = require("../utils/tokenUtils");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).send("Access denied");

  verifyToken(token)
    .then((decoded) => {
      req.user = decoded;
      next();
    })
    .catch((err) => {
      res.status(403).send("Invalid token");
    });
};

module.exports = { authenticateToken };
