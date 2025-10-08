const express = require('express')
const { getProducts, getProduct, createProduct, editProduct, deleteProduct } = require('../controllers/product.controller')
const router = express.Router()
const upload = require('../middlewares/multer')

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', upload.single('image'), createProduct)
router.put('/:id', upload.single('image'), editProduct)
router.delete('/:id', deleteProduct)

module.exports = router