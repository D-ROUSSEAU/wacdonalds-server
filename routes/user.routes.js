const express = require('express')
const auth = require('../middlewares/auth')
const { register, login, getUsers } = require('../controllers/user.controller')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/', auth('admin'), getUsers)

module.exports = router