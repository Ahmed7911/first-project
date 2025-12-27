import express from "express";

const app = express();
app.use(express.json());
// import routers
import userRouter from "../routes/user.route.js"


//routes decleration 
app.use("/api/ver1/users", userRouter); 


export default app;