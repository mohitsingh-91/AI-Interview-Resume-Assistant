const mongoose=require("mongoose");
require("dotenv").config();
exports.dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DATABASE CONNECTED SUCCESSFULLY");
    })
    .catch((error)=>{
        console.log("ERROR IN DATABASE CONNECTION");
        console.error(error);
        process.exit(1);
    })
}