const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// function to register a user
async function register(req, res) {
  // destructure the request body
  const { username, email, password } = req.body;

  // checking if user already exits with the email or username
  const isAlreadyRegistered = await userModel.findOne({
    $or: [
      {
        email: email,
      },
      {
        username: username,
      },
    ],
  });

  // if user already exits with the email or username then return error with status code 400
  if (isAlreadyRegistered) {
    return res.status(400).json({
      message: "User already exits with this email",
    });
  }

  // hash the password
  const hash = await bcrypt.hash(password, 10);

  // creating a new user if user not already exits
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  // to save the user in database
  const token = jwt.sign(
    {
      // payload to be signed in the token
      id: user._id,
      username: user.username,
    },
    // secret key to sign the token
    process.env.JWT_SECRET,
    {
      // token will expire in 3 days
      expiresIn: "3d",
    },
  );

  // setting the token in cookie
  res.cookie("token", token);

  // saving the user in database
  return res.status(201).json({
    message: "user registered successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email
    },
  });
}

async function login(req, res) {
  // destructure the request body
  const { username, email, password } = req.body;

  // checking if user already exits with the email
  const user = await userModel.findOne({
    $or: [
      {
        email: email,
      },
      {
        username: username,
      },
    ],
  });

  // if user not exits with the email then return error with status code 400
  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // comparing the password with the hashed password in database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // if password is not valid then return error with status code 400
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // if password is valid then create a token and set it in cookie
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '3d',
    },
  );

  // setting the token in cookie
  res.cookie('token', token);

  // returning the user and success message with status code 200
  res.status(200).json({
    message: "user logged in successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
    }
  })

}

async function logout (req, res) {

  // 
  const token = req.cookies.token;

  res.clearCookie ('token');
  // setting token in redis with expiry of 1 hour
  await redis.set(token, Date.now().toString(), 'EX', 60 * 60)

  res.status(200).json({
    message: 'logout successfully!'
  })

}




module.exports = {
  register,
  login,
  logout
};
