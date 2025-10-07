const express = require('express')
const { getOrders } = require('../controllers/order.controller')
const router = express.Router()

router.get('/', getOrders)

module.exports = router