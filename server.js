const mongoose = require("mongoose");

// import configured server
const app = require("./app");

const { DB_HOST, PORT = 3001 } = process.env;

// connect to DB
mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
