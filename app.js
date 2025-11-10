const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const setupSwagger = require('./swagger')

app.set('trust proxy', 1)
app.use(express.json())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}))
app.use(helmet())
app.use(cors())

app.use('/api/products', require('./routes/product.routes.js'))
app.use('/api/orders', require('./routes/order.routes.js'))
app.use('/api/menus', require('./routes/menu.routes.js'))
app.use('/api/users', require('./routes/user.routes.js'))

setupSwagger(app)

module.exports = app