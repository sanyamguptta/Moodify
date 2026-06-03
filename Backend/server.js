// for reading variables of .env file
require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/db');

// calling function for connecting to the DB
connectToDB();

app.listen(3000, () => {
   console.log("Server is listening at port 3000");
});