const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    status: {type: String, default: ''},
    items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Orders_items'}]
}, {timestamps: true})

module.exports = mongoose.model('Orders', orderSchema, 'orders')