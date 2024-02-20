var mongoose = require("mongoose");
mongoose.set("strictQuery", true);

module.exports = async function initDB(MONGO_URL){
    try{
        await mongoose.connect(MONGO_URL)
        console.log("Connected to DB");
    } catch (err) {
        console.log("Error connecting to DB");
        process.exit(0)
    }
}