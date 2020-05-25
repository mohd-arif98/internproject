var Product = require("../models/ProductModel");
var express = require("express");
const router = express.Router();
var aws = require("aws-sdk");
var multer = require("multer");
var multers3 = require("multer-s3");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

var upload = multer({
  storage: multers3({
    s3: s3,
    bucket: "nodejsexpressmongo",
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    },
    location: (req, file, cb) => {
      cb(null, console.log(location));
    },
    ContentType: "image/png",
    ACL: "public"
  })
});

router.put("/upload/:id", upload.single("file"), async (req, res, next) => {
  console.log(req.params.id);
  const response = await User.findByIdAndUpdate(req.params.id, {
    image: req.file.location
  });
  res.send(response);
});

router.post("/", (req, res) => {
  try {
    var product = new Product({
      productName: req.body.productName,
      price: req.body.price,
      image_url: req.body.image_url
    });
    Product.find({ productName: req.body.productName }).then(async obj => {
      if (obj.length === 0) {
        await product.save();
      }
    });
  } catch (e) {
    res.status(500).json({
      message: "Error"
    });
  } finally {
    res.status(200).json({
      product,
      message: "product created"
    });
  }
});

router.get("/", async (req, res) => {
  const id = req.params.id;
  await Product.find().then(doc => {
    console.log(doc);
    res.status(200).send(doc);
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  await Product.findById(id).then(doc => {
    console.log(doc);
    res.status(200).send(doc);
  });
});

// router.put("/:id", async (req, res) => {
//   const id = req.params.id;
//   await Product.findByIdAndUpdate(id, { username: req.body.username }).then(
//     doc => {
//       console.log(doc);
//       res.status(200).send(doc);
//     }
//   );
// });

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await Product.findOneAndDelete({ _id: id }).then(() => {
      res.status(200).send({
        message: "product deleted"
      });
    });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
