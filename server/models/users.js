const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  display_name: String,
  password: {
    type: String,
    unique: true
  },
  picture: {
    type: String,
    default: "file-1729787623224.jpg"
  },
  googleId: String,
});

module.exports = mongoose.model("User", UserSchema);