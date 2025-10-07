const express = require('express')
const auth = require('../middlewares/auth')
const { getOrders } = require('../controllers/order.controller')
const router = express.Router()

router.use(auth('preparer'))

router.get('/', getOrders)

module.exports = router