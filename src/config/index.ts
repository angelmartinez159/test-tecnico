import dotenv from 'dotenv';

dotenv.config();

export const dbConfig: any = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
};

export const exchangeConfig: any = {
    baseUrl: process.env.EXCHANGE_BASE_URL,
    apiKey: process.env.EXCHANGE_API_KEY,
};

export const enviroment: any = {
    env: process.env.NODE_ENV,
    baseUrl: process.env.BASE_URL,
};

export const corsConfig: any = {
    origins: process.env.ORIGINS.split(','),
}
