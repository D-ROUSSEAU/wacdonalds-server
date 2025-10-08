const { default: mongoose } = require("mongoose")
const Products = require("../models/product.model")

exports.getProducts = async (req, res) => {
    try {
        const products = await Products.find()

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the products" })
    }
}

exports.getProduct = async (req, res) => {
    try {
        const id = req.params.id

        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({error: 'ID not valid'})
        
        const product = await Products.findById(id)

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the product" })
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body

        if(!name || !description || !price || !quantity)
            return res.status(400).json({error: 'Please fill in the required fields'})
    
        const image = req.file ? req.file.filename : null

        const product = new Products({
            name,
            description,
            price,
            image,
            quantity
        })
    
        const savedProduct = await product.save()
    
        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while create the product" })
    }
}

exports.editProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, quantity } = req.body
        const image = req.file ? req.file.filename : null
        const product = await Products.findById(id)

        if(!product)
            return res.status(404).json({error: 'Product not find'})

        if(name)
            project.name = name

        if(description)
            project.description = description

        if(price)
            project.price = price

        if(image)
            project.image = image

        if(quantity)
            project.quantity = quantity

        const editProduct = await product.save()

        res.json(editProduct)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while edit the product" })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Products.findById(id)

        if(!product)
            return res.status(404).json({error: 'Product not find'})

        await product.deleteOne()

        res.json({message: 'Product deleted'})
    } catch (error) {
        res.status(500).json({ error: "An error occurred while delete the product" })
    }
}