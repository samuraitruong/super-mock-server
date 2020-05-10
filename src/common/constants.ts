import path from 'path';
export const ENV = {
  TEST : 'test',
  DEV : 'development',
  PROD : 'production'
}
export const Constants = {
  PORT: parseInt(process.env.PORT) || 4040,
  StoragePath: process.env.STORAGE_PATH || path.resolve('.cache'),
  ConfigPath: process.env.CONFIG_PATH || path.resolve('./configs'),
  jsonContentTypes: [],
};
