import { Router, Request, Response } from 'express';
import axios from 'axios';
import { exchangeConfig } from '../config';
import { Error } from '../helpers/Error';
import trmControllers from '../controllers/trm';

const router = Router();

const TRMRouter = (app: Router) => {
    app.use('/trm', router);

    const trmController = new trmControllers();

    router.get('/', async (req: Request, res: Response, next) => {
        const { source, target } = req.query;

        // Verifying data
        if (!source || !target) {
            Error(
                'Insert exchange data (source & target)',
                'EXCHANGE_NO_DATA_PROVIDED',
                res
            );
            next();
        }

        // Call to ExchangeRates API
        try {
            const apiResponse: any = await axios.get(
                exchangeConfig.baseUrl +
                    exchangeConfig.apiKey +
                    '/pair/' +
                    source +
                    '/' +
                    target,
                {
                    headers: {
                        Authorization: 'Bearer ',
                    },
                }
            );

            // Verifying data from response
            if (!apiResponse || !apiResponse.data) {
                Error('No data', 'EXCHANGE_NO_DATA_FOUND', res);
            }

            const { data }: any = apiResponse;

            if (!data.result || data.result !== 'success') {
                Error('Failed Response', 'EXCHANGE_REQUEST_FAILED', res);
            }

            // Insert data into DB
            try {
                // Parse data to format, this is necessary 'cause transferwise is broken

                trmController.insert(data);
            } catch (e) {
                Error(e, 'DB_ERROR_INSERTING', res);
            }

            res.status(200).send({ message: 'data inserted', data });
            next();
        } catch (e) {
            Error(e, 'EXCHANGE_REQUEST_FAILED', res);
            next();
        }
    });

    router.post('/signup', async (req: Request, res: Response, next) => {
        try {
            res.json();
        } catch (e) {
            if (e.isJoi === true) {
                e.status === 422;
            }
            next();
        }
    });
};

export default TRMRouter;
