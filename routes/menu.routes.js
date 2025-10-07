const express = require('express')
const auth = require('../middlewares/auth')
const { getMenus } = require('../controllers/menu.controller')
const router = express.Router()

router.get('/', auth('user'), getMenus)

module.exports = router