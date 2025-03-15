const expressrouter = require("express").Router();
const getExpired = require("../Controller/getExpired");

expressrouter.get("/getExpired", getExpired);

module.exports = expressrouter;