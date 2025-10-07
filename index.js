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
app.use('/api/test', (req, res) => {
    res.status(200).json({message: 'Hello World!'})
})

// Listen
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
