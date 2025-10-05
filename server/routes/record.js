const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Get all tasks for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Add new task
router.post("/", async (req, res) => {
  const { text, userId } = req.body;
  try {
    const task = new Task({ text, userId });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error adding task" });
  }
});

// Mark task as completed
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete task
router.delete("/:id/:userId", async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.params.userId });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
