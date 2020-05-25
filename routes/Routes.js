const express = require("express");
var UsersController = require("../controller/UsersController");
var ProductController = require("../controller/ProductController");
const Routes = express.Router();

Routes.use("/users", UsersController);
Routes.use("/product", ProductController);

Routes.use((req, res) => {
  res.status(400).json({
    message: "Not Found"
  });
});

Routes.use((req, res) => {
  res.status(res.status || 500);
});

module.exports = Routes;
