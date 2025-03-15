const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectMongo;