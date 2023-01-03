const mongodb = require("mongoose");
const Schema = mongodb.Schema;

const CommentSchema = new Schema(
  {
    comment_index: {
      type: Number,
      default: 0,
    },
    comment_content: [
      {
        index: {
          type: Number,
          default: 0,
        },
        id_user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        name_user: {
          type: String,
          default: null,
        },
        name_avatar: {
          type: String,
          default: null,
        },
        content: {
          type: String,
          default: null,
        },
        date: {
          type: String,
          default: new Date(),
        },
      },
    ],
    comment_ProductID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongodb.model("Comment", CommentSchema);
module.exports = Comment;
