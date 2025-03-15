const expressrouter = require("express").Router();
const getProduct = require("../Controller/getProduct");

expressrouter.get("/getProducts/:gtin", getProduct);

module.exports = expressrouter;