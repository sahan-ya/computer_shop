import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";
import authorizeUser, { optionalAuthorizeUser } from "../lib/jwtMiddleware.js"

const productRouter = express.Router();

productRouter.post("/", authorizeUser, createProduct);
productRouter.get("/", optionalAuthorizeUser, getProducts);
productRouter.get("/trending", (req,res)=>{
    res.status(200).json({message:"This is trending products endpoint"})
})
productRouter.delete("/:productId", authorizeUser, deleteProduct);
productRouter.put("/:productId", authorizeUser, updateProduct);
productRouter.get("/:productId", optionalAuthorizeUser, getProductById)
export default productRouter;