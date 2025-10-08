const express = require('express')
const auth = require('../middlewares/auth')
const { getMenus, createMenu, getMenu, editMenu, deleteMenu } = require('../controllers/menu.controller')
const router = express.Router()

router.use(auth('admin'))

router.get('/', getMenus)
router.get('/:id', getMenu)
router.post('/', createMenu)
router.put('/:id', editMenu)
router.delete('/:id', deleteMenu)

module.exports = router