const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser);

// requiring router 
const authRutes = require("./routes/auth.routes");
// using a default suffix before the actual route url
app.use('/api/auth', authRutes);


module.exports = app;