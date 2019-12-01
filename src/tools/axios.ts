import Axios from 'axios';
import {jsonStringToObject} from 'json-interface2class';

const instance = Axios.create({
    baseURL: process.env.NODE_ENV === 'development' ?
        'https://cloud.shuosc.com/' :
        '/',
});

const dateRegex = /((\d{4})|([+-]?\d{6}))-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/;

const config = new Map<(obj: any) => boolean, (obj: any) => any>();
config.set(dateRegex.test.bind(dateRegex), (str: string) => new Date(str));

const Requesting = new Set<string>();

instance.interceptors.request.use((request) => {
        if (typeof request.url === 'string' && request.method === 'get') {
            if (request.url === 'api/semester?date=now' && !Requesting.has(request.url)) {
                setTimeout(() => Requesting.delete(request.url as string), 1000);
                Requesting.add(request.url);
            } else {
                if (Requesting.has(request.url)) {
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
    response.data = jsonStringToObject(response.data, config);
    return response;
});

export default instance;
