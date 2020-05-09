import express, { Application, Request, Response, NextFunction } from 'express';
import { Logger, getLogger } from './common/logger';
import { ProxyController } from './controller/proxyController';
import { ProxyService } from './services/proxyService';
import bodyParser from 'body-parser';

export class ApiServer {
  private app: Application;
  private logger: Logger;
  private proxyController: ProxyController;

  constructor(service: ProxyService) {
    this.proxyController = new ProxyController(service);
    this.logger = getLogger();
    this.app = express();
    this.initialize();
  }

  public start(port: number) {
    this.app.listen(port, () => {
      this.logger.info('Mock API Server listening on port: %d', port);
    });
  }
  private initialize() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded());

    this.app.use('*', this.proxyController.handleRequest());

    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        res.status(500);
        this.logger.error('Internal server error when process request', {
          error,
          requestUrl: req.originalUrl,
        });
        res.send('INTERNAL SERVER ERROR');
      }
    );
  }
}
