import { color } from 'console-log-colors';
import mongoose from 'mongoose';
import { dbConfig } from '../config';

// Set Mongo Connection URI, use process.env.NODE_ENV to change config
const dbUri: string =
    'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name;

const initDatabase = async () => {
    try {
        return await mongoose.connect(dbUri, (err) => {
            if (err) {
                console.log(
                    color.red('Error connect database :: '),
                    color.yellow(err)
                );
            } else {
                console.log(
                    color.blue('Database connected to :: '),
                    color.yellow(dbUri)
                );
            }
        });
    } catch (e) {
        return console.log(e);
    }
};

export default initDatabase;
