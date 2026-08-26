const express=require("express");
const cookieParser=require("cookie-parser");
const cors=require("cors");

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173","https://ai-interview-resume-assistant.vercel.app"],
    credentials: true,
  })
);

/** require all the routes here */  
const authRoutes=require("./routes/auth.route");
const interviewRouter = require("./routes/interview.route");

/** using all the routes here */
app.use("/api/auth",authRoutes);
app.use("/api/interview", interviewRouter);

module.exports=app;

