const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");


const loginController = require("./routes/login");
var multer = require("multer");
var uploadForm = multer();
const cors = require("cors");


var uploadRoute = require("./routes/upload");
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
var uploadRoute = require("./routes/upload")
var uploadImagesRoute = require("./routes/uploadImages")
const productLikes = require("./routes/productLikes")


// const loginRouter = require('./controllers/authController')

app.use(bodyParser.json());



//app.use(uploadForm.array());

//console.log(uploadForm.storage);
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
app.use(productLikes)


// app.use(uploadForm.single('myImages'));
 
app.use(uploadRoute)
app.use(uploadImagesRoute)
// app.use(loginRouter)

app.get("/", (req, res) => {
  res.send("this the main page");
});



// app.post("/upload", upload.single('image'), (req, res) => {
  
//   console.log(req.file)

// })

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

app.listen(3000, () => {
  console.log("server started at 3000");
});
