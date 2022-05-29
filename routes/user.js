const User = require("../models/User");
const CryptoJS = require("crypto-js");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    console.log(req)
    // res.json({hello: req.params?.id})
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log(updatedUser)
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get("/:id", verifyTokenAndAuthorization, async (req,res) => {
//     // console.log(req.params.id)
//     res.json(req?.params)
// })


module.exports = router;
