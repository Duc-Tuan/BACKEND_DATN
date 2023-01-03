const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const CartSchema = new Schema(
  {
    cart_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cart_data: [
      {
        type: Object,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Carts = mongodb.model("cart", CartSchema);
module.exports = Carts;
