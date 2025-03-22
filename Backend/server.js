const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectMongo = require("./ConnectMongo");
const getProducts = require("./Routes/getProducts");
const addToInventory = require("./Routes/addToInventory");
const getInventory = require("./Routes/getInventory");
const decreaseCount = require("./Routes/decreaseCount");
const getRestock = require("./Routes/getRestock");
const getExpired = require("./Routes/getExpired");
const updateFlashPrice = require("./Routes/updateFlashPrice");
const checkAndExpireDiscounts = require("./Controller/expireDiscounts");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB before running cron
connectMongo().then(() => {
    console.log("✅ MongoDB connected successfully");

    // ✅ Start the cron job to check expired products daily
    checkAndExpireDiscounts();
}).catch((error) => {
    console.error("❌ MongoDB connection error:", error);
});

app.use("/api", getProducts);
app.use("/api", addToInventory);
app.use("/api", getInventory);
app.use("/api", decreaseCount);
app.use("/api", getRestock);
app.use("/api", getExpired);
app.use("/api", updateFlashPrice);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT}`,);
});
