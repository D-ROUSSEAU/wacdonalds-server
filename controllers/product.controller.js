const Products = require("../models/product.model")

exports.getProducts = async (req, res) => {
    try {
        const products = await Products.find()

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the products" })
    }
}