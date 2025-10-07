const express = require('express')
const connectDB = require('./config/database.js')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')
dotenv.config()
connectDB()

app.use(express.json())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}))
app.use(helmet())
app.use(cors())

// Routes
app.use('/api/products', require('./routes/product.routes.js'))
app.use('/api/orders', require('./routes/order.routes.js'))
app.use('/api/menus', require('./routes/menu.routes.js'))
app.use('/api/users', require('./routes/user.routes.js'))

// Listen
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
