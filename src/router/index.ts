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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
