import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Real-Time Chat Application API',
      version: '1.0.0',
      description: 'REST API documentation for the Real-Time Chat Application',
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },

  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
