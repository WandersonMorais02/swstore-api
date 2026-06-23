import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Digital Commerce API',
      version: '1.0.0',
      description: 'API para marketplace de produtos digitais, físicos e híbridos.'
    },

    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Local'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },

        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'digital_commerce_token'
        }
      }
    },

    security: [
      {
        bearerAuth: []
      },
      {
        cookieAuth: []
      }
    ]
  },

  apis: [
    './src/modules/**/*.routes.js',
    './src/docs/**/*.js'
  ]
})
