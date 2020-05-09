export interface IProxyData {
  body: any;
  headers: any;
}
export interface IRequestData extends IProxyData {
  originalUrl: string;
  method: string;
  query?: any;
}
export interface IResponseData extends IProxyData {
  targetUrl: string;
  isProxied: boolean;
  dateDate: Date;
  additionData?: any;
}

export interface IRoute {
  reqUrl: string;
  method: string[];
  proxyUrl: string;
  forwardPath?: boolean;
}
