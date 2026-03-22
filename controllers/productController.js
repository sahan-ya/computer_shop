import product from '../models/product.js'
export function createProduct(req, res) {

    console.log(req.user)

    res.status(200).json({
        message : "Product created successfully"
    })
}