const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
    name: {type: String, required: true}
}, {timestamps: true})

module.exports = mongoose.model('Menus', menuSchema, 'menus')