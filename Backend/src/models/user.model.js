const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"],
    },
    email: {
        type: String, 
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: true,
        select: false
    }
})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;


// // TASK:
// // userSchema.pre("save", ...) is a pre middleware (hook) that runs before a document is saved to MongoDB.
// userSchema.pre("save", function(next) {})
// // post() → runs after an operation.
// userSchema.post("save", function(next) {})