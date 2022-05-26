const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt")

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    //new_user_saved
    const savedUser = await newUser.save();
    //access_token
    const accessToken = await jwt.sign(
      {
          id: savedUser._id,
          isAdmin: savedUser.isAdmin,
      },
      process.env.JWT_SEC,
          {expiresIn:"3d"}
      );

    res.status(201).json({auth:true,token:accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});


//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    // const validPassword = await bcrypt.compare(req.body.password, user.password)
    // !validPassword && res.status(400).json("wrong password")

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
  );
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  const inputPassword = req.body.password;
  
  originalPassword != inputPassword && 
      res.status(401).json("Wrong Password");

      const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
    res.status(200).json({ auth: true, token: accessToken })
      // const { password, ...others } = user._doc;  
      // res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err)
  }
});
// router.post('/login', async (req, res) => {
//   try{
//       const user = await User.findOne(
//           {
//               userName: req.body.user_name
//           }
//       );

//       !user && res.status(401).json("Wrong User Name");

//       const hashedPassword = CryptoJS.AES.decrypt(
//           user.password,
//           process.env.PASS_SEC
//       );


//       const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

//       const inputPassword = req.body.password;
      
//       originalPassword != inputPassword && 
//           res.status(401).json("Wrong Password");

//       const accessToken = jwt.sign(
//       {
//           id: user._id,
//           isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SEC,
//           {expiresIn:"3d"}
//       );

//       const { password, ...others } = user._doc;  
//       res.status(200).json({...others, accessToken});

//   }catch(err){
//       res.status(500).json(err);
//   }

// });

module.exports = router;