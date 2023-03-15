const { Schema, model } = require("mongoose");

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionStatus = ["starter", "pro", "business"];

const userSchema = new Schema({
  password: {
    type: String,
    minlength: 6,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    match: emailRegex,
    required: [true, "Email is required"],
    unique: true,
    index: true,
  },
  subscription: {
    type: String,
    enum: subscriptionStatus,
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

const User = model('user', userSchema);

module.exports = {
  User,   
};