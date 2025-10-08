const express = require('express')
const auth = require('../middlewares/auth')
const { getOrders, getOrder, createOrder, deliverOrder, finishOrder, prepareOrder } = require('../controllers/order.controller')
const router = express.Router()

router.get('/', auth('preparer'), getOrders)
router.get('/:id', auth('admin'), getOrder)
router.post('/', auth('user'), createOrder)
router.put('/:id/finish', auth('preparer'), finishOrder)
router.put('/:id/prepare', auth('admin'), prepareOrder)
router.put('/:id/deliver', auth('preparer'), deliverOrder)

module.exports = router