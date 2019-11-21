import Vue from 'vue';
import {getModule} from 'vuex-module-decorators';
import DateTimeModule from '@/store/dateTime';

Vue.mixin({
    async mounted() {
        // @ts-ignore
        if (this.$store) {
            // @ts-ignore
            getModule(DateTimeModule, this.$store).start();
        }
    }
});
