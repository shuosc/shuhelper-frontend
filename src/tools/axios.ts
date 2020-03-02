import Axios from 'axios';
import {parseDateTimeInJSON} from '@/tools/dateTime';

const instance = Axios.create({
  baseURL: process.env.NODE_ENV === 'development' ?
    'http://dev.cloud.shuosc.com/' :
    '/',
});

const Requesting = new Set<string>();

instance.interceptors.request.use((request) => {
    if (typeof request.url === 'string' && request.method === 'get') {
      if (request.url === 'api/semester?date=now' && !Requesting.has(request.url)) {
        setTimeout(() => Requesting.delete(request.url as string), 1000);
        Requesting.add(request.url);
      } else {
        if (!request.url.includes('course-selection-url') && Requesting.has(request.url)) {
          return Promise.reject(Error('重复请求'));
        } else {
          Requesting.add(request.url);
        }
      }
    }
    return request;
  }
);

instance.interceptors.response.use((response) => {
  if (typeof response.config.url === 'string' && response.config.url.includes('login')) {
    Requesting.clear();
  }
  response.data = parseDateTimeInJSON(response.data);
  return response;
});

export default instance;
