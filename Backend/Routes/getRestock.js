const expressrouter = require("express").Router();
const getRestock = require("../Controller/getRestock");

expressrouter.get("/getRestock/:minQty", getRestock);

module.exports = expressrouter;