const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require('../config/cache')

async function registerUser(req, res) {
  // fetching user details from req.body
  const { username, email, password } = req.body;

  // if user already exists while registerin
  const isAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  // checking if user already existing then returning with appropriate status code and response
  if (isAlreadyExists) {
    return res.status(400).json({
      message: "User with the same email or username already exits",
    });
  }

  // hashing password
  const hash = await bcrypt.hash(password, 10);

  // saving data of the user in the DB
  const user = await userModel.create({
    username,
    email,
    password: hash, // password should be hashed
  });

  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  // creating token
  const token = jwt.sign(
    {
      // 1 para -> unique user data (id and username)
      id: user._id,
      username: user.username,
    },
    // 2 para -> JWT SECRET
    process.env.JWT_SECRET,
    // 3 para -> token expiry time
    {
      expiresIn: "3d",
    },
  );

  // setting token into cookeis
  res.cookie("token", token);

  // sending valid response after creating user
  return res.status(201).json({
    message: "User registered successfully!",
    user: {
      id: user._id,
      user: user.username,
      email: user.email,
    },
  });
}

async function loginUser(req, res) {
  //
  const { email, password } = req.body;

  // checking if user already exits or not in DB
  const user = await userModel
    .findOne({
      $or: [ { email }],
    })
    .select("+password");

  // if user not exits while login, retun while status code(400) and appropriate response
  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // comparing password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // if password is not valid then return with response
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // if password is valid, then create token
  const token = jwt.sign(
    {
      // 1 para -> unique user data (id and username)
      id: user._id,
      username: user.username,
    },
    // 2 para -> JWT SECRET
    process.env.JWT_SECRET,
    // 3 para -> token expiry time
    {
      expiresIn: "3d",
    },
  );

  // setting token in the cookies
  res.cookie("token", token);

  console.log("USER:", user);
  console.log("DB PASSWORD:", user?.password);
  console.log("IS HASH:", user?.password?.startsWith("$2"));

  // return with appropriate status code after setting token in the cookies
  return res.status(200).json({
    messsage: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  }); 
}

async function getMe(req, res) {

  // finding user by id from the DB
  const user = await userModel.findById(req.user.id);

  // returning with appropriate status code
  return res.status(200).json({
    message: "User fetched successfully!",
    user,
  }); 
}

async function logout(req, res) {

  const token = req.cookies.token;
  // clearing token from cookies for logout
  res.clearCookie("token");

  // saving token in blacklist model
  // await blacklistModel.create({
  //   token,
  // })
  // setting token in redis
  await redis.set('token', Date.now().toString(), "EX", 60 * 60);


  // sending appropriate response after adding token to the blacklist
  res.status(200).json({
    message: "logout successfully",
  })

}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logout
};
