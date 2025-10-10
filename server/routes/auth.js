const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("Error generating salt:", err);
      return res.status(500).send("Error generating salt");
    }

    console.log("Salt generated successfully");

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Error hashing password");
      }

      console.log("Hashed password:", hash);

      const newUser = new User({
        username,
        password: hash,
      });

      newUser
        .save()
        .then(() => {
          console.log("User registered successfully");
          res.redirect("/login");
        })
        .catch((err) => {
          console.error("Error saving user:", err);
          res.status(500).send("Error saving user");
        });
    });
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    console.log("User not found");
    return res.status(404).send("User not found");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error("Error comparing passwords:", err);
      return res.status(500).send("Error comparing passwords");
    }

    if (result) {
      console.log("Passwords match! User authenticated.");
      res.redirect("/");
    } else {
      console.log("Passwords do not match! Authentication failed.");
      res.status(401).send("Invalid password");
    }
  });
});

module.exports = router;
