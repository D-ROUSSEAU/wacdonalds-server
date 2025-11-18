const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    type: {type: String, required: true},
    item: {type: mongoose.Schema.Types.ObjectId},
    price: {type: Number, required: true}
}, {timestamps: true})

module.exports = mongoose.model('Orders_items', productSchema, 'orders_items')