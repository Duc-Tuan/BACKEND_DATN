const User = require("../Models/user");
const Product = require("../Models/Product");
const Comments = require("../Models/comment");
const fs = require("fs");
const path = require("path");
const Cloudinary = require("../utils/cloudnary");

const getAll = (req, res, next) => {
  var { page, pageSize } = req.query;
  var skipNumber;
  if (page || pageSize) {
    pageSize = parseInt(pageSize);
    page = parseInt(page);
    if (page < 1) page = 1;
    skipNumber = (page - 1) * pageSize;
    Product.find()
      .skip(skipNumber)
      .sort({ product_index: -1 })
      .limit(pageSize)
      .then((data) => {
        Product.countDocuments({})
          .then((total) => {
            var totalPage = Math.ceil(total / pageSize);
            return res.status(200).json({ totalPage, data, currentPage: page });
          })
          .catch((error) => next(error));
      })
      .catch((err) => next(err));
  } else {
    Product.find()
      .then((data) => {
        data.reverse();
        return res.status(200).json({ data });
      })
      .catch((err) => next(err));
  }
};

const addProduct = async (req, res, next) => {
  const { avatar, product_img } = req.files;
  if (avatar && product_img) {
    const image = [];
    const avtMulter = [];
    for (var i = 0; i < product_img.length; i++) {
      const result = await Cloudinary.uploader.upload(product_img[i].path, {
        folder: "products",
      });
      image.push({
        url: result.secure_url,
        Cloudinary_id: result.public_id,
      });
      avtMulter.push(product_img[i].path);
    }
    req.body.product_img = image;

    const img = [];
    for (var i = 0; i < avatar.length; i++) {
      const result = await Cloudinary.uploader.upload(avatar[i].path, {
        folder: "productsDetails",
      });
      img.push({
        url: result.secure_url,
        Cloudinary_id: result.public_id,
      });
      avtMulter.push(avatar[i].path);
    }
    req.body.avatar = img;

    req.body.avatarMulter = avtMulter;
  }
  Product.countDocuments()
    .then((data) => {
      req.body.product_index = data + 1;
      const newProduct = new Product(req.body);
      newProduct
        .save()
        .then(async (product) => {
          const indexCom = await Comments.countDocuments();
          const newIndex = indexCom + 1;
          return {
            product,
            newIndex
          }
        })
        .then(data => {
          const dataCommnets = {
            comment_index: data.newIndex,
            comment_ProductID: data.product._id,
            comment_content: [],
          };
          const comment = new Comments(dataCommnets);
          comment.save();
          return comment;
        })
        .then(async (data) => {
          const dataProduct = await Product.findById(data.comment_ProductID);
          dataProduct.product_comments = data._id;
          dataProduct.save();
          return dataProduct;
        })
        .then((data) => {
          return res.status(201).json({ data });
        })
        .catch((err) => next(err));
    })
    .catch((err) => console.log(err));
};

const postProductID = async (req, res, next) => {
  const { productID } = req.params;
  const { avatar, product_img } = req.files;
  const product = await Product.findById(productID);
  if (product) {
    if (avatar !== undefined && product_img === undefined) {
      for (let i = 0; i < product.avatar.length; i++) {
        await Cloudinary.uploader.destroy(product.avatar[i].Cloudinary_id);
      }
      for (var i = 1; i < product.avatarMulter.length; i++) {
        const directoryPath =
          path.dirname(path.dirname(__dirname)) +
          `\\${product.avatarMulter[i]}`;
        fs.unlinkSync(directoryPath);
      }

      const a = product.avatarMulter;
      a.splice(1, a.length);
      const img = [];
      const avtMulter = [];
      for (var i = 0; i < avatar.length; i++) {
        const result = await Cloudinary.uploader.upload(avatar[i].path, {
          folder: "productsDetails",
        });
        img.push({
          url: result.secure_url,
          Cloudinary_id: result.public_id,
        });
        avtMulter.push(avatar[i].path);
      }
      req.body.avatar = img;
      req.body.product_img = product.product_img;
      req.body.avatarMulter = [...a, ...avtMulter];
    } else if (product_img !== undefined && avatar === undefined) {
      await Cloudinary.uploader.destroy(product.product_img[0].Cloudinary_id);
      const directoryPath =
        path.dirname(path.dirname(__dirname)) + `\\${product.avatarMulter[0]}`;
      fs.unlinkSync(directoryPath);

      const image = [];
      const avtMulter = [];
      const a = product.avatarMulter;
      a.shift();
      for (var i = 0; i < product_img.length; i++) {
        const result = await Cloudinary.uploader.upload(product_img[i].path, {
          folder: "products",
        });
        image.push({
          url: result.secure_url,
          Cloudinary_id: result.public_id,
        });
        avtMulter.push(product_img[0].path);
      }
      req.body.product_img = image;
      req.body.avatar = product.avatar;
      req.body.avatarMulter = [...avtMulter, ...a];
    } else if (product_img === undefined && avatar === undefined) {
      req.body = req.body;
    } else {
      for (var i = 0; i < product.avatar.length; i++) {
        await Cloudinary.uploader.destroy(product.avatar[i].Cloudinary_id);
      }
      await Cloudinary.uploader.destroy(product.product_img[0].Cloudinary_id);

      for (var i = 0; i < product.avatarMulter.length; i++) {
        const directoryPath =
          path.dirname(path.dirname(__dirname)) +
          `\\${product.avatarMulter[i]}`;
        fs.unlinkSync(directoryPath);
      }

      const image = [];
      const images = [];
      const avtMulter = [];
      for (var i = 0; i < product_img.length; i++) {
        const result = await Cloudinary.uploader.upload(product_img[i].path, {
          folder: "avatar",
        });
        image.push({
          url: result.secure_url,
          Cloudinary_id: result.public_id,
        });
        avtMulter.push(product_img[0].path);
      }

      for (var i = 0; i < avatar.length; i++) {
        const result = await Cloudinary.uploader.upload(avatar[i].path, {
          folder: "avatarDetails",
        });
        images.push({
          url: result.secure_url,
          Cloudinary_id: result.public_id,
        });
        avtMulter.push(avatar[i].path);
      }

      req.body.product_img = image;
      req.body.avatar = images;
      req.body.avatarMulter = avtMulter;
    }
  }

  const newUser = req.body;
  const newProduct = await Product.findByIdAndUpdate(
    { _id: productID },
    newUser
  );
  newProduct
    .save()
    .then((user) => {
      return res.status(201).json({ user });
    })
    .catch((err) => next(err));
};

const getProductID = (req, res, next) => {
  const { productID } = req.params;

  Product.find({ _id: productID }).populate("product_comments")
    .then((data) => {
      return res.status(200).json({
        data,
      });
    })
    .catch((error) => next(error));
};

const deleteProduct = async (req, res, next) => {
  const { productID } = req.params;
  Product.findByIdAndDelete(productID)
    .then(async (data) => {
      try {
        const images = [...data.avatar];
        const image = [...data.product_img];
        const dataMulter = [...data.avatarMulter];
        for (var i = 0; i < images.length; i++) {
          await Cloudinary.uploader.destroy(images[i].Cloudinary_id);
        }
        for (var i = 0; i < image.length; i++) {
          await Cloudinary.uploader.destroy(image[i].Cloudinary_id);
        }
        for (var i = 0; i < dataMulter.length; i++) {
          const directoryPath =
            path.dirname(path.dirname(__dirname)) + `\\${dataMulter[i]}`;
          fs.unlinkSync(directoryPath);
        }
        res.status(200).send({
          message: "File is deleted.",
        });
      } catch (err) {
        res.status(500).send({
          message: "Could not delete the file. " + err,
        });
      }
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const getProductCategory = (req, res, next) => {
  var { page, pageSize } = req.query;
  const name = req.params.categoryName;
  var skipNumber;
  if (page || pageSize) {
    pageSize = parseInt(pageSize);
    page = parseInt(page);
    if (page < 1) page = 1;
    skipNumber = (page - 1) * pageSize;
    Product.find({ product_category: name })
      .sort({ product_index: -1 })
      .skip(skipNumber)
      .limit(pageSize)
      .then((data) => {
        Product.find({ product_category: name })
          .countDocuments({})
          .then((total) => {
            var totalPage = Math.ceil(total / pageSize);
            return res.status(200).json({ totalPage, data, currentPage: page });
          })
          .catch((error) => next(error));
      })
      .catch((err) => next(err));
  } else {
    Product.find({ product_category: name })
      .then((data) => {
        data.reverse();
        return res.status(200).json({ data });
      })
      .catch((err) => next(err));
  }
};

module.exports = {
  getAll,
  getProductID,
  postProductID,
  addProduct,
  deleteProduct,
  getProductCategory,
};
