const express = require('express');
const cookieParser = require('cookie-parser');
// 
const authRouter = require("./routes/auth.route");

const app = express();

// middldeware for reading data of rq.body
app.use(express.json());
//
app.use(cookieParser());


// using route 
app.use('/api/auth' ,authRouter)

module.exports = app;