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
      this.logger.info('found match route , execute tunnel:', {
        requests,
        route,
      });

      const response = await this.proxyTunnel(requests, route);
      if (response) {
        this.storage.saveData(requests, response);
        return response;
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
    return {
      ...requests,
      targetUrl: '',
      isProxied: true,
      dateDate: new Date(),
      additionData: route,
    };
  }
  private async proxyTunnel(
    requests: IRequestData,
    route: IRoute
  ): Promise<IResponseData> {
    try {
      const headers = { ...requests.headers };
      let requestUrl = route.proxyUrl;
      if (route.forwardPath) {
        requestUrl = route.proxyUrl + requests.originalUrl;
      }

      this.logger.info('Original request URL: %s', requests.originalUrl);
      this.logger.info('Sending request using tunnel %s', requestUrl);

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

      console.log('Header sent', headers);
      // console.log(requests.body);
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
      console.log('api response headers', response.headers);
      return {
        targetUrl: requestUrl,
        body: response.data,
        headers: response.headers,
        isProxied: true,
        dateDate: new Date(),
      };
    } catch (err) {
      this.logger.error('Tunnel Error %s', err.message || '', err);
    }
    return null;
  }
}
