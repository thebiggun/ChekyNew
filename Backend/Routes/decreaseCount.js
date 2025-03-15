const expressrouter = require("express").Router();
const decreaseCount = require("../Controller/decreaseCount");

expressrouter.post("/decreaseCount", decreaseCount);

module.exports = expressrouter;