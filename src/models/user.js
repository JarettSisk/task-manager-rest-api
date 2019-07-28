"use strict"
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");
//User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    // Custom validation method
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    // Custom validation method
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain the word 'password'")
      }
    }

  },
  tokens: [{
    token: {
      type: String,
      require: true
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
})

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

// Custom userSchema method that generates the authorization token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({token: token});

  await user.save();
  return token;
}

// Custom userSchema static method that validates the users email and password
// Statics are pretty much the same as methods but allow for defining 
// functions that exist directly on your Model (IE User.findByCredentials)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email});

  if (!user) {
    throw new Error("Unable to login")
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
}


// Hash plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  console.log("__performing pre save actions")
  
  if (user.isModified("password")) {
    console.log("__hashing password")
    user.password = await bcrypt.hash(user.password, 8);
    
  }
  console.log("__pre save actions done")
  next()
})

// Delete user tasks when a user is deleted from the DB
userSchema.pre("remove", async function (next) {
  const user = this;
  // If the task owner _id matches the current logged in user _id, then it deletes it.
  await Task.deleteMany({ owner: user._id});
});
// Define User Model (Class)
const User = mongoose.model("User", userSchema)

module.exports = User;


