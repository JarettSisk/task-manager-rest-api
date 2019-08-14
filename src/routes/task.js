"use strict"
const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

// Create new task
router.post("/tasks", auth,  async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }

})

// Read all of the users tasks tasks
router.get("/tasks", auth, async (req, res) => {
  const _id = req.params.id;

  const filter = {
    owner: req.user._id,
  };
  
  const sort = {};

  const options = {
    limit: parseInt(req.query.limit),
    skip: parseInt(req.query.skip),
    sort: sort
  }


  if (req.query.completed) {
    filter.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    // Set createdAt = -1 or 1 based on the query value given either asc or desc
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  
  try {
    //Find all tasks that have the owner id matching with the current users id
    const tasks = await Task.find(filter, null, options)
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }

})

//Read a single task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send();

    }

    res.send(task);

  } catch (error) {
    res.status(500).send(error);

  }

})

// Update a task
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  

  try {
    const task = await Task.findOne({ _id: _id, owner: req.user._id});

    // Check if task exists
    if (!task) {
      return res.status(404).send()
    }

    // Change the value if the key exists in the doc
    let flag = false;
    for (let key in task._doc) {
      console.log(key);
      if(req.body[key] !== undefined) {
        console.log(req.body[key]);
        task[key] = req.body[key];
        flag = true;
      } 
      
    }
    if (flag === false) {
      return res.status(400).send("Warning: Invalid update information")
    }

    // Save the task
    await task.save();

    res.send(task);

  } catch (error) {
    res.status(400).send(error);
  }
})

// Delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete({ _id: _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send()
    }

    res.send(task);

  } catch (error) {
    res.status(500).send(error.message);

  }
})

module.exports = router;