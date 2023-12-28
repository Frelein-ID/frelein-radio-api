require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var radioInfoRouter = require("./routes/radio-info");
var radioTracksRouter = require("./routes/radio-tracks");
var personalityInfoRouter = require("./routes/personality-info");
var personalitiesRouter = require("./routes/personalities");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// Radio routes
app.use("/radio-info", radioInfoRouter);
app.use("/radio-tracks", radioTracksRouter);
// Personality routes
app.use("/personality-info", personalityInfoRouter);
app.use("/personalities", personalitiesRouter);

module.exports = app;
