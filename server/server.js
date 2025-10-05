const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/record");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todolist")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", recordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
