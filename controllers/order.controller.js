const { default: mongoose } = require("mongoose")
const Orders = require("../models/order.model")

exports.getOrders = async (req, res) => {
    try {
        const orders = await Orders.find()

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
        const { status, menus } = req.body

        if(!status || !menus)
            return res.status(400).json({error: 'Please fill in the required fields'})

        const order = new Orders({
            status,
            menus
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
        res.status(500).json({ error: "An error occurred while deliver the order" })
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
        res.status(500).json({ error: "An error occurred while deliver the order" })
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
        res.status(500).json({ error: "An error occurred while deliver the order" })
    }
}