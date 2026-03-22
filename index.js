import express from 'express'
import mongoose from "mongoose"
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import jwtMiddleware from './middleware/jwtMiddleware.js'




const mongoURL = "mongodb+srv://admin:1234@cluster0.xqjypbq.mongodb.net/?appName=Cluster0"

mongoose.connect(mongoURL).then(
    ()=>{
        console.log("Connected to MongoDB")  
    }
).catch(
    ()=>{
        console.log("Error connecting to MongoDB")
    }
)


const app = express()

app.use(express.json()) // Middleware to parse JSON bodies of incoming requests

app.use(jwtMiddleware()) // Middleware to verify JWT tokens for protected routes




app.use("/users", userRouter) // Use the userRouter for routes starting with /users
app.use("/products", productRouter) // Use the productRouter for routes starting with /products

app.listen(3000,
    ()=>{
        console.log("Server is running on port 3000")
    }
)