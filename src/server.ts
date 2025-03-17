import http from 'node:http';
import app from './app';
import env from './common/config/env.config';

const server = http.createServer(app);
const { port } = env;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
