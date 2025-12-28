import express from "express";

const app = express();
app.use(express.json());
// import routers
import userRouter from "../routes/user.route.js"
import postRouter from "../routes/post.route.js"

//routes decleration 
app.use("/api/ver1/users", userRouter); 
app.use("/api/ver1/posts", postRouter);


export default app;