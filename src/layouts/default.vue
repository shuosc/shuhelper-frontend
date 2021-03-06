<template>
    <v-app>
        <v-app-bar app clipped-right>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn @click.stop="miniVariant = !miniVariant" icon>
                <v-icon v-html="miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left'"></v-icon>
            </v-btn>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-navigation-drawer :mini-variant="miniVariant"
                             app
                             v-model="drawer">
            <v-list>
                <v-list-item class="auth-button">
                    <v-list-item-avatar>
                        <img alt="" src="../assets/shuosc.png">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="d-flex justify-space-between align-center">
                            <span class="username">{{pipe(userStore.user,map((it) => it.name),getOrElse(() => '游客'))}}</span>
                            <v-btn @click="auth" small text>
                                {{isSome(userStore.user)?'退出':'登录'}}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        :key="i"
                        :to="item.to"
                        exact
                        router
                        v-for="(item, i) in items">
                    <v-list-item-action>
                        <v-icon v-html="'mdi-'+item.icon"></v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <v-container class="pa-0 ma-0 fill-width">
                <slot></slot>
            </v-container>
        </v-content>
        <v-footer app class="d-flex flex-row justify-center align-center">
            <a href="http://www.beian.miit.gov.cn">沪ICP备19044115号</a>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import UserModule from '@/store/user';
  import {getModule} from 'vuex-module-decorators';
  import {getOrElse, isSome, map, toNullable} from 'fp-ts/lib/Option';
  import {pipe} from 'fp-ts/lib/pipeable';
  import SettingsModule, {Settings} from '@/store/settings';

  @Component({
    methods: {getOrElse, map, pipe, isSome}
  })
  export default class Default extends Vue {
    private drawer = false;
    private miniVariant = false;
    private title = 'SHUHelper';
    private userStore = getModule(UserModule, this.$store);

    private items = [
      {icon: 'school', title: '首页', to: '/'},
      {icon: 'calendar', title: '校历', to: '/school-calendar'},
      {icon: 'file-document-box-multiple-outline', title: '待办事项', to: '/todo'},
      {icon: 'settings', title: '设置', to: '/settings'}
    ];

    public async mounted() {
      const settingsStore = getModule(SettingsModule, this.$store);
      await settingsStore.fetchUntilSuccess();
      (this as any).$vuetify.theme.dark = toNullable(settingsStore.settings)!.mode === 'dark';
      this.$store.watch((state) => state.settings.settings, (newSettings: Settings) => {
        (this as any).$vuetify.theme.dark = newSettings.mode === 'dark';
      });
    }

    private auth() {
      if (isSome(this.userStore.user)) {
        localStorage.removeItem('token');
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'LOGOUT'
          });
        }
        window.location.assign('/shuhelper/');
      } else {
        this.$router.push('/login');
      }
    }
  };
</script>

<style>
    .fill-width {
        max-width: 100vw !important;
    }

    .auth-button {
        text-align: right;
    }

    .username {
        height: 1em;
        font-size: 1em;
        line-height: 1em;
    }

    a {
        text-decoration: none;
    }
</style>
