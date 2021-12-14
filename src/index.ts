import { color } from 'console-log-colors';
import express from 'express';
import initDatabase from './database';
import logger from './middlewares/logger';
import { initRoutes } from './routers';
import cors from 'cors';
import { corsConfig } from './config';
import { initSwagger } from './swagger';
// App settings
const app = express();

app.use(
    cors({
        origin: (origin, cb) => {
            if (corsConfig.origins.includes(origin)) {
                cb(null, { origin: true });
            } else {
                cb(null, { origin: false });
            }
        },
    })
);

initSwagger(app);

// Before middlewares
app.use(logger);

// Init database
initDatabase();

// Init routes
app.use('/', initRoutes());

// Init server
app.listen(process.env.PORT, () => {
    try {
        console.log(
            color.blue('Listening on port :: '),
            color.yellow(process.env.PORT)
        );
    } catch (e) {
        console.log(color.red('Error init server :: '), process.env.PORT);
    }
});
