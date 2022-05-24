const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

//REGISTER
router.post("/register", async (req, res) => {
  console.log(req.body)
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashedPassword)

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(newUser)

    //save user and respond
    const user = await newUser.save();
    console.log(user)

    const accessToken = jwt.sign(
      {
          id: user._id,
          isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
          {expiresIn:"3d"}
      );
      console.log(accessToken)
    res.status(200).json({ auth: true, token: accessToken });
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;