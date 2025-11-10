const connectDB = require('./config/database.js')
const app = require('./app')
const dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT

connectDB()

// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`)
// })

module.exports = app