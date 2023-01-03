const express = require("express");
const routerSearchProducts = express.Router();

const SearchProducts = require('../Controllers/SearchProducts');

routerSearchProducts.route('/')
    .get(SearchProducts.getDataSearchName)

module.exports = routerSearchProducts;