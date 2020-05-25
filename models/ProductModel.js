const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: new mongoose.Schema.Types.ObjectId(),
  productName: String,
  price: Number,
  image_url:  String
});

module.exports = mongoose.model("Product", productSchema);
