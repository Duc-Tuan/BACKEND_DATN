const express = require("express");
const routerBanner = express.Router();

const BannerController = require("../Controllers/Banner");

const uploadBanenr = require("../middlewares/uploadBanner");

routerBanner
  .route("/")
  .get(BannerController.getAll)
  .post(uploadBanenr.single("Banner_image"), BannerController.postAll);

routerBanner
  .route("/:bannerID")
  .get(BannerController.getBannerID)
  .patch(uploadBanenr.single("Banner_image"),BannerController.patchBannerID)
  .delete(BannerController.deleteBannerID);

module.exports = routerBanner;
