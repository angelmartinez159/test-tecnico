import { color } from 'console-log-colors';
import mongoose from 'mongoose';
import { dbConfig } from '../config';

const dbUri: string =
    'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name;

const initDatabase = async () => {
    try {
        return await mongoose.connect(dbUri, (err) => {
            if (err) {
                console.log(
                    color.red('Error connect database :: '),
                    color.blue(err)
                );
            } else {
                console.log(
                    color.green('Database connected to :: '),
                    color.blue(dbUri)
                );
            }
        });
    } catch (e) {
        return console.log(e);
    }
};

export default initDatabase;
