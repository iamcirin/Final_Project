const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create the user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and return response

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  if (req.body.email) {
    try {
      const cuser = await User.findOne({ email: req.body.email });
      if (!cuser) {
        return res.status(404).send("user not found");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        cuser.password
      );
      if (!validPassword) {
        res.status(400).send("wrong password");
      }

      //generate token
      if (cuser) {
        const token = jwt.sign(
          {
            id: cuser._id,
            email: cuser.email,
            password: req.body.password,
            isAdmin: cuser.isAdmin,
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        const { password, ...user } = cuser._doc;
        res.status(200).json({ token, user });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.headers.authorization) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        // const token = authHeader.split(" ")[1];
        const verified = jwt.verify(
          authHeader,
          process.env.ACCESS_TOKEN_SECRET
        );
        const user = await User.findOne({ email: verified.email });
        console.log(user);
        res.status(200).json({ user, authHeader });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

module.exports = router;
