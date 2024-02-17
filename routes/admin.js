var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');

let { encryptPassword, comparePasswords, generateJwt } =
  require('../utils/loginutils');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// User Register API starts here 

router.post('/register', async (req, res) => {
  try {

    const AdminEmailCheck =
      await Admin.findOne(
        { email: new RegExp(`^${req.body.email}$`, 'i') }).exec();

    // console.log(adminEmailChk);
    if (AdminEmailCheck)
      throw new Error('Email already registered');

    req.body.password = await encryptPassword(req.body.password);

    let admin = await new Admin(req.body).save();
    res.status(200).json({ message: "Admin Register Successfully", data: admin, success: true });

    //   await nodemail('contact@jiorooms.com', req.body.email, 'Registration Successfull', "You have been successfully registered")
    //   res.json({ message: 'Admin Registered', success: true });

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

    const admin =
      await Admin.findOne
        ({
          email: new
            RegExp(`^${req.body.email}$`, 'i')
        }).exec();

  
    if (!admin)
      throw new Error("You are not registered");

    const checkPassword = await
      comparePasswords(req.body.password, admin.password);

    if (!checkPassword)
      throw new Error("Check Your Credentials");

    const token = await generateJwt(Admin._id);
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


//Location Add Api

router.post('/addLocation', async(req,res) => {
  try {
    let location = await new Location(req.body).save();
    res.json({message:"location added successfully",
    data: location,success: true})
  }
  catch(err){
    res.json({message:err.message,sucess:false})
  }
});

module.exports = router;





