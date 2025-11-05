const express = require('express')
const auth = require('../middlewares/auth')
const { getMenus, createMenu, getMenu, editMenu, deleteMenu } = require('../controllers/menu.controller')
const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Menus
 *  description: Menus manager
 */


/**
 * @swagger
 *  /api/menus:
 *      get:
 *          summary: Get menus
 *          tags: [Menus]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: list of menus
 */
router.get('/', auth('user'), getMenus)

/**
 * @swagger
 *  /api/menus/:id:
 *      get:
 *          summary: Get menu
 *          tags: [Menus]
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
 *                  description: menu details
 *              400:
 *                  description: id not valid
 */
router.get('/:id', auth('user'), getMenu)

/**
 * @swagger
 *  /api/menus:
 *      post:
 *          summary: Create menu
 *          tags: [Menus]
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
 *                              - products
 *                          properties:
 *                              name:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              products:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *          responses:
 *              200:
 *                  description: menu created
 *              400:
 *                  description: required fields missing
 */
router.post('/', auth('admin'), createMenu)

/**
 * @swagger
 *  /api/menus:
 *      put:
 *          summary: Edit menu
 *          tags: [Menus]
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
 *                              products:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *          responses:
 *              200:
 *                  description: menu edited
 *              404:
 *                  description: menu not found
 */
router.put('/:id', auth('admin'), editMenu)

/**
 * @swagger
 *  /api/menus:
 *      delete:
 *          summary: Delete menu
 *          tags: [Menus]
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
 *                  description: menu deleted
 *              404:
 *                  description: menu not found
 */
router.delete('/:id', auth('admin'), deleteMenu)

module.exports = router