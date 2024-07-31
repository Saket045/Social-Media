import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoute from './routes/auth.routes.js'
import userRoute from './routes/user.routes.js'
import postRoute from './routes/post.routes.js'
import notificationRoute from './routes/notification.routes.js'
import connectToMongoDB from './db/connetMongoDB.js'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app=express();
app.use(cors());
const PORT=process.env.PORT || 5001;
app.use(express.json({limit:"5mb"}));//to parse data upto 5mb/ limit must not be large to prevent DoS attacks
app.use(express.urlencoded({extended:true}));//to parse form data
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/notifications",notificationRoute);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectToMongoDB();
})
