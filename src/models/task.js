"use strict"
const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,

  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  // Stores the user ID of the user who was currently logged in onto the task itself
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, /* Options */ {
  timestamps: true
})

// Define a Task model
const Task = new mongoose.model("Task", taskSchema)

module.exports = Task;