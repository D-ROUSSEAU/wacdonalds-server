const Menus = require("../models/menu.model")

exports.getMenus = async (req, res) => {
    try {
        const menus = await Menus.find()

        res.status(200).json(menus)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the products" })
    }
}