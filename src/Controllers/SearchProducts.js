const Product = require("../Models/Product");

const getDataSearchName = (req, res, next) => {
  const { name, type, page, pageSize } = req.query;
  const dataSearch = new RegExp(name, "i");
  if (name && type === "less") {
    if (page !== undefined && pageSize !== undefined) {
      if (page < 1) page = 1;
      const skipNumber = (page - 1) * pageSize;
      console.log(skipNumber);
      Product.find({ product_name: dataSearch })
        .skip(skipNumber)
        .sort({ product_index: -1 })
        .limit(pageSize)
        .then((data) => {
          Product.countDocuments({product_name: dataSearch})
            .then((total) => {
              var totalPage = Math.ceil(total / pageSize);
              return res
                .status(200)
                .json({ totalPage, data, currentPage: page });
            })
            .catch((error) => next(error));
        })
        .catch((err) => next(err));
    } else {
      Product.find({ product_name: dataSearch })
        .then((data) => {
          return res.status(200).json({ data });
        })
        .catch((err) => next(err));
    }
  }
};

module.exports = { getDataSearchName };
