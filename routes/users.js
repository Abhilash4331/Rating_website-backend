var express = require('express');
var router = express.Router();
var User = require('../models/user');

let { encryptPassword, comparePasswords, generateJwt } =
  require('../utils/loginutils');
const user = require('../models/user');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// User Register API starts here 

router.post('/register', async (req, res) => {
  try {

    const UserEmailCheck =
      await User.findOne(
        { email: new RegExp(`^${req.body.email}$`, 'i') }).exec();

    // console.log(UserEmailChk);
    if (UserEmailCheck)
      throw new Error('Email already registered');

    req.body.password = await encryptPassword(req.body.password);

    let User = await new User(req.body).save();
    res.status(200).json({ message: "User Register Successfully", data: User, success: true });

    //   await nodemail('contact@jiorooms.com', req.body.email, 'Registration Successfull', "You have been successfully registered")
    //   res.json({ message: 'User Registered', success: true });

  }
  catch (err) {
    console.error(err);
    if (err.message)
      res.json({ message: err.message, data: err, success: false });
    else
      res.json({ message: 'Error', data: err, success: false });
  }
})

//   User Register API Close


// User Login API Starts Here

router.post('/login', async (req, res) => {
  try {

    const User =
      await User.findOne
        ({
          email: new
            RegExp(`^${req.body.email}$`, 'i')
        }).exec();

  
    if (!user)
      throw new Error("You are not registered");

    const checkPassword = await
      comparePasswords(req.body.password, User.password);

    if (!checkPassword)
      throw new Error("Check Your Credentials");

    const token = await generateJwt(User._id);
    res.json({ message: 'Logged In', data: token, success: true });

  }
  catch (err) {
    console.error(err);
    if (err.message)
      res.json({ message: err.message, data: err, success: false });
    else
      res.json({ message: 'Error', data: err, success: false });
  }
})


// User Login Api Ends



module.exports = router;






