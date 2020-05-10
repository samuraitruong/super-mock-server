import { Storage } from './data/storage';
import { readConfigs } from './common/util';
import path from 'path';
import { ProxyService } from './services/proxyService';
import { ApiServer } from './server';
import { Constants } from './common/constants';
import { getLogger } from './common/logger';

export default function bootstrapApiServer() {
  const logger = getLogger();
  logger.info('Cache data will be store at: %s', Constants.StoragePath);

  const storage = new Storage(path.resolve(Constants.StoragePath));
  const routes = readConfigs(Constants.ConfigPath);
  const service = new ProxyService(routes, storage);
  const server = new ApiServer(service);
  return server;
}
