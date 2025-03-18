import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import morgan from 'morgan';
import corsConfig from './common/config/cors.config';
import env from './common/config/env.config';
import { errorHandler } from './common/middlewares/error-handler.middleware';
import routes from './routes';

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors(corsConfig));
app.use(cookieParser());

app.get('/about', (_, res) => {
  res.send({ version: env.api.version });
});

// for development
app.use((req, res, next) => {
  const delay = Math.floor(Math.random() * 1000);
  console.log(`Delaying response by ${delay}ms`);
  setTimeout(() => next(), delay);
});

app.use(env.api.prefix, routes);
app.use(errorHandler);

export default app;
