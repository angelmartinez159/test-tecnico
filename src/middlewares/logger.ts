import express from 'express';
import moment from 'moment-timezone';
import { color, log } from 'console-log-colors';

const consoleTrack = (req: any, res: any, next: any) => {
    let startString: string;

    const now: any = moment().utc();

    const startTime: string = now.format('DD/MM/YY hh:mm:ss');

    const method: string = req.method;
    const origin: string = req.get('host');
    const route: string = req.url;

    res.on('finish', () => {
        let statusCode: string;
        let timing: string = '';

        const responseTime: number = moment().utc().diff(now);

        if (responseTime < 400) {
            timing = color.green(responseTime + ' ms ');
        } else if (responseTime >= 400 && responseTime <= 1000) {
            timing = color.yellow(responseTime + ' ms ');
        } else if (responseTime >= 1000) {
            timing = color.red(responseTime + ' ms ');
        }

        if (res?.data?.error || res.statusCode >= 400) {
            startString = color.red('ERROR :: ');
            statusCode = color.red(res.statusCode + ' ');
        } else {
            startString = color.green('SUCCESS :: ');
            statusCode = color.green(res.statusCode + ' ');
        }

        console.log(
            startString +
                ' From: ' +
                color.yellow('"') +
                origin +
                ' - ' +
                startTime +
                color.yellow('"') +
                ' To: ' +
                color.yellow('"') +
                method +
                ': ' +
                route +
                color.yellow('"') +
                ' Status Code: ' +
                statusCode +
                ' Response Time: ' +
                timing
        );
    });

    next();
};

export default consoleTrack;
