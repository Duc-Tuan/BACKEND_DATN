const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const BannerSchema = new Schema(
  {
    Banner_contact: {
      type: String,
      default: null,
    },
    Banner_url: {
      type: String,
      default: null,
    },
    Banner_image: {
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

const Banner = mongodb.model("Banner", BannerSchema);
module.exports = Banner;
