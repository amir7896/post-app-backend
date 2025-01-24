const express = require("express");
require("dotenv").config();
const dbCon = require("./config/dbCon");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const PORT = process.env.PORT;
const app = express();
dbCon();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
