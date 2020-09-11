require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// My routes
const authRouters = require("./routes/auth");
const userRouters = require("./routes/user");

const app = express();
const port = 8000;

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", authRouters);
app.use("/api", userRouters);

mongoose
  .connect(process.env.DATABASE_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB is Connected!");
  })
  .catch((err) => console.error("Database is not connected"));

app.get("/", (req, res) => {
  res.send("<h1>App is working Fine. </h1>");
});

http.createServer(app).listen(port, "0.0.0.0");
