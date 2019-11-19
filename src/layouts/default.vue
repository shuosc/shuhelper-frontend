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
                            <span class="username">{{'游客'}}</span>
                            <v-btn @click="auth" small text>
                                {{'登录'}}
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
            <v-container fluid>
                <slot></slot>
            </v-container>
        </v-content>
        <v-footer app>
            <span>&copy; 2017 ~ {{(new Date()).getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class Default extends Vue {
        private drawer = true;
        private miniVariant = false;
        private title = "SHUHelper";
        private items = [
            {icon: "school", title: "首页", to: "/"},
            {icon: "calendar", title: "日程", to: "/schedule"}
        ];

        private auth() {
            this.$router.push("/login");
        }
    };
</script>

<style>
    .auth-button {
        text-align: right;
    }

    .username {
        height: 1em;
        font-size: 1em;
        line-height: 1em;
    }
</style>
