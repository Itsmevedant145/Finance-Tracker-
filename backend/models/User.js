const mongoose = require('mongoose'); // ✅ Fixed typo 'moongose' to 'mongoose'
const bcrypt = require('bcryptjs'); // ✅ Fixed typo 'bycrypt' to 'bcrypt'

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
    default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
  }
}, { timestamps: true }); // ✅ Moved timestamps inside schema options

// Hash the password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error); // ✅ Handle errors gracefully
  }
});

// Method to compare entered password with stored hash
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
