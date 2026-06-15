const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
// for acceptinf cross origin request
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// requiring router 
const authRoutes = require('./routes/auth.routes');
// using a default suffix before the actual route url
app.use('/api/auth', authRoutes);


module.exports = app;