const express = require('express')
const auth = require('../middlewares/auth')
const { register, login, getUsers } = require('../controllers/user.controller')
const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users manager
 */

/**
 * @swagger
 *  /api/users/register:
 *      post:
 *          summary: Register user
 *          tags: [Users]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - email
 *                              - password
 *                          properties:
 *                              id:
 *                                  type: string
 *                              password:
 *                                  type: string
 *          responses:
 *              400:
 *                  description: email or paswword invalid
 *              201:
 *                  description: user registered
 */
router.post('/register', register)

/**
 * @swagger
 *  /api/users/login:
 *      post:
 *          summary: Login in user
 *          tags: [Users]
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - email
 *                              - password
 *                          properties:
 *                              id:
 *                                  type: string
 *                              password:
 *                                  type: string
 *          responses:
 *              400:
 *                  description: email or paswword invalid
 *              201:
 *                  description: user loged in
 */
router.post('/login', login)

/**
 * @swagger
 *  /api/users:
 *      get:
 *          summary: Get products
 *          tags: [Users]
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: list of users
 */
router.get('/', auth('admin'), getUsers)

module.exports = router