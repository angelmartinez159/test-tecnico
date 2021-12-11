import { color } from 'console-log-colors';
import express from 'express';
import consoleTrack from './middlewares/consoleTrack';
require('dotenv').config();

const app = express();

app.use(consoleTrack);

app.get('/', (req, res) => {
    res.status(200).send('Well done!');
});

app.listen(process.env.PORT, () => {
    try{
        console.log(color.green('Listening on port :: '), color.blue(process.env.PORT));
    }
    catch(e){
        console.log(color.red('Error init server :: '), process.env.PORT);
    }
});
