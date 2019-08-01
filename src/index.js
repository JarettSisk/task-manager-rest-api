"use strict"
const express = require("express");
require("./db/mongoose");
const cors = require("cors")
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;

// Parse the incoming JSON
app.use(express.json())
// parse incoming cookies
app.use(cookieParser())
app.use(cors());

// Route modules
const userRoute = require("./routes/user");
const taskRoute = require("./routes/task.js");



// Route handlers
app.use(userRoute);
app.use(taskRoute);

// Start server
app.listen(port, () => {
  console.log("Server is running on " + port)
})

const Task = require("./models/task");
const User = require("./models/user");




