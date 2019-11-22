import Vue from 'vue';
import Vuex from 'vuex';
import SemesterModule from '@/store/semester';
import DateTimeModule from '@/store/dateTime';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        semester: SemesterModule,
        dateTime: DateTimeModule
    },
});

store.watch((state, getters) => getters['dateTime/now'], (nowDateTime) => {
    store.dispatch('semester/fetchByDateTime', nowDateTime);
});
export default store;
