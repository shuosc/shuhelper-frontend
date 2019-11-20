import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {none, Option, some} from 'fp-ts/lib/Option';
import Axios from '@/tools/axios';

interface User {
    id: string,
    name: string
}

@Module
export default class UserModule extends VuexModule {
    public user: Option<User> = none;

    @Mutation
    public setUser(user: User) {
        this.user = some(user);
    }

    @Action({commit: 'setUser'})
    public async login(username: string, password: string) {
        return await Axios.post('auth/login/shu-course-proxy', {username, password});
    }
}
