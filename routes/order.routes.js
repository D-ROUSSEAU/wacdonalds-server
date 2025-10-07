const express = require('express')
const auth = require('../middlewares/auth')
const { getOrders } = require('../controllers/order.controller')
const router = express.Router()

router.use(auth('user'))

router.get('/', getOrders)

module.exports = router