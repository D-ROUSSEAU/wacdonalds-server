const connectDB = require('./config/database.js')
const app = require('./app')
const dotenv = require('dotenv')
const cors = require('cors')
const PORT = process.env.PORT

dotenv.config()
connectDB()

app.use(cors())
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
