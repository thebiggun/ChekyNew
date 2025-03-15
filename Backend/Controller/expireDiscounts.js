const cron = require("node-cron");
const Inventory = require("../Schema/Inventory");

console.log("✅ Scheduled job started to check expired products...");

const checkAndExpireDiscounts = async () => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const expiredProducts = await Inventory.updateMany(
            { ExpiryDate: { $lt: today }, FlashPrice: { $ne: -1 } },
            { $set: { FlashPrice: -1, Quantity: 0, ExpiryDate: "" } } // Reset ExpiryDate to empty string
        );

        console.log(`🕒 Updated ${expiredProducts.modifiedCount} expired products.`);
    } catch (error) {
        console.error("❌ Error updating expired products:", error);
    }
};

// Run the cron job every day at midnight
cron.schedule("0 0 * * *", checkAndExpireDiscounts);

module.exports = checkAndExpireDiscounts;
