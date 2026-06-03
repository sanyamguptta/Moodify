const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  // checking if user already existing then sending response
  if (isAlreadyExists) {
    return res.status(400).json({
      message: "User with the same email or password already exits",
    });
  }

  // hashing password
  const hash = await bcrypt.hash(password, 10);

  //
  const user = await userModel.create({
    user,
    email,
    password: hash, // password should be hashed
  });

  // creating token
  const token = jwt.sign(
    {
      // 1 para -> usnique user data (id and username)
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

  // sending response after creating user
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
  const { username, email, password } = req.body;

  // checking if user already exits or not in DB
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  //
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
      user: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

    res.token("token", token);

    return res.status(400).json({
        messsage: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

module.exports = {
  registerUser,
  loginUser
};
