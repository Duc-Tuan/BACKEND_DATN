const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const CategorySchema = new Schema(
  {
    category_index: {
      type: Number,
      default: 0,
    },
    category_name: {
      type: String,
    },
    category_image: {
      url: {
        type: String,
        default: null,
      },
      Cloudinary_id: {
        type: String,
        default: null,
      },
    },
    avatarMulter: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongodb.model("category", CategorySchema);
module.exports = Category;
