const mongoose = require("mongoose")

const userShema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'}
}, {timestamps: true})

/**
 * Roles :
 * User
 * Preparer
 * Admin
 */

module.exports = mongoose.model('User', userShema)