require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var cors = require("cors");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var radioInfoRouter = require("./routes/radio-info");
var radioTracksRouter = require("./routes/radio-tracks");
var personalityInfoRouter = require("./routes/personality-info");
var personalitiesRouter = require("./routes/personalities");
var userFavRadioTracks = require("./routes/users-fav-radio-tracks");
var userFavRadioInfo = require("./routes/users-fav-radio-info");
var userFavPersonality = require("./routes/users-fav-personality");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(cors());

app.use("/", indexRouter);
// Auth
app.use("/auth", authRouter);
// Radio routes
app.use("/radio-info", radioInfoRouter);
app.use("/radio-tracks", radioTracksRouter);
// Personality routes
app.use("/personality-info", personalityInfoRouter);
app.use("/personalities", personalitiesRouter);
// Favorites routes
app.use("/favorites/radio-tracks", userFavRadioTracks);
app.use("/favorites/radio-info", userFavRadioInfo);
app.use("/favorites/personality", userFavPersonality);

module.exports = app;
