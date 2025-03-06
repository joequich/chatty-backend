import bodyParser from 'body-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import morgan from 'morgan';
import routes from './routes';

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors(require('./cors')));

app.get('/', (req, res) => {
  res.send('my-api');
});

app.use('/api', routes);

export default app;
