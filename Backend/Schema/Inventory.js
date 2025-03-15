const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    GTIN: String,
    Quantity: Number,
    Name: String,
    ExpiryDate: String,
    Image: String,
    FlashPrice: Number,
    Price: String
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;