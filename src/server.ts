import https from 'node:https';
import { config } from 'dotenv';
import minimist from 'minimist';
import app from './app';

const { env } = minimist(process.argv.slice(2));
const server = https.createServer(app);

config({
  path: `./.env${env ? `.${env}` : ''}`,
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
