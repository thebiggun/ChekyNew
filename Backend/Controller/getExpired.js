const Inventory = require("../Schema/Inventory");

const getExpired = async (req, res) => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + 3);

    try {
        const expiringProducts = await Inventory.find({
            ExpiryDate: { 
                $ne: "", 
                $exists: true, 
                $lte: thresholdDate.toISOString().split('T')[0] 
            }
        });

        res.json(expiringProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expiring products', error });
    }
};

module.exports = getExpired;
