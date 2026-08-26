const app=require("./src/app");
const connectToDB=require("./src/config/dataBase");
require("dotenv").config();

connectToDB.dbConnect();

const PORT=process.env.PORT || 4000 
app.listen(PORT,()=>{
    console.log("Server is running successfully");
})