const express = require("express");
const routerProduct = express.Router();

const UserController = require("../Controllers/product");
const decentralization = require("../DecentralizationAdmin");
const uploadProduct = require("../middlewares/uploadImageProducts");

const cpUpload = uploadProduct.fields([
  { name: "product_img", maxCount: 1 },
  { name: "avatar", maxCount: 4 },
]);

routerProduct
  .route("/")
  .get(UserController.getAll)
  .post(
    decentralization.decentralization__Products,
    cpUpload,
    UserController.addProduct
  );

routerProduct
  .route("/category/:categoryName")
  .get(UserController.getProductCategory);

routerProduct
  .route("/:productID")
  .get(UserController.getProductID)
  .patch(
    decentralization.decentralization__Products,
    cpUpload,
    UserController.postProductID
  )
  .delete(
    decentralization.decentralization__Products,
    UserController.deleteProduct
  );

module.exports = routerProduct;
