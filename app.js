require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var radioInfoRouter = require("./routes/radio-info");
var radioTracksRouter = require("./routes/radio-tracks");
var presenterInfoRouter = require("./routes/presenter-info");

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
// Presenter routes
app.use("/presenter-info", presenterInfoRouter);

module.exports = app;
