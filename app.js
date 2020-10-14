const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");

const loginController = require("./routes/login");
// var multer = require("multer");
// var uploadForm = multer();
const cors = require("cors");

const postRoute = require("./routes/post");
const profileRoute = require("./routes/profile");
const creditsRoute = require("./routes/credit");
const postGenderRoute = require("./routes/gender");
const categoryRoute = require("./routes/category");
const searchRoute = require("./routes/search");
const reviewRoute = require("./routes/review");
const likesRoute = require("./routes/productLikes");
const orderRoute = require("./routes/order");
const partnersRoute = require("./routes/partners");
const internalRoute = require("./routes/internal");
const AuthController = require("./routes/auth");
const productLikes = require("./routes/productLikes");

const s3uploadRoute = require("./routes/s3upload");
const validateFields = require("./routes/validateFields");

app.use(bodyParser.json());

app.use(cors());

app.use("/api/post/product", likesRoute);
app.use("/api/post", postRoute);
app.use("/api/post/gender", postGenderRoute);
app.use("/api/profile", profileRoute);
app.use("/api/credits", creditsRoute);
app.use("/api/post/category", categoryRoute);
app.use("/api/auth", AuthController);
app.use("/api/search", searchRoute);
app.use("/api/order", orderRoute);
app.use("/api/post", likesRoute);
app.use("/api/review", reviewRoute);
app.use("/api/partners", partnersRoute);
app.use("/api/internal", internalRoute);

app.use(productLikes);

app.use("/api/s3upload", s3uploadRoute);
app.use("/api/validate", validateFields);

app.get("/", (req, res) => {
  res.send("this the main page");
});

mongoose.connect(
  process.env.MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => {
    console.log("DB connected");
  }
);

app.listen(3005, () => {
  console.log("server started at 3005");
});
