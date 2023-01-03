const express = require("express");
const CategoryRouter = express.Router();

const CategoryController = require("../Controllers/Category");
const uploadCatergory = require("../middlewares/uploadCategory");

CategoryRouter.route("/")
    .get(CategoryController.getAll)
    .post(uploadCatergory.single("category_image") ,CategoryController.postAll);

CategoryRouter.route("/:categoryID")
    .get(CategoryController.getCategoryID)
    .patch(uploadCatergory.single("category_image") ,CategoryController.patchCategory)
    .delete(CategoryController.deleteCategory);

module.exports = CategoryRouter;
