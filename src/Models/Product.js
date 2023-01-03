const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const ProductSchema = new Schema({
  product_index: {
    type: Number,
    default: 0,
  },
  product_warehouse: {
    type: String,
    default: null,
  },
  product_name: {
    type: String,
  },
  product_description: {
    type: String,
  },
  product_percent: {
    type: Number,
    default: 0,
  },
  product_zise: {
    type: String,
  },
  product_detail: {
    type: String,
  },
  product_trademark: {
    type: String,
  },
  product_monney: {
    type: Number,
    default: 0,
  },
  product_status: {
    type: String,
  },
  product_category: {
    type: String,
  },
  product_img: [
    {
      url: {
        type: String,
        default: null,
      },
      Cloudinary_id: {
        type: String,
        default: null,
      },
    },
  ],
  avatar: [
    {
      url: {
        type: String,
        default: null,
      },
      Cloudinary_id: {
        type: String,
        default: null,
      },
    },
  ],
  avatarMulter: [
    {
      type: String,
      default: null,
    },
  ],
  product_comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
});

const Product = mongodb.model("Product", ProductSchema);
module.exports = Product;
