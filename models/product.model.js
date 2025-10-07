const mongoose = require("mongoose")

const producthema = new mongoose.Schema({
    name: {type: String, required: true}
}, {timestamps: true})

module.exports = mongoose.model('Products', producthema, 'products')