import cors from 'cors';
import express, { type Application } from 'express';
import morgan from 'morgan';

const app: Application = express();

app.use(morgan('dev'));
app.use(cors(require('./cors')));

app.get('/', (req, res) => {
  res.send('my-api');
});

export default app;
