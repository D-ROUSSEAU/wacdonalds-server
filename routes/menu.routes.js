const express = require('express')
const { getMenus } = require('../controllers/menu.controller')
const router = express.Router()

router.get('/', getMenus)

module.exports = router