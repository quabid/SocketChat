const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
  },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.index({ email: 1, userName: 1 }, { unique: true });

UserSchema.methods.withoutPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create collection and add schema
const User = mongoose.model("user", UserSchema, "user");
module.exports = User;
