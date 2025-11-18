const express = require('express')
const auth = require('../middlewares/auth')
const { getOrders, getOrder, createOrder, deliverOrder, finishOrder, prepareOrder } = require('../controllers/order.controller')
const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Orders manager
 */

/**
 * @swagger
 *  /api/orders:
 *      get:
 *          summary: Get orders
 *          description: >
 *              Return orders depend on the user's role
 *          tags: [Orders]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: list of orders
 */
router.get('/', auth('preparer', 'admin'), getOrders)

/**
 * @swagger
 *  /api/orders/:id:
 *      get:
 *          summary: Get order
 *          tags: [Orders]
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
 *                  description: order details
 *              400:
 *                  description: id not valid
 */
router.get('/:id', auth('admin'), getOrder)

/**
 * @swagger
 *  /api/orders:
 *      post:
 *          summary: Create order
 *          tags: [Orders]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - menu
 *                          properties:
 *                              menu:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: order created
 *              400:
 *                  description: required fields missing
 */
router.post('/', auth('user'), createOrder)

/**
 * @swagger
 *  /api/orders/:id/finish:
 *      put:
 *          summary: Finish order
 *          tags: [Orders]
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
 *                  description: order finished
 *              400:
 *                  description: id not valid
 */
router.put('/:id/finish', auth('preparer'), finishOrder)

/**
 * @swagger
 *  /api/orders/:id/prepare:
 *      put:
 *          summary: Prepare order
 *          tags: [Orders]
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
 *                  description: order prepared
 *              400:
 *                  description: id not valid
 */
router.put('/:id/prepare', auth('admin'), prepareOrder)

/**
 * @swagger
 *  /api/orders/:id/deliver:
 *      put:
 *          summary: Deliver order
 *          tags: [Orders]
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
 *                  description: order delivered
 *              400:
 *                  description: id not valid
 */
router.put('/:id/deliver', auth('preparer'), deliverOrder)

module.exports = router