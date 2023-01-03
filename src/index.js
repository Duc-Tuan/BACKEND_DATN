const bodyParesr = require("body-parser");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const users = require("./Routers/user");
const products = require("./Routers/product");
const searchProducts = require("./Routers/searchProducts");
const banner = require("./Routers/banner");
const category = require("./Routers/Category");
const promotion = require("./Routers/Promotion");
const comments = require("./Routers/Comments");
const userAdmin = require("./Routers/Admin/User");
const cookieParser = require('cookie-parser')

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
mongoose
  .connect("mongodb://localhost:27017/demo_resfull_api")
  .then(() => console.log("connection success"))
  .catch((error) => console.error(`connection failed ${error}`));

//middleware
app.use(logger("dev"));
app.use(cookieParser())
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
// app.use(express.bodyParser({limit: '50mb'}));
// app.use(bodyParesr.json());

// Routes
app.use("/users", users);
app.use("/products", products);
app.use("/search/products", searchProducts);
app.use("/banner", banner);
app.use("/category", category);
app.use("/promotion", promotion);
app.use("/comments", comments);
app.use("/src/Images/avatarUsers", express.static("src/Images/avatarUsers"));
app.use(
  "/src/Images/ImageProducts",
  express.static("src/Images/ImageProducts")
);
app.use("/src/Images/ImageBanner", express.static("src/Images/ImageBanner"));
app.use("/src/Images/Promotion", express.static("src/Images/Promotion"));

// Admin
app.use("/userAdmin", userAdmin);

// Router
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK!",
  });
});

//catch 404 error and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
const port = process.env.PORT || 3036;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
