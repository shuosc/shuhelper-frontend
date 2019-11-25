import Component from 'vue-class-component';
import {Vue} from 'vue-property-decorator';
import {getModule} from 'vuex-module-decorators';
import UserModule from '@/store/user';
import {isNone} from 'fp-ts/lib/Option';

@Component
export default class LoginRequired extends Vue {
    public beforeMount() {
        const userStore = getModule(UserModule, this.$store);
        if (isNone(userStore.user)) {
            this.$router.push('/login')
                .then();
        }
    }
}
