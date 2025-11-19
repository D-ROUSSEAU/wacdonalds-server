const { default: mongoose } = require("mongoose")
const Orders = require("../models/order.model")
const Orders_items = require("../models/order_item.model")

exports.getOrders = async (req, res) => {
    try {
        const userRole = req.user.role
        let filter = {}

        if (userRole === "preparer")
            filter.status = "prepared"
        else if (userRole === "admin")
            filter.status = { $in: ["finished", "delivered", ""] }

        const orders = await Orders.find(filter);

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the orders" })
    }
}

exports.getOrder = async (req, res) => {
    try {
        const id = req.params.id
                
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({error: 'ID not valid'})

        const order = await Orders.findById(id)
        
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the order" })
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { menus, items } = req.body

        if(!menus && !items)
            return res.status(400).json({error: 'Please fill in the required fields'})

        const orderItemsIds = []

        if(menus)
            for (const menu of menus) {
            const orderItem = new Orders_items({
                    type: 'menu',
                    item: menu._id,
                    price: menu.price
                })

                const savedOrderItem = await orderItem.save()

                orderItemsIds.push(savedOrderItem._id)
            }

        if(items)
            for (const item of items) {
            const orderItem = new Orders_items({
                    type: 'product',
                    item: item._id,
                    price: item.price
                })

                const savedOrderItem = await orderItem.save()

                orderItemsIds.push(savedOrderItem._id)
            }

        const order = new Orders({
            items: orderItemsIds
        })
    
        const savedOrder = await order.save()
    
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while create the order" })
    }
}

exports.finishOrder = async (req, res) => {
    try {
        const id = req.params.id
                
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({error: 'ID not valid'})

        const order = await Orders.findById(id)

        order.status = 'finished'

        const editOrder = await order.save()
        
        res.status(200).json(editOrder)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while finishing the order" })
    }
}

exports.prepareOrder = async (req, res) => {
    try {
        const id = req.params.id
                
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({error: 'ID not valid'})

        const order = await Orders.findById(id)

        order.status = 'prepared'

        const editOrder = await order.save()
        
        res.status(200).json(editOrder)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while preparing the order" })
    }
}

exports.deliverOrder = async (req, res) => {
    try {
        const id = req.params.id
                
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({error: 'ID not valid'})

        const order = await Orders.findById(id)

        order.status = 'delivred'

        const editOrder = await order.save()
        
        res.status(200).json(editOrder)
    } catch (error) {
        res.status(500).json({ error: "An error occurred while delivering the order" })
    }
}