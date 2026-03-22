import express from 'express'
import { createProduct } from '../controllers/productController'

const productRouter = express.Router()

productRouter.post("/products", createProduct)

export default productRouter
