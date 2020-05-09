import { Request, Response, NextFunction } from 'express';
import { ProxyService } from '../services/proxyService';

export class ProxyController {
  constructor(private service: ProxyService) {
    if (!service) {
      throw new Error('Missing required proxy service params');
    }
  }
  public handleRequest() {
    const me = this;
    return async (req: Request, res: Response, next: NextFunction) => {
      const { headers, body, originalUrl, method, query } = req;
      const response = await me.service.handleRequest({
        headers,
        query,
        body,
        originalUrl,
        method,
      });
      const contentType = response.headers['content-type'].split(';')[0];
      res.set(response.headers);
      res.type(contentType);
      res.json(response.body);
    };
  }
}
