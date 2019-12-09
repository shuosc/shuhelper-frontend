import Vue from 'vue';
import Vuex from 'vuex';
import SemesterModule from '@/store/semester';
import DateTimeModule from '@/store/dateTime';
import UserModule from '@/store/user';
import CourseModule from '@/store/course';
import SettingsModule from '@/store/settings';
import TodoModule from '@/store/todo';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user: UserModule,
        course: CourseModule,
        semester: SemesterModule,
        dateTime: DateTimeModule,
        settings: SettingsModule,
        todo: TodoModule
    },
});

store.watch((state, getters) => getters['dateTime/now'], (nowDateTime) => {
    store.dispatch('semester/fetchByDateTime', nowDateTime);
});
export default store;
