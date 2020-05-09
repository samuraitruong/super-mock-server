import { ApiServer } from './server';
import { ProxyService } from './services/proxyService';
import { Storage } from './data/storage';
import path from 'path';
import { Constants } from './common/constants';
import { readConfigs } from './common/util';
import { getLogger } from './common/logger';

(async () => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  const logger = getLogger();
  logger.info('Cache data will be store at: %s', Constants.StoragePath);
  const storage = new Storage(path.resolve(Constants.StoragePath));
  const routes = readConfigs(Constants.ConfigPath);
  const service = new ProxyService(routes, storage);
  const server = new ApiServer(service);
  server.start(Constants.PORT);
})();
