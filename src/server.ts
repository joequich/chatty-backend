import http from 'node:http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import { initializeGateways } from './bootstrap';
import corsConfig from './common/config/cors.config';
import env from './common/config/env.config';

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: corsConfig,
});

initializeGateways(io);

const { port } = env;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
