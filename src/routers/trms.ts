import { Router, Request, Response } from 'express';
import axios from 'axios';
import { exchangeConfig } from '../config';
import { Error } from '../helpers/Error';
import trmControllers from '../controllers/trm';
import { TRM } from '../types/TRM';
import _ from 'lodash';
const router = Router();

const TRMRouter = (app: Router) => {
    app.use('/trm', router);

    const trmController = new trmControllers();

    /**
     * @swagger
     * /trm/:
     *   get:
     *     summary: Get the latest exchange rate between provided currencies
     *     description: Pass source & target currencies codes into query
     *     tags:
     *       - TRM
     *     parameters:
     *       - target:
     *         name: target
     *         type: string
     *         in: query
     *         required: true
     *         description: Currency string code target
     *       - source:
     *         name: source
     *         type: string
     *         in: query
     *         required: true
     *         description: Currency string code source
     *     responses:
     *       '200':
     *         description: Currency rate getted
     *       '400':
     *         description: No data provided in request query
     *       '404':
     *         description: No data found
     *       '500':
     *         description: Unexpected or database error
     */
    router.get('/', async (req: Request, res: Response, next) => {
        const { source, target } = req.query;

        // Verifying data
        if (!source || !target) {
            Error(
                'Insert exchange data (source & target)',
                'EXCHANGE_NO_DATA_PROVIDED',
                res
            );
            return next();
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
                return next();
            }

            const { data }: any = apiResponse;

            if (!data.result || data.result !== 'success') {
                Error('Failed Response', 'EXCHANGE_REQUEST_FAILED', res);
                return next();
            }

            // Insert data into DB
            try {
                // Parse data format, this is necessary 'cause transferwise is broken
                let newTRM: TRM = {
                    source: data.base_code,
                    target: data.target_code,
                    rate: data.conversion_rate,
                    time: data.time_last_update_utc,
                };
                const inserted: any = await trmController.create(newTRM);

                res.status(200).json({ result: 'success', data: inserted });
                return next();
            } catch (e) {
                Error(e, 'DB_ERROR_INSERTING', res);
                return next();
            }
        } catch (e) {
            Error(e, 'EXCHANGE_REQUEST_FAILED', res);
            return next();
        }
    });

    /**
     * @swagger
     * /trm/list:
     *   get:
     *     summary: Get the latest exchange rate between provided currencies
     *     description: Pass from and limit numbers into query to set pagination
     *     tags:
     *       - TRM
     *     parameters:
     *       - target:
     *         name: target
     *         type: string
     *         in: query
     *         required: false
     *         description: Currency string code target
     *       - source:
     *         name: source
     *         type: string
     *         in: query
     *         required: false
     *         description: Currency string code source
     *       - limit:
     *         name: limit
     *         type: number
     *         in: query
     *         required: true
     *         description: Limit to pagination
     *       - from:
     *         name: from
     *         type: number
     *         in: query
     *         required: true
     *         description: Index from pagination starts
     *     responses:
     *       '200':
     *         description: Paginated list of currencies
     *       '400':
     *         description: No data provided in request query
     *       '404':
     *         description: No data found
     *       '408':
     *         description: Bad query format
     *       '500':
     *         description: Unexpected or database error
     */
    router.get('/list', async (req: Request, res: Response, next) => {
        // Get query params
        const { from, limit, target, source } = req.query;

        // If no required data was provided
        if (!from || !limit) {
            Error(
                'No pagination data found (from & limit)',
                'LIST_NO_DATA_PROVIDED',
                res
            );
            return next();
        }

        const limitNumber: number = parseInt(limit as string);
        const fromNumber: number = parseInt(from as string);

        if (isNaN(limitNumber) || isNaN(fromNumber)) {
            Error(
                'Bad format pagination data (from & limit)',
                'LIST_WRONG_DATA',
                res
            );
            return next();
        }
        // Get list
        try {
            let query: any = {};
            // If target & source was provided
            if (target && source) {
                query = {
                    target,
                    source,
                };
            }

            // Make query to DB
            const data: Array<TRM> = await trmController.findMany(
                { ...query },
                { skip: fromNumber, limit: limitNumber }
            );

            // If no data was returned
            if (!data) {
                Error('No data found', 'LIST_NO_DATA_FOUND', res);
                return next();
            }

            // Response
            res.status(200).json({ result: 'success', data });
            return next();
        } catch (e) {
            // Error handler
            Error('No data found', 'DB_ERROR_GETTING', res);
            return next();
        }
    });
};

export default TRMRouter;
