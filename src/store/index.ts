import Vue from 'vue';
import Vuex from 'vuex';
import SemesterModule from '@/store/semester';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        semester: SemesterModule
    },
});
