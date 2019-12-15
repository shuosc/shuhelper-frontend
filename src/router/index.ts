import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../views/Index.vue'),
    }, {
        path: '/school-calendar',
        name: 'schoolCalendar',
        component: () => import('../views/SchoolCalendar.vue'),
    }, {
        path: '/login',
        name: 'login',
        meta: {layout: 'middleBox'},
        component: () => import('../views/Login.vue'),
    }, {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/Settings.vue'),
    }, {
        path: '/todo',
        name: 'todo',
        component: () => import('../views/Todo.vue'),
    },
];

const router = new VueRouter({
    base: '/shuhelper/',
    routes,
});

export default router;
