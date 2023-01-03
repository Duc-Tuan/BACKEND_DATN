const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const PromotionSchema = new Schema(
  {
    Promotion_percent: {
      type: Number,
      default: 0,
    },
    Promotion_start: {
      type: String,
      default: null,
    },
    Promotion_end: {
      type: String,
      default: null,
    },
    Promotion_image: {
      url: {
        type: String,
        default: null,
      },
      Cloudinary_id: {
        type: String,
        default: null,
      },
    },
    Promotion_multer: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongodb.model("Promotion", PromotionSchema);
module.exports = Promotion;
