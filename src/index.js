"use strict"
const express = require("express");
require("./db/mongoose");
const cors = require("cors")
const cookieParser = require("cookie-parser");


const app = express();
const port = process.env.PORT;
app.use(cors({
  origin: "http://127.0.0.1:8080",
  credentials: true
}));

// Parse the incoming JSON
app.use(express.json())


app.use(cookieParser());

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




