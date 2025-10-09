import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

//There is de suagger options to have  the documentation of this proyect
const options = {
  definition: {
    openapi: "3.0.0", 
    info: {
      title: "API Backend - Proyecto", // título de la API
      version: "1.0.0",                // versión del proyecto
      description: "Documentación de la API con Swagger", // descripción 
    },
    servers: [
      {
        url: "http://localhost:3000/api", // URL base de API
      },
    ],
     components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routers/*.js"], //  indica dónde buscar los comentarios JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
