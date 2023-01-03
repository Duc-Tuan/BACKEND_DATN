const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/user");
const uploadFile = require("../middlewares/uploadFile");
const decentralization = require("../DecentralizationAdmin");

router.route("/").post(decentralization.decentralization__Users, UserController.index);

router.route("/login").post(UserController.postLoginUser);

router.route("/loginUser").post(UserController.getloginUser);

router.route("/register").post(UserController.newUser);

router.route("/resetPass").post(UserController.resetPass);

router
  .route("/:userID")
  .get(UserController.getUserById)
  .put(UserController.replaceUser)
  .patch(uploadFile.single("avatar"), UserController.updateUser)
  .delete(decentralization.decentralization__Users ,UserController.deleteUser);

router
  .route("/:userID/carts")
  .get(UserController.getUserProduct)
  .post(UserController.newUseProduct);

router
  .route("/:userID/pay")
  .get(UserController.getUserPay)
  .post(UserController.newUsePay);

router
  .route("/:userID/history")
  .get(UserController.getUserHistory)
  .post(UserController.newUseHistory);

router.route("/:userID/history/:statusName")
  .get(UserController.getUserHistoryStatus);

router
  .route("/:userID/carts/:productID")
  .post(UserController.postProductUser)
  .delete(UserController.deleteCartItem);

module.exports = router;
