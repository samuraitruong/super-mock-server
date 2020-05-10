import bootstrapApiServer from './bootstrap';
import { Constants } from './common/constants';

(async () => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  const server = bootstrapApiServer();
  server.start(Constants.PORT);
})();
