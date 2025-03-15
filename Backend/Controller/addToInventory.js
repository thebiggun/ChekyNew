const Inventory = require("../Schema/Inventory");

const addToInventory = async (req, res) => {
    try {
        const { GTIN, Quantity, ExpiryDate } = req.body; // Extract from request body


        const product = await Inventory.findOne({ GTIN });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.Quantity += parseInt(Quantity, 10);
        product.ExpiryDate = ExpiryDate;

        await product.save();

        res.json(product);
    } catch (error) {
        console.error("Error adding to inventory:", error);
        res.status(500).json({ message: "Error adding to inventory", error: error.message });
    }
};

module.exports = addToInventory;