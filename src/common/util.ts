import fs from 'fs-extra';
import path from 'path';

export function readConfigs(configPath) {
  if (!fs.pathExistsSync(configPath)) {
    throw new Error('The config path is not exist ' + configPath);
  }
  const files = fs.readdirSync(configPath);
  let allRoutes = [];
  for (const file of files) {
    const routes = fs.readJsonSync(path.join(configPath, file));
    allRoutes = [...allRoutes, ...routes];
  }
  return allRoutes;
}
