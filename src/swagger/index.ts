import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { color } from 'console-log-colors';

export const initSwagger = (app: any): any => {
    const config = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Test Express API with Swagger',
                version: '0.1.0',
                description:
                    'This is a simple CRUD API application made with Express and documented with Swagger',
                contact: {
                    name: 'Angel Martinez',
                    url: 'https://amartinez.web.app',
                    email: 'angelmartinezwb@gmail.com',
                    servers: { url: 'http://localhost:8000' },
                },
            },
            servers: [
                {
                    url: 'http://localhost:8000',
                },
            ],
        },
        apis: ['src/routers/*.ts'],
    };

    try {
        const specs = swaggerJsDoc(config);

        app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

        console.log(color.blue('Swagger initialized'));
    } catch (e) {
        console.log(color.red('Error initializing Swagger'));
    }

    return app;
};
