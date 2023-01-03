const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const UserAdminSchema = new Schema(
  {
    user_address: {
      type: String,
      default: null,
    },
    user_aliases: {
      type: String,
      default: null,
    },
    user_name: {
      type: String,
    },
    user_password: {
      type: String,
    },
    user_email: {
      type: String,
      default: null,
    },
    user_phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    avatarMulter: {
      type: String,
      default: null,
    },
    Cloudinary_id: {
      type: String,
      default: null,
    },
    role: [
      {
        type: Schema.Types.ObjectId,
        ref: "roleAdmin",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserAdmin = mongodb.model("UserAdmin", UserAdminSchema);
module.exports = UserAdmin;
