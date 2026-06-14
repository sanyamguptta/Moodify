const blacklistModel = require('../models/blacklist.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const redis = require('../config/cache');

async function authUser(req, res, next) {
  // fetch token from the cookies
  const token = req.cookies.token;

  // check if token created by our server only and is it expired or not
  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  // check if token is redis or not
  const isTokenBlacklisted = await redis.get("token");
  // check if token is blacklisted or not
  // const isTokenBlacklisted = await blacklistModel.findOne({
  //     // token to be find
  //     token,
  // })

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  // verify token
  try {
    // decoded contains data with which the token is created
    const decoded = jwt.verify(
      // 1 para -> token to be verify
      token,
      // 2 para -> jwt secret with which token is created
      process.env.JWT_SECRET,
    );

    // creating new property in req.
    req.user = decoded;

    // forwarding request after verifying the token
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}


module.exports = {
    authUser,
}