const Inventory = require("../Schema/Inventory");

const decreaseCount = async (req, res) => {
    try {
        const cartItems = req.body.cart;

        for (const item of cartItems) {
            await Inventory.findOneAndUpdate(
                { GTIN: item.GTIN },
                { $inc: { Quantity: -item.quantity } },
                { new: true }
            );
        }

        res.status(200).json({ message: "Inventory updated successfully" });
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({ error: "Failed to update inventory" });
    }
};

module.exports = decreaseCount;