"use strict"
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Returns the token from the header (if one is provided)
    const token = req.header("Authorization").replace("Bearer ", "");
    // verifies the token
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    // find the user that has an _id that matches the _id  initially assigned during token creation
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token})
    
    if (!user) {
      throw new Error
    }

    

   
    // Add the token string as a property onto request
    req.token = token; 

    // Add the user object as a property onto request.
    req.user = user;
    next()
    
  } catch (error) {
    res.status(401).send({ error: "Authentication failure"})
  }
}

module.exports = auth;