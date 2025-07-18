import { type Server, createServer } from 'node:http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import morgan from 'morgan';
import corsConfig from './common/config/cors.config';
import env, { type EnvConfig } from './common/config/env.config';
import type { DrizzleService } from './database/drizzle.service';
import setupApiRoutes from './routes';
import { SocketManager } from './sockets/socket.manager';

export class App {
  private app: Application;
  private server: Server;
  constructor(
    private readonly env: EnvConfig,
    private readonly drizzleService: DrizzleService,
  ) {
    this.app = express();
    this.server = createServer(this.app);

    this.setupMiddlewares();
    this.setupProcessEvents();
  }

  private setupMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));
    this.app.use(cors(corsConfig));
    this.app.use(cookieParser());
  }

  private setupRoutes() {
    this.app.use((req, res, next) => {
      const delay = Math.floor(Math.random() * 1000);
      console.log(`Delaying response by ${delay}ms`);
      setTimeout(() => next(), delay);
    });

    this.app.use(env.api.prefix, setupApiRoutes(this.env, this.drizzleService));

    this.app.get('/', (req, res) => {
      res.send('OK');
    });
  }

  private setupSocketIO() {
    const socketManager = new SocketManager(
      this.env,
      this.server,
      this.drizzleService,
    );
    socketManager.initialize();
  }

  private setupProcessEvents(): void {
    process.on('SIGINT', async () => {
      console.log('\nSIGINT received. Disconnecting DB and shutting down...');
      await this.drizzleService.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\nSIGTERM received. Disconnecting DB and shutting down...');
      await this.drizzleService.disconnect();
      process.exit(0);
    });
  }

  public async start(): Promise<void> {
    await this.drizzleService.connect();
    this.setupSocketIO();
    this.setupRoutes();

    this.server.listen(this.env.port, () => {
      console.log(`Server is running on port ${this.env.port}`);
    });
  }
}
