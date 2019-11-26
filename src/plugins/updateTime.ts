import Vue from 'vue';
import {getModule} from 'vuex-module-decorators';
import DateTimeModule from '@/store/dateTime';
import SemesterModule from '@/store/semester';

Vue.mixin({
    async mounted() {
        // @ts-ignore
        if (this.$store) {
            // @ts-ignore
            getModule(DateTimeModule, this.$store).start();
            // @ts-ignore
            getModule(SemesterModule, this.$store).fetchByDateTime();
        }
    }
});
