const { default: mongoose } = require("mongoose")
const Menus = require("../models/menu.model")

exports.getMenus = async (req, res) => {
    try {
        const menus = await Menus.find()

        res.status(200).json(menus)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the menus" })
    }
}

exports.getMenu = async (req, res) => {
    try {
        const id = req.params.id
        
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({error: 'ID not valid'})

        const menu = await Menus.findById(id)

        res.status(200).json(menu)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the menu" })
    }
}

exports.createMenu = async (req, res) => {
    try {
        const { name, description, products } = req.body

        if(!name || !description || !products)
            return res.status(400).json({error: 'Please fill in the required fields'})

        const menu = new Menus({
            name,
            description,
            products
        })
    
        const savedMenu = await menu.save()
    
        res.status(200).json(savedMenu)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while create the menu" })
    }
}

exports.editMenu = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, products } = req.body
        const menu = await Menus.findById(id)

        if(!menu)
            return res.status(404).json({error: 'Product not find'})

        if(name)
            menu.name = name

        if(description)
            menu.description = description

        if(products)
            menu.products = products

        const editMenu = await menu.save()

        res.json(editMenu)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while edit the menu" })
    }
}

exports.deleteMenu = async (req, res) => {
    try {
        const { id } = req.params
        const menu = await Menus.findById(id)

        if(!menu)
            return res.status(404).json({error: 'Menu not find'})

        await menu.deleteOne()

        res.json({message: 'Menu deleted'})
    } catch (error) {
        res.status(500).json({ error: "An error occurred while delete the menu" })
    }
}