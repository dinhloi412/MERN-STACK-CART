const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = { User };
