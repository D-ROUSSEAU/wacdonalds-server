const express = require('express')
const auth = require('../middlewares/auth')
const { getMenus, createMenu, getMenu, editMenu, deleteMenu } = require('../controllers/menu.controller')
const router = express.Router()

router.get('/', auth('user'), getMenus)
router.get('/:id', auth('user'), getMenu)
router.post('/', auth('admin'), createMenu)
router.put('/:id', auth('admin'), editMenu)
router.delete('/:id', auth('admin'), deleteMenu)

module.exports = router