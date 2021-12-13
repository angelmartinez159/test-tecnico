import { color } from 'console-log-colors';
import express from 'express';
import initDatabase from './database';
import logger from './middlewares/logger';
import { initRoutes } from './routers';

// App settings
const app = express();

// Before middlewares
app.use(logger);

// Init database
initDatabase();

// Init routes
app.use('/', initRoutes());

// After middlewares

// Init server
app.listen(process.env.PORT, () => {
    try {
        console.log(
            color.green('Listening on port :: '),
            color.blue(process.env.PORT)
        );
    } catch (e) {
        console.log(color.red('Error init server :: '), process.env.PORT);
    }
});
