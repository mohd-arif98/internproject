const express = require("express");
const Routes = require("./routes");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
var bodyParser = require("body-parser");
mongoose.connect(
  "mongodb+srv://tanuj1998:tanuj1998@cluster0-uibgm.mongodb.net/test?retryWrites=true&w=majority"
);
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "*");
  }
  next();
});

app.use(Routes);

module.exports = app;
