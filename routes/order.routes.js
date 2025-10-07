const express = require('express')
const auth = require('../middlewares/auth')
const { getOrders } = require('../controllers/order.controller')
const router = express.Router()

router.get('/', auth('user'), getOrders)

module.exports = router