import express from 'express';
import { Request, Response } from 'express';
import consoleTrack from './middlewares/consoleTrack';
const app = express();

app.use(consoleTrack);

app.get('/', (req, res) => {
    res.status(200).send('Well done!');
});

app.listen(3000, () => {
    console.log('The application is listening on port 8000!');
});
