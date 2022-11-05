const express = require("express");

const cors = require("cors");

// add DB_HOST to process.env
require("dotenv").config();

// import routes
const usersRouter = require("./routes/api/users");

// 1-- create web-server
const app = express();

// 2-- Describe global middlewars
app.use(cors());
// Ця мідлвара перевіряє, якщо contentType = aplication.json і є тіло запиту,
// то вона виконує для body json.parse() і зберігає в req.body об'єкт, який прийшов.
// Якщо в req.body приходить undefined, то це тому, що не вказали цю мідлвару
app.use(express.json());

// 3-- Create routes group
app.use("/api/users", usersRouter);

// 4-- Create errors handles
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
