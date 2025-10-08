const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String,  default: ''},
    price: {type: Number,  default: 5, min: 0},
    image: {type: String,  default: ''},
    quantity: {type: Number,  default: 1, min: 0}
}, {timestamps: true})

module.exports = mongoose.model('Products', productSchema, 'products')