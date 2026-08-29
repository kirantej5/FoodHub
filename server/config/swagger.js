import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodHub API',
      version: '1.0.0',
      description: 'Production-ready REST API for the FoodHub online food ordering platform',
      contact: { name: 'FoodHub', email: 'support@foodhub.com' },
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
