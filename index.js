import express from 'express'
import mongoose from "mongoose"
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import authorizeUser from './lib/jwtMiddleware.js'
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config()
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const mongoURL = process.env.MONGO_URI

mongoose.connect(mongoURL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });

const app = express()

app.use(cors()) //block req from browsers 

app.use(express.json()) // Middleware to parse JSON bodies of incoming requests

//app.use(authorizeUser) // Middleware to verify JWT tokens for protected routes



app.use("/api/users", userRouter);// Use the userRouter for routes starting with /users
app.use("/api/products", authorizeUser, productRouter); // Use the productRouter for routes starting with /products

app.listen(5000,
    ()=>{
        console.log("Server is running on port 5000")
    }
)