var express = require("express");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = require("../models/UsersModel");
var authVerify = require('../middleware/authVerify');

const router = express.Router();

router.post("/signup", (req, res) => {
  try {
    
    User.find({ username: req.body.username }).then(obj => {
      if (obj.length === 0) {
          bcrypt.hash(req.body.password, 10,  async (error,hash)=>{
          if (error)
          {
            return res.status(500).json({error: error});
          }
          else
          {
            const user = new User({
              username: req.body.username,
              password: hash,
              name: req.body.name,
              isAdmin: req.body.isAdmin
            });

            await user.save();
          }
        })
      }
    });
  } catch (e) {
    res.status(500).json({
      message: "Error"
    });
  } finally {
    res.status(200).json({
      message: "user created"
    });
  }
});

router.post("/login", (req, res)=>{
  console.log(req.body.username);
  User.find({username: req.body.username}).exec().then(user=>{
    
      if(user.length === 0)
      {
        return res.status(401).json("Something went wrong");
      }
      else
      {
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
          if(err)
          {
            return res.status(401).json("Something went wrong");
          }
          else if(result)
          {
              const token = jwt.sign({
                username: user[0].username,
                id: user[0]._id
              }, process.env.JWT_KEY,
              {
                expiresIn: process.env.JWT_EXPIRY
              });

              res.status(200).json({
                message: "Auth Success",
                token: token
              });
          }
          else
          {
            return res.status(401).json("Something went wrong");
          }
        });
      }
    })
  .catch(error=>
    {res.status(500).json(error)
  });
})

router.get("/", async (req, res) => {
  const id = req.params.id;
  await User.find().then(doc => {
    console.log(doc);
    res.status(200).send(doc);
  });
});

router.get("/:id",authVerify, async (req, res) => {
  const id = req.params.id;
  if(id === req.userData.id)
  {
    await User.findById(id).then(doc => {
      console.log(doc);
      res.status(200).send(doc);
    });
  }
  else
  {
    res.status(500).json("Unauthorised user");
  }
});

router.put('/product', authVerify, async(req,res)=>{
  const userId = req.body.userId;
  const productId = req.body.productId;
  await User.findOne({_id:userId},async (err,doc)=>{
      const add = {productId:productId,productStatus:req.body.productStatus}
      if(err){
        res.status(500).json({
          message: "Error"
        });
      }
      doc.Products.push(add);
      doc.save(()=>{
        res.status(200).send(doc)
      });
      
  })
})

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  await User.findByIdAndUpdate(id, { username: req.body.username }).then(
    doc => {
      console.log(doc);
      res.status(200).send(doc);
    }
  );
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await User.findOneAndDelete({ _id: id }).then(() => {
      res.status(200).send({
        message: "user deleted"
      });
    });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
