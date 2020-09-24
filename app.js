const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");
const AuthController = require("./routes/auth");
const loginController = require("./routes/login");
const multer = require("multer");
var upload = multer();
const cors = require("cors");

const postRoute = require("./routes/post");
const profileRoute = require("./routes/profile");
const creditsRoute = require("./routes/credit");
const postGenderRoute = require("./routes/gender");
const categoryRoute = require("./routes/category");
const searchRoute = require("./routes/search");

// const loginRouter = require('./controllers/authController')

app.use(bodyParser.json());

app.use(upload.array());
app.use(cors());

app.use("/post", postRoute);
app.use("/post/gender", postGenderRoute);
app.use("/profile", profileRoute);
app.use("/credits", creditsRoute);
app.use("/post/category", categoryRoute);
app.use(AuthController);
app.use("/search", searchRoute);

// app.use(loginRouter)

app.get("/", (req, res) => {
  res.send("this the main page");
});

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("DB connected");
  }
);

app.listen(3005, () => {
  console.log("server started");
});
