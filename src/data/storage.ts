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
    fs.writeJSONSync(this.getFileName(request, response.statusCode), response);

    fs.writeJSONSync(
      this.getFileName({ requestUrl: request.originalUrl }),
      response
    );
  }
  public getData(request: IRequestData) {
    try {
      return fs.readJsonSync(this.getFileName(request));
    } catch (err) {
      return null;
    }
  }
  private getFileName(request: any, statusCode = null) {
    const clone = { ...request };
    if (clone.headers) {
      clone.headers['authorization'] = null;
    }
    const requestHash = hash(clone);
    if (statusCode) {
      return path.join(
        this.rootFolder,
        requestHash + '_' + statusCode + '.json'
      );
    }
    return path.join(this.rootFolder, requestHash + '.json');
  }
  private ensureFolder(folder) {
    if (!fs.pathExistsSync(folder)) {
      fs.ensureDirSync(folder);
    }
  }
}
