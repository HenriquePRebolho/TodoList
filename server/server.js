const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./db/connection");
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", todoRoutes);
app.use("/auth", authRoutes);

app.get("/", async (req, res) => {
  const Todo = require("./models/todo");
  const todos = await Todo.find();
  res.render("index", { todos });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.get("/login", (req, res) => {
  res.render("login");
});
