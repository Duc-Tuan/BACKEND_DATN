const express = require("express");
const routerPromotion = express.Router();

const PromotionController = require("../Controllers/Promotion");

const uploadPromotion = require("../middlewares/uploadPromotion");

routerPromotion
  .route("/")
  .get(PromotionController.getAll)
  .post(uploadPromotion.array("Promotion_image"), PromotionController.postAll);

routerPromotion
  .route("/:promotionID")
  .get(PromotionController.getPromoID)
  .patch(
    uploadPromotion.array("Promotion_image"),
    PromotionController.postPromoID
  )
  .delete(PromotionController.deletePromoID);

module.exports = routerPromotion;
