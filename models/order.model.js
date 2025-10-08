const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    status: {type: String, default: ''},
    menus: [{type: mongoose.Schema.Types.ObjectId, ref: 'Menus'}]
}, {timestamps: true})

module.exports = mongoose.model('Orders', orderSchema, 'orders')