import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {none, Option, some} from 'fp-ts/lib/Option';
import Axios from '@/tools/axios';

export interface User {
    id: string,
    name: string
}

@Module({name: 'user', namespaced: true})
export default class UserModule extends VuexModule {
    public user: Option<User> = none;

    @Mutation
    public setUser(user: User) {
        this.user = some(user);
    }

    @Action({commit: 'setUser'})
    public async restoreLogin(token: string) {
        Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        window.localStorage.setItem('token', token);
        return (await new Promise((resolve, reject) => {
            Axios.get(`api/student`)
                .then(resolve).catch(reject);
        }) as { data: { id: string, name: string } }).data;
    }

    @Action({commit: 'setUser'})
    public async login(info: { username: string, password: string }) {
        const courseSelectionUrl = (await new Promise((resolve, reject) => {
            Axios.get('api/course-selection-url?id=11')
                .then(resolve).catch(reject);
        }) as { data: { url: string } }).data.url;
        const token = (await new Promise((resolve, reject) => Axios.post('auth/login/shu-course-proxy', {
            from_url: courseSelectionUrl,
            username: info.username,
            password: info.password
        }).then(resolve).catch(reject)) as { data: string }).data;
        Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        window.localStorage.setItem('token', token);
        return (await new Promise((resolve, reject) => {
            Axios.get(`api/student`)
                .then(resolve).catch(reject);
        }) as { data: { id: string, name: string } }).data;
    }
}
