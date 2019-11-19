import Vue from 'vue';
// @ts-ignore
import Vuetify, {VAppBar, VLayout, VList, VListItemSubtitle, VNavigationDrawer, VToolbar} from 'vuetify/lib';
import zhHans from 'vuetify/src/locale/zh-Hans';

Vue.use(Vuetify, {
    components: {
        VAppBar,
        VNavigationDrawer,
        VList,
        VListItemSubtitle,
        VLayout,
        VToolbar
    }
});

export default new Vuetify({
    lang: {
        locales: {zhHans},
        current: 'zh-Hans',
    },
    theme: {
        dark: true
    },
});
