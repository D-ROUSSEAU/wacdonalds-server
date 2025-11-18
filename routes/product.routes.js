const express = require('express')
const auth = require('../middlewares/auth')
const { getProducts, getProduct, createProduct, editProduct, deleteProduct } = require('../controllers/product.controller')
const router = express.Router()
const upload = require('../middlewares/multer')

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: Products manager
 */

/**
 * @swagger
 *  /api/products:
 *      get:
 *          summary: Get products
 *          tags: [Products]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: list of products
 */
router.get('/', auth('user', 'admin'), getProducts)

/**
 * @swagger
 *  /api/products/:id:
 *      get:
 *          summary: Get product
 *          tags: [Products]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - id
 *                          properties:
 *                              id:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: product details
 *              400:
 *                  description: id not valid
 */
router.get('/:id', auth('user', 'admin'), getProduct)

/**
 * @swagger
 *  /api/products:
 *      post:
 *          summary: Create product
 *          tags: [Products]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - name
 *                              - description
 *                              - price
 *                              - quantity
 *                          properties:
 *                              name:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              price:
 *                                  type: number
 *                              quantity:
 *                                  type: number
 *                              image:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: product created
 *              400:
 *                  description: required fields missing
 */
router.post('/', auth('admin'), upload.single('image'), createProduct)

/**
 * @swagger
 *  /api/products/:id:
 *      put:
 *          summary: Edit product
 *          tags: [Products]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - id
 *                          properties:
 *                              id:
 *                                  type: string
 *                              name:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              price:
 *                                  type: number
 *                              quantity:
 *                                  type: number
 *                              image:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: product edited
 *              400:
 *                  description: required fields missing
 */
router.put('/:id', auth('admin'), upload.single('image'), editProduct)

/**
 * @swagger
 *  /api/products/:id:
 *      delete:
 *          summary: Delete product
 *          tags: [Products]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - id
 *                          properties:
 *                              id:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: product deleted
 *              404:
 *                  description: product not found
 */
router.delete('/:id', auth('admin'), deleteProduct)

module.exports = router