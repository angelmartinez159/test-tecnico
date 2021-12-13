import { Router } from 'express';
import TRMRouter from './trms';

export const initRoutes = (): Router => {
    const app: Router = Router();

    TRMRouter(app);

    return app;
};
