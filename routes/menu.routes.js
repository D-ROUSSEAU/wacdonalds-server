const express = require('express')
const { getMenus, createMenu, getMenu, editMenu, deleteMenu } = require('../controllers/menu.controller')
const router = express.Router()

router.get('/', getMenus)
router.get('/:id', getMenu)
router.post('/', createMenu)
router.put('/:id', editMenu)
router.delete('/:id', deleteMenu)

module.exports = router