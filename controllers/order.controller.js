const Orders = require("../models/order.model")

exports.getOrders = async (req, res) => {
    try {
        const orders = await Orders.find()

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the orders" })
    }
}