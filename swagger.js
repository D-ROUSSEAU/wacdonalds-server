const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const PORT = process.env.PORT
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Wacdonalds's API",
            version: "1.0.0",
        },
        server: [
            {url: `http://localhost:${PORT}`},
            {url: 'https://wacdonalds-server.onrender.com/'}
        ]
    },
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJsDoc(options)

const setupSwagger = (app) => {
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = setupSwagger