const mongoose = require("mongoose");

const dbConnection = async () => {
  await mongoose
    .connect(process.env.DB_PORT)
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch((err) => {
      console.log(`Datebase not connected , Error : ${err}`);
    });
};

module.exports = dbConnection;
