const express = require('express')
const auth = require('../middlewares/auth')
const { getProducts } = require('../controllers/product.controller')
const router = express.Router()

router.get('/', auth('user'), getProducts)

module.exports = router