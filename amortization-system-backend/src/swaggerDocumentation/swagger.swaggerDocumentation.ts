import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DevChickenBros API',
            version: '1.0.0',
            description: 'API para la gestión del sistema de amortización de DevChickenBros',
            contact: {
                name: 'Ariel Navas',
                email: 'arielnavas05@gmail.com',
            },
            servers: [
                {
                    url: 'http://localhost:3001',
                    description: 'Local server'
                }
            ]
        }
    },
    //Especifico donde va a buscar la definicion de las APIs
    apis: ['./src/routes/*.ts'],
};

const openapiSpecification  = swaggerJsdoc(options);
export default openapiSpecification ;