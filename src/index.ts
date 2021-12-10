import express from 'express';
import { Request, Response } from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Well done!');
});

app.listen(3000, () => {
    console.log('The application is listening on port 8000!');
});
