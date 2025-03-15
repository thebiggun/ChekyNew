const Inventory = require("../Schema/Inventory");
const getInventory = async (req, res) => {
    try {
        const inv = await Inventory.find();
        res.json(inv);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Error fetching inventory", error: error.message });
    }
}
module.exports = getInventory;