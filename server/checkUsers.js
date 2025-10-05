const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config({ path: "./config.env" });

async function checkUsers() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todolist");
    console.log("✅ Connected to MongoDB");

    // 모든 유저 불러오기
    const users = await User.find();
    console.log("📜 Current users in database:");
    console.log(users);

    process.exit();
  } catch (err) {
    console.error("❌ Error reading users:", err);
    process.exit(1);
  }
}

checkUsers();
