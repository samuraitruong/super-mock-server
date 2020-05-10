import { IRequestData, IResponseData, IRoute } from '../models/index';
import Axios, { AxiosInstance, Method } from 'axios';
import { getLogger, Logger } from '../common/logger';
import { Storage } from '../data/storage';
import qs from 'qs';

export class ProxyService {
  private http: AxiosInstance;
  private logger: Logger;
  constructor(private routes: IRoute[], private storage: Storage) {
    this.http = Axios.create({});
    this.logger = getLogger();
    this.logger.info('Initial service with routes', routes);
  }

  public async handleRequest(requests: IRequestData): Promise<IResponseData> {
    const route = this.routes.find(
      (x) =>
        x.method.some(
          (m) => m.toLocaleLowerCase() == requests.method.toLocaleLowerCase()
        ) && requests.originalUrl.match(new RegExp(x.reqUrl, 'i'))
    );

    if (route) {
      this.logger.info('Found matched route, tunnel request using route:', {
        route,
        requests,
      });

      const responseData = await this.proxyTunnel(requests, route);
      if (responseData) {
        this.storage.saveData(requests, responseData);
        return responseData;
      } else {
        this.logger.info(
          'Could not retrieve data from proxy, using cache data instead'
        );
        const existingData = this.storage.getData(requests);
        if (existingData) {
          return existingData;
        } else {
          this.logger.info(
            'No cache data found, maybe using default if it has been set'
          );
        }
      }
    }
    this.logger.warn('No custom route for %s', requests.originalUrl);

    // Read data from storage data
    // TODO return default data
    return {
      ...requests,
      targetUrl: '',
      isProxied: true,
      dateDate: new Date(),
      additionData: route,
      statusCode: 200,
    };
  }
  private getForwardUrl(route: IRoute, originalUrl) {
    let requestUrl = route.proxyUrl;
    if (route.forwardPath) {
      requestUrl = route.proxyUrl + originalUrl;
      if (route.pathUpdates) {
        for (const key in route.pathUpdates) {
          if (route.pathUpdates.hasOwnProperty(key)) {
            const value = route.pathUpdates[key];
            requestUrl = requestUrl.replace(key, value);
          }
        }
      }
    }
    return requestUrl;
  }

  private prepareForwardHeader(headers: any) {
    [
      'connection',
      'host',
      'cookie',
      'accept-encoding',
      'content-length',
      'cache-control',
    ].forEach((header) => {
      delete headers[header];
    });
    return headers;
  }
  private async proxyTunnel(
    requests: IRequestData,
    route: IRoute
  ): Promise<IResponseData> {
    try {
      const headers = this.prepareForwardHeader(requests.headers);
      const requestUrl = this.getForwardUrl(route, requests.originalUrl);
      this.logger.info('Original request URL: %s', requests.originalUrl);
      this.logger.info('Sending request using tunnel %s', requestUrl);

      let data = requests.body;
      if (headers['content-type'] === 'application/x-www-form-urlencoded') {
        data = qs.stringify(data);
        this.logger.info('urlencoded content sent %s', data);
      }
      const response = await this.http.request({
        url: requestUrl,
        method: requests.method as Method,
        data,
        headers,
        params: requests.query,
      });
      this.logger.info('Proxy alive %s', route.proxyUrl);
      this.logger.debug('api response headers', response.headers);
      return {
        targetUrl: requestUrl,
        body: response.data,
        headers: response.headers,
        isProxied: true,
        dateDate: new Date(),
        statusCode: response.status,
      };
    } catch (err) {
      this.logger.error('Tunnel Error %s', err.message || '', err);
    }
    return null;
  }
}
