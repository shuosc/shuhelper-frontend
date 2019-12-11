<template>
    <v-list>
        <v-list-item>
            <v-list-item-content class="pl-3">
                <v-switch :label="'设置储存在'+' '+(saveSettingsIn ?'客户端':'服务器')"
                          v-model="saveSettingsIn">
                </v-switch>
            </v-list-item-content>
        </v-list-item>
        <v-list-item>
            <v-list-item-content class="pl-3">
                <v-switch :label="'Todo项储存在'+' '+(saveTodoIn?'客户端':'服务器')"
                          v-model="saveTodoIn">
                </v-switch>
            </v-list-item-content>
        </v-list-item>
        <v-list-item>
            <v-list-item-content class="pl-3">
                <v-switch :label="mode?'明亮模式':'黑暗模式'"
                          v-model="mode"
                ></v-switch>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {getModule} from 'vuex-module-decorators';
    import SettingsModule from '@/store/settings';
    import {fromNullable, getOrElse, map} from 'fp-ts/lib/Option';
    import {pipe} from 'fp-ts/lib/pipeable';

    @Component({})
    export default class Settings extends Vue {
        private settingsStore = getModule(SettingsModule, this.$store);

        get settings() {
            return fromNullable(this.settingsStore.settings);
        }

        get mode() {
            return pipe(
                this.settings,
                map((settings) => settings.mode === 'light'),
                getOrElse(() => false)
            );
        }

        set mode(value: boolean) {
            this.settingsStore.setMode(value ? 'light' : 'dark');
            (this as any).$vuetify.theme.dark = !value;
        }

        get saveTodoIn() {
            return pipe(
                this.settings,
                map((settings) => settings.saveTodoIn === 'client'),
                getOrElse(() => false)
            );
        }

        set saveTodoIn(value: boolean) {
            this.settingsStore.setSaveTodoIn(value ? 'client' : 'server');
        }

        get saveSettingsIn() {
            return pipe(
                this.settings,
                map((settings) => settings.saveSettingsIn === 'client'),
                getOrElse(() => false)
            );
        }

        set saveSettingsIn(value: boolean) {
            this.settingsStore.setSaveSettingsIn(value ? 'client' : 'server');
        }

        public async mounted() {
            while (this.settingsStore.settings === null) {
                await this.settingsStore.init();
                await (new Promise((resolve) => setTimeout(resolve, 1000)));
            }
        }
    };
</script>

<style scoped>

</style>
