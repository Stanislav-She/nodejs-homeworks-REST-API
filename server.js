const mongoose = require("mongoose");
const app = require("./app");

const { MONGODB_HOST, PORT } = process.env;

mongoose
  .connect(MONGODB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
