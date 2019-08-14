"use strict"
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Returns the token from the header (if one is provided)
    const token = req.cookies.auth;
    if(!token) {
      const error = new Error();
      error.message = "Authentication failure";
      throw error;
    }
    // verifies the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // find the user that has an _id that matches the _id  initially assigned during token creation
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token})
    
    if (!user) {
      const error = new Error();
      error.message = "Authentication failure";
      throw error;
    }

    

   
    // Add the token string as a property onto request
    req.token = token; 

    // Add the user object as a property onto request.
    req.user = user;
    next()
    
  } catch (error) {
    res.status(401).send(error)
  }
}

module.exports = auth;