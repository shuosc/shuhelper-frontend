import Axios from 'axios';
import {jsonStringToObject} from 'json-interface2class';

const instance = Axios.create({
    baseURL: 'http://cloud.shu.xn--io0a7i:30000/',
});

const dateRegex = /((\d{4})|([+-]?\d{6}))-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/;

const config = new Map<(obj: any) => boolean, (obj: any) => any>();
config.set(dateRegex.test.bind(dateRegex), (str: string) => new Date(str));

instance.interceptors.response.use((response) => {
    response.data = jsonStringToObject(response.data, config);
    return response;
});

export default instance;
