require('dotenv').config(); // to load environment variables from .env file

const app = require('./src/app');
const connectDB = require('./src/config/database');

// calling the function to connect to the database
connectDB();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})