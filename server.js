const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const { PORT, DB_HOST } = process.env;

mongoose.set("strictQuery", true);

const start = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};

start();