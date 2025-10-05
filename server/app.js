const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const User = require("./models/User");

const app = express();

// connect DB
mongoose.connect("mongodb://127.0.0.1:27017/passportDemo");

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const user = new User({ username: req.body.username });
    await User.register(user, req.body.password);
    passport.authenticate("local")(req, res, () => {
      res.redirect("/secret");
    });
  } catch (err) {
    console.error(err);
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}));

app.get("/secret", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secret");
  } else {
    res.redirect("/login");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
