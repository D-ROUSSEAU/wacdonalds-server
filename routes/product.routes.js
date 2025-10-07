const express = require('express')
const auth = require('../middlewares/auth')
const { getProducts } = require('../controllers/product.controller')
const router = express.Router()

router.use(auth('user'))

router.get('/', getProducts)

module.exports = router