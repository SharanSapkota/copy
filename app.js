const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");

const postRoute = require("./routes/post");
const evaluationRoute = require("./routes/admin/evaluation");
const rejectedRoute = require("./routes/admin/rejected");
const profileRoute = require("./routes/profile");
const creditsRoute = require("./routes/credit");
const postGenderRoute = require("./routes/gender");
const categoryRoute = require("./routes/category");
const searchRoute = require("./routes/search");
const reviewRoute = require("./routes/review");
const orderRoute = require("./routes/order");
const purchasesRoute = require("./routes/purchases");
const partnersRoute = require("./routes/partners");
const internalRoute = require("./routes/internal");
const AuthController = require("./routes/auth");
const sellers = require("./routes/sellers");
const productLikes = require("./routes/productLikes");
const notificationsRoute = require("./routes/notifications");

const adminOrderRoute = require("./routes/admin/orders");
const adminRoute = require("./routes/admin/admin");

const s3uploadRoute = require("./routes/s3upload");
const validateFields = require("./routes/validateFields");

app.use(bodyParser.json());

app.use("/api/post", postRoute);
app.use("/api/post/gender", postGenderRoute);
app.use("/api/profiles", profileRoute);
app.use("/api/credits", creditsRoute);
app.use("/api/post/category", categoryRoute);
app.use("/api/auth", AuthController);
app.use("/api/search", searchRoute);
app.use("/api/orders", orderRoute);
app.use("/api/purchases", purchasesRoute);
app.use("/api/likes", productLikes);
app.use("/api/review", reviewRoute);
app.use("/api/partners", partnersRoute);
app.use("/api/internal", internalRoute);
app.use("/api/sellers", sellers);
app.use("/api/notifications", notificationsRoute);

//Admin route
app.use("/api/admin", adminRoute);
app.use("/api/admin/evaluation", evaluationRoute);
app.use("/api/admin/rejected", rejectedRoute);
app.use("/api/admin/orders", adminOrderRoute);

app.use("/api/s3upload", s3uploadRoute);
app.use("/api/validate", validateFields);

mongoose.connect(
  process.env.MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("DB connected");
  }
);

app.listen(5000, () => {
  console.log("server started at 5000");
});
