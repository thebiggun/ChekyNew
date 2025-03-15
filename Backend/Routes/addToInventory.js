const expressrouter = require("express").Router();
const addToInventory = require("../Controller/addToInventory");

expressrouter.put("/addToInventory", addToInventory);

module.exports = expressrouter;
