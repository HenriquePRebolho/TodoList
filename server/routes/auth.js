const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash(password, 10);

    // 여기가 중요 — passwordHash 필드에 직접 넣기
    const newUser = new User({
      username: username,
      passwordHash: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Error in /register:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("📩 Login request body:", req.body);
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log("🔍 Found user:", user); // 확인용 로그

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.passwordHash) {
      console.error("❌ passwordHash is missing in DB for this user");
      return res.status(500).json({ message: "User data corrupted (no password hash)" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
