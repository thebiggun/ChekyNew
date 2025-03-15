const expressrouter = require("express").Router();
const getInventory = require("../Controller/getInventory");

expressrouter.get("/getInventory", getInventory);

module.exports = expressrouter;
