<template>
    <v-list>
        <v-list-item>
            <v-list-item-content class="pl-3">
                <v-switch :label="settingsStore.settings.mode === 'light'?'明亮模式':'黑暗模式'"
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

    @Component({})
    export default class Settings extends Vue {
        private settingsStore = getModule(SettingsModule, this.$store);

        get mode() {
            return this.settingsStore.settings.mode === 'light';
        }

        set mode(value: boolean) {
            this.settingsStore.setMode(value ? 'light' : 'dark');
            (this as any).$vuetify.theme.dark = !value;
        }
    };
</script>

<style scoped>

</style>
