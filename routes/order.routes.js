const express = require('express')
const { getOrders, getOrder, createOrder, deliverOrder, finishOrder, prepareOrder } = require('../controllers/order.controller')
const router = express.Router()

router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/', createOrder)
router.put('/:id/finish', finishOrder)
router.put('/:id/prepare', prepareOrder)
router.put('/:id/deliver', deliverOrder)

module.exports = router