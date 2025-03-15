const Inventory = require("../Schema/Inventory");

const getRestock = async (req, res) => {
    try {
        const minQty = Number(req.params.minQty);

        if (isNaN(minQty)) {
            return res.status(400).json({ message: "Invalid minQty parameter" });
        }

        const items = await Inventory.find({ Quantity: { $lt: minQty } });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = getRestock;
