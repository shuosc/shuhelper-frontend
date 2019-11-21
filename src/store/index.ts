import Vue from 'vue';
import Vuex from 'vuex';
import SemesterModule from '@/store/semester';
import DateTimeModule from '@/store/dateTime';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        semester: SemesterModule,
        dateTime: DateTimeModule
    },
});
