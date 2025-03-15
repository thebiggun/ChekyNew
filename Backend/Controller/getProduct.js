const Inventory = require("../Schema/Inventory");
const getProduct = async (req, res) => {
    try {
        const { gtin } = req.params;
        const product = await Inventory.findOne({ GTIN: gtin });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
}
module.exports = getProduct;