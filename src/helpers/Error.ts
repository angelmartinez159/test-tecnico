import { color } from 'console-log-colors';
import { enviroment } from '../config';
const errors = require('../errors/index.json');

export const Error = (err: string, code: string, res: any) => {
    let errorData: any;

    if (errors[code]) {
        errorData = errors[code];
    } else {
        errorData = errors['UNEXPECTED_ERROR'];
    }

    let error: string =
        color.red('ERROR :: ') + color.yellow(errorData.message);

    console.log(error);
    if (enviroment.env === 'development') {
        console.log(err);
    }

    res.status(errorData.status).json(errorData);
};
