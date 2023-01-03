const express = require("express");
const routerComment = express.Router();

const CommentController = require("../Controllers/Comment");
const decentralization = require("../DecentralizationAdmin");

routerComment.route("/").get(CommentController.getAll);

routerComment
  .route("/:commentID")
  .patch(CommentController.patchCommentID)
  .delete(
    decentralization.decentralization__Comments,
    CommentController.deleteComment
  );

routerComment.route("/:productID").get(CommentController.getProductComments);

routerComment.route("/:productID/:userID").post(CommentController.postComments);

module.exports = routerComment;
