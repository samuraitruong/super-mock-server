import { IRequestData, IResponseData } from '../models/index';
import hash from 'object-hash';
import path from 'path';
import fs from 'fs-extra';

export class Storage {
  constructor(private rootFolder: string) {
    this.ensureFolder(rootFolder);
  }
  public saveData(request: IRequestData, response: IResponseData) {
    fs.writeJSONSync(this.getFileName(request), response);
  }
  public getData(request: IRequestData) {
    try {
      return fs.readJsonSync(this.getFileName(request));
    } catch (err) {
      return null;
    }
  }
  private getFileName(request: IRequestData) {
    const clone = { ...request };
    clone.headers['authorization'] = null;
    const requestHash = hash(clone);
    return path.join(this.rootFolder, requestHash + '.json');
  }
  private ensureFolder(folder) {
    if (!fs.pathExistsSync(folder)) {
      fs.ensureDirSync(folder);
    }
  }
}
