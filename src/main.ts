import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import Default from '@/layouts/default.vue';
import MiddleBox from '@/layouts/middleBox.vue';
// @ts-ignore
import FlatSurfaceShader from 'vue-flat-surface-shader';
import '@/plugins/updateTime';
import '@/plugins/recoverLogin';

Vue.component('default', Default);
Vue.component('middleBox', MiddleBox);

Vue.config.productionTip = false;

Vue.use(FlatSurfaceShader);
new Vue({
  router,
  store,
  // @ts-ignore
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
