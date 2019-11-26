import Vue from 'vue';
import {getModule} from 'vuex-module-decorators';
import UserModule from '@/store/user';
import {isNone} from 'fp-ts/lib/Option';

Vue.mixin({
    async mounted() {
        // @ts-ignore
        if (this.$store) {
            // @ts-ignore
            const userStore = getModule(UserModule, this.$store);
            const token = localStorage.getItem('token');
            if (isNone(userStore.user) && token !== null) {
                await userStore.restoreLogin(token);
            }
        }
    }
});
