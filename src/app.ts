import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import morgan from 'morgan';
import corsConfig from './cors';
import env from './env.config';
import routes from './routes';

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors(corsConfig));
app.use(cookieParser());

app.get('/about', (_, res) => {
  res.send({ version: env.api.version });
});

app.use(env.api.prefix, routes);

export default app;
