const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Wacdonalds's API",
            version: "1.0.0",
        },
        server: [
            {url: 'http://localhost:3000'}
        ]
    },
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJsDoc(options)

const setupSwagger = (app) => {
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = setupSwagger