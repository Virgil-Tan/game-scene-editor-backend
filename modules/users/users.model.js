const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  email: String,
  avatar: String
});

const UsersModel = mongoose.model("User", UserSchema);

module.exports = {
  UsersModel
};

