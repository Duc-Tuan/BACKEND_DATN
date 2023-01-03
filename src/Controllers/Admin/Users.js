const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const Cloudinary = require("../../utils/cloudnary");
// const nodemailer = require("nodemailer");
const Roles = require("../../Models/Admin/Role");
const Banner = require("../../Models/Banner");
const Category = require("../../Models/category");
const Comments = require("../../Models/comment");
const Product = require("../../Models/Product");
const Promotion = require("../../Models/Promotion");
const UsersAdmin = require("../../Models/Admin/Users");
const Users = require("../../Models/user");

class UserComment {
  constructor(
    id,
    avatar,
    nameUser,
    UserName,
    ContentComment,
    dateComment,
    imgProduct,
    nameProduct
  ) {
    this._id = id;
    this.avatar = avatar;
    this.nameUser = nameUser;
    this.UserName = UserName;
    this.ContentComment = ContentComment;
    this.dateComment = dateComment;
    this.imgProduct = imgProduct;
    this.nameProduct = nameProduct;
  }
}

const getAll = (req, res, next) => {
  UsersAdmin.find()
    .populate("role")
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const getAdmin = async (req, res, next) => {
  const dataAdmin = await UsersAdmin.findById(req.id).populate("role");
  if (dataAdmin) {
    return res
      .status(200)
      .json({ data: dataAdmin, suss: "Logged in Successfully!!!" });
  } else {
    return res.status(200).json({
      data: dataAdmin,
      err: "Incorrect account or password. Please check again!!!",
    });
  }
};
const postLoginAdmin = (req, res, next) => {
  const { user_name, user_password } = req.body;
  UsersAdmin.find({ user_name: user_name, user_password: user_password })
    .then((user) => {
      const token = jwt.sign({ user }, "Anhtuan2002.");
      return res.status(200).json({ data: token });
    })
    .catch((err) => next(err));
};
const postRegisterAdmin = async (req, res, next) => {
  const UserAdmin = new UsersAdmin(req.body);
  const dataUsers = await UsersAdmin.find({ user_name: req.body.user_name });
  if (dataUsers.length === 0) {
    UserAdmin.save()
      .then((data) => {
        return res.status(200).json({ data, mess: "Successfully!!!" });
      })
      .catch((error) => next(error));
  } else {
    return res.status(200).json({ mess: "Đã tồn tại tài khoản này" });
  }
};
const getRole = (req, res, next) => {
  Roles.find()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};
const postCreateRole = (req, res, next) => {
  const RolesAdmin = new Roles(req.body);
  RolesAdmin.save()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};
const patchAdmin = async (req, res, next) => {
  const dataUser = await UsersAdmin.findById(req.id);
  if (dataUser.avatar !== null && req.file) {
    const directoryPath =
      path.dirname(path.dirname(__dirname)) + `\\${dataUser.avatarMulter}`;
    await Cloudinary.uploader.destroy(dataUser.Cloudinary_id);
    fs.unlinkSync(directoryPath);
    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "avatar",
    });
    req.body.avatar = result.secure_url;
    req.body.avatarMulter = req.file.path;
    req.body.Cloudinary_id = result.public_id;
  } else if (dataUser.avatar === null && req.file) {
    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "avatar",
    });
    req.body.avatar = result.secure_url;
    req.body.avatarMulter = req.file.path;
    req.body.Cloudinary_id = result.public_id;
  } else if (req.file === null) {
    req.body.avatar = dataUser.avatar;
    req.body = req.body;
  }

  const newUser = req.body;
  await UsersAdmin.findByIdAndUpdate(UserAdminID, newUser)
    .then(() => {
      return UsersAdmin.findById(UserAdminID);
    })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};

const getProducts = (req, res, next) => {
  Product.find()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};
const getComments = (req, res, next) => {
  Comments.find()
    .populate("comment_ProductID")
    .then((data) => {
      return data.filter((item) => item.comment_content.length > 0);
    })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};
const getOrders = (req, res, next) => {};
const getCategories = (req, res, next) => {
  Category.find()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};
const getBanners = (req, res, next) => {
  Banner.find()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};
const getPromotions = (req, res, next) => {
  Promotion.find()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => console.log(error));
};

module.exports = {
  getAdmin,
  getAll,
  postLoginAdmin,
  postRegisterAdmin,
  postCreateRole,
  getRole,
  patchAdmin,
  getProducts,
  getComments,
  getOrders,
  getCategories,
  getBanners,
  getPromotions,
};
