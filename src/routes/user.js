"use strict"
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");


// Create a user
router.post("/users", async (req, res) => {
  
  const createUser = async () => {
    try {
     
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      console.log(req.body);
      res.cookie("auth", token).send(user);
      

    } catch (error) {
      const errorJSON = (JSON.stringify(error));
      return res.status(400).send(errorJSON);
  
    }
  }


  try {
    // if email is already in use 
    const existingUser = await User.findOne({ email: req.body.email})
    if (existingUser) {
      throw new Error("Email already in use");
    }
    // if a key exists but no user
    if (req.cookies.auth) {
      console.log(req.cookies.auth);
      // get the token
      const token = req.cookies.auth;
      // verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // check to see if the token matches the users token
      const user = await User.findOne({ _id: decoded._id, "tokens.token": token})

      //check to see if the token does exist on the matching user
      if (user) {
        // if it does, then throw new error;
        const error = new Error();
        error.message = "You must log out first";
        throw error;
        
      } 
    }

  // If no key
  // Create the the user
  await createUser();
  
  
} catch (error) {
  const errorJSON = (JSON.stringify(error));
  res.status(400).send(errorJSON);
}
  
 
})

// Login a user
router.post("/users/login", async (req, res) => {

  const login = async () => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.cookie("auth", token).send(user);
      return;
    } catch (error) {
      const errorJSON = (JSON.stringify(error));
      return res.status(400).send(errorJSON);
    }
    
  }
  try {
    // if a key exists but no user
  if (req.cookies.auth) {
    // get the token
    const token = req.cookies.auth;
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // check to see if the token matches the users token
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token})

    //check to see if the token does exist on the matching user
    if (user) {
      // if it does, then throw new error;
      const error = new Error();
      error.message = "You are already logged in";
      throw error;
      
    } else {
      // if it does not exist, then use the creds to log in..
      return await login();
      
    }

    //end
  }
    
  
  

  // if no key
  // use the creds to log in the user
  await login();

} catch (error) {
  const errorJSON = (JSON.stringify(error));
  res.status(400).send(errorJSON);
}
    
  })

    

// Logout a user on a single session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    })

    await req.user.save();

    res.clearCookie("auth").status(200).send({message: "Successfully logged out"});
  } catch (error) {
    const errorJSON = (JSON.stringify(error));
    res.status(400).send(errorJSON);
  }
})

// Logout a user on all sessions (all devices / browsers)
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.clearCookie("auth").status(200).send({message: "Successfully logged out"});
  } catch (error) {
    const errorJSON = (JSON.stringify(error));
    res.status(500).send(errorJSON);
  }
})

// Read profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);  
})

// Update a user
router.patch("/users/me", auth, async (req, res) => {

  try {
    
    const user = await User.findById(req.user._id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).send()
    }

    // Change the value if the key exists in the doc
    let flag = false;
    for (let key in user._doc) {
      
      if(req.body[key]) {
        user[key] = req.body[key];
        flag = true;
      }
      
    }
    if (flag === false) {
      return res.status(400).send("Warning: Invalid update information")
    }

    
    // Save the updates
    await user.save();

    res.send(user);

  } catch (error) {
    const errorJSON = (JSON.stringify(error));
    res.status(400).send(errorJSON);
  }
})

// Delete a user
router.delete("/users/me", auth, async (req, res) => {

  try {
   await req.user.remove();
   res.clearCookie("auth").send(req.user); 
  } catch (error) {
    const errorJSON = (JSON.stringify(error));
    res.status(400).send(errorJSON);
  }
})

module.exports = router;