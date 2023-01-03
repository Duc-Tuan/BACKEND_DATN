const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const UserSchema = new Schema(
  {
    user_address: {
      type: String,
      default: null,
    },
    user_aliases: {
      type: String,
    },
    user_name: {
      type: String,
    },
    user_password: {
      type: String,
    },
    user_email: {
      type: String,
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
    user_cartsID: [
      {
        type: Schema.Types.ObjectId,
        ref: "cart",
      },
    ],
    user_payID: [
      {
        type: Schema.Types.ObjectId,
        ref: "pay",
      },
    ],
    user_historyID:[
      {
        type: Schema.Types.ObjectId,
        ref: "HistoryBuy",
      },
    ]
  },
  {
    timestamps: true,
  }
);

const User = mongodb.model("User", UserSchema);
module.exports = User;
