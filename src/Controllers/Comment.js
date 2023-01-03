const Comments = require("../Models/comment");
const Users = require("../Models/user");
const Products = require("../Models/Product");

const getAll = (req, res, next) => {
  Comments.find()
    .sort({ comment_index: -1 })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const postComments = async (req, res, next) => {
  const { productID, userID } = req.params;
  try {
    const dataProduct = await Products.findById(productID);
    if (dataProduct) {
      const dataComments = await Comments.findById(
        dataProduct.product_comments
      );
      const dataUsers = await Users.findById(userID);
      if (dataUsers !== null) {
        const dataNewComments = {
          index: dataComments.comment_content.length + 1,
          id_user: dataUsers._id,
          name_user: dataUsers.user_aliases,
          name_avatar: dataUsers.avatar,
          content: req.body.content,
        };
        dataComments.comment_content.push(dataNewComments);
        dataComments
          .save()
          .then((data) => {
            return res.status(200).json({ data });
          })
          .catch((err) => next(err));
      }
    }
  } catch (e) {
    console.log("ko tim thay");
  }
};

const patchCommentID = async (req, res, next) => {
  const { commentID } = req.params;
  const newComment = req.body;
  Comments.findByIdAndUpdate(commentID, newComment)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};

const deleteComment = async (req, res, next) => {
  const { commentID } = req.params;
  Comments.findByIdAndDelete(commentID)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};

const getProductComments = (req, res, next) => {
  const { productID } = req.params;
  Products.findById(productID)
    .populate("product_comments")
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};

module.exports = {
  getAll,
  postComments,
  patchCommentID,
  deleteComment,
  getProductComments,
};
