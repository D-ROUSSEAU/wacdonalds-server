const connectDB = require('./config/database.js')
const app = require('./app')
const dotenv = require('dotenv')
const PORT = process.env.PORT

dotenv.config()
connectDB()

// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`)
// })

module.exports = app