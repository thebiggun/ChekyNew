const Inventory = require("../Schema/Inventory");

const updateFlashPrice = async (req, res) => {
    const { GTIN, FlashPrice } = req.body;

    try {
        const updatedItem = await Inventory.findOneAndUpdate(
            { GTIN },
            { FlashPrice },
            { new: true, upsert: true }
        );

        res.json({ message: 'Discount updated successfully', updatedItem });
    } catch (error) {
        res.status(500).json({ message: 'Error updating discount', error });
    }
};

module.exports = updateFlashPrice;