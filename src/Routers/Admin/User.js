const express = require("express");
const router = express.Router();

const decentralization = require("../../DecentralizationAdmin");
const AdminController = require("../../Controllers/Admin/Users");
const uploadFile = require("../../middlewares/uploadFile");

router
  .route("/")
  .get(decentralization.decentralization__Supreme, AdminController.getAll)
  .patch(
    decentralization.decentralization__Supreme,
    uploadFile.single("avatar"),
    AdminController.patchAdmin
  );

router
  .route("/login/token")
  .post(decentralization.decentralization__Login, AdminController.getAdmin);

router
  .route("/login")
  .get(decentralization.decentralization__Supreme, AdminController.getAdmin)
  .post(AdminController.postLoginAdmin);

router.route("/register").post(AdminController.postRegisterAdmin);

router
  .route("/CreateRole")
  .get(AdminController.getRole)
  .post(AdminController.postCreateRole);

router.route("/Products").post(decentralization.decentralization__Products, AdminController.getProducts);
router.route("/Comments").post(decentralization.decentralization__Comments ,AdminController.getComments);
router.route("/Orders").post(decentralization.decentralization__Orders,AdminController.getOrders);
router.route("/Banners").post(decentralization.decentralization__Supreme,AdminController.getBanners);
router.route("/Promotions").post(decentralization.decentralization__Supreme,AdminController.getPromotions);
router.route("/Categories").post(decentralization.decentralization__Supreme,AdminController.getCategories);

module.exports = router;
