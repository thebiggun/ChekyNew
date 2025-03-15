const expressrouter = require("express").Router();
const updateFlashPrice = require("../Controller/updateFlashPrice");

expressrouter.post('/updateDiscount', updateFlashPrice);

module.exports = expressrouter;