require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var cors = require("cors");

var indexRoutes = require("./routes/index");
var authRoutes = require("./routes/auth");
var radioInfoRoutes = require("./routes/radio-info");
var radioTracksRoutes = require("./routes/radio-tracks");
var personalityInfoRoutes = require("./routes/personality-info");
var personalitiesRoutes = require("./routes/personalities");
var userFavRadioTracksRoutes = require("./routes/users-fav-radio-tracks");
var userFavRadioInfoRoutes = require("./routes/users-fav-radio-info");
var userFavPersonalityRoutes = require("./routes/users-fav-personality");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(cors());

app.use("/", indexRoutes);
// Auth
app.use("/auth", authRoutes);
// Radio routes
app.use("/radio-info", radioInfoRoutes);
app.use("/radio-tracks", radioTracksRoutes);
// Personality routes
app.use("/personality-info", personalityInfoRoutes);
app.use("/personalities", personalitiesRoutes);
// Favorites routes
app.use("/favorites/radio-tracks", userFavRadioTracksRoutes);
app.use("/favorites/radio-info", userFavRadioInfoRoutes);
app.use("/favorites/personality", userFavPersonalityRoutes);

module.exports = app;
