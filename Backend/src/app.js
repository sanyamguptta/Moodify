const express = require('express');
const cookieParser = require('cookie-parser');
// 
const authRouter = require("./routes/auth.route");
// requiring cors
const cors = require('cors');

const app = express();

// middldeware for reading data of rq.body
app.use(express.json());
//
app.use(cookieParser());
//
app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true
}))


// using route 
app.use('/api/auth' ,authRouter)

module.exports = app;