import http from 'node:http';
import app from './app';
import env from './env.config';

const server = http.createServer(app);
const port = env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
