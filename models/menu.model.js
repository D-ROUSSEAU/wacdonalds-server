const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: ''},
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}],
    price: {type: Number,  default: 5, min: 0}
}, {timestamps: true})

module.exports = mongoose.model('Menus', menuSchema, 'menus')