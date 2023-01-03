const Category = require("../Models/category");
const Cloudinary = require("../utils/cloudnary");
const fs = require("fs");
const path = require("path");

const getAll = (req, res, next) => {
  Category.find()
    .sort({ category_index: -1 })
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const postAll = async (req, res, next) => {
  const dataCategory = req.file;
  const result = await Cloudinary.uploader.upload(dataCategory.path, {
    folder: "category",
  });
  req.body.category_image = {
    url: result.secure_url,
    Cloudinary_id: result.public_id,
  };
  req.body.avatarMulter = dataCategory.path;

  Category.countDocuments()
    .then((data) => {
      req.body.category_index = data + 1;
      const NewCategory = new Category(req.body);
      NewCategory.save()
        .then((data) => {
          return res.status(201).json({ data });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const deleteCategory = async (req, res, next) => {
  const { categoryID } = req.params;
  const dataCategory = await Category.findById(categoryID);
  if (dataCategory) {
    await Cloudinary.uploader.destroy(
      dataCategory.category_image.Cloudinary_id
    );
    const directoryPath =
      path.dirname(path.dirname(__dirname)) + `\\${dataCategory.avatarMulter}`;
    fs.unlinkSync(directoryPath);
  }
  Category.findByIdAndDelete(categoryID)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const patchCategory = async (req, res, next) => {
  const dataCategory = req.file;
  const { categoryID } = req.params;
  const dataCate = await Category.findById(categoryID);
  if (dataCate !== null) {
    if (dataCategory !== undefined) {
      await Cloudinary.uploader.destroy(dataCate.category_image.Cloudinary_id);
      const directoryPath =
        path.dirname(path.dirname(__dirname)) + `\\${dataCate.avatarMulter}`;
      fs.unlinkSync(directoryPath);

      const result = await Cloudinary.uploader.upload(dataCategory.path, {
        folder: "category",
      });
      req.body.category_image = {
        url: result.secure_url,
        Cloudinary_id: result.public_id,
      };
      req.body.avatarMulter = dataCategory.path;
    } else {
      req.body.category_image = dataCate.category_image;
    }
  }
  const NewCategory = req.body;
  Category.findByIdAndUpdate({ _id: categoryID }, NewCategory)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

const getCategoryID = (req, res, next) => {
  const { categoryID } = req.params;
  Category.findById(categoryID)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => next(err));
};

module.exports = {
  getAll,
  postAll,
  getCategoryID,
  deleteCategory,
  patchCategory,
};
