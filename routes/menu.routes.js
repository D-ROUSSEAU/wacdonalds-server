const express = require('express')
const auth = require('../middlewares/auth')
const { getMenus } = require('../controllers/menu.controller')
const router = express.Router()

router.use(auth('user'))

router.get('/', getMenus)

module.exports = router