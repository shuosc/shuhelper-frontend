import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Axios from '../tools/axios';
import {fromNullable, getOrElse, map, toNullable} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

export interface Settings {
    mode: 'dark' | 'light';
    saveSettingsIn: 'server' | 'client';
    saveTodoIn: 'server' | 'client';
}

async function upload(settings: Settings) {
    if (settings.saveSettingsIn === 'server') {
        localStorage.removeItem('settings');
        return await Axios.post('api/shuhelper-config-storage', settings);
    } else {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}

@Module({name: 'settings', namespaced: true})
export default class SettingsModule extends VuexModule {
    public settings: Settings | null = null;

    @Mutation
    public setAll(settings: Settings) {
        this.settings = settings;
    }

    @Mutation
    public setModeMutation(mode: 'dark' | 'light') {
        if (this.settings === null) {
            this.settings = {
                mode: 'dark',
                saveSettingsIn: 'server',
                saveTodoIn: 'client'
            };
        }
        this.settings!.mode = mode;
    }

    @Mutation
    public setSaveSettingsInMutation(mode: 'server' | 'client') {
        if (this.settings === null) {
            this.settings = {
                mode: 'dark',
                saveSettingsIn: 'server',
                saveTodoIn: 'client'
            };
        }
        this.settings!.saveSettingsIn = mode;
    }

    @Mutation
    public setSaveTodoInMutation(mode: 'server' | 'client') {
        if (this.settings === null) {
            this.settings = {
                mode: 'dark',
                saveSettingsIn: 'server',
                saveTodoIn: 'client'
            };
        }
        this.settings!.saveTodoIn = mode;
    }

    @Action
    public async setMode(mode: 'dark' | 'light') {
        this.context.commit('setModeMutation', mode);
        await upload(this.settings!);
    }

    @Action
    public async setSaveSettingsIn(mode: 'server' | 'client') {
        this.context.commit('setSaveSettingsInMutation', mode);
        await upload(this.settings!);
    }

    @Action
    public async setSaveTodoIn(mode: 'server' | 'client') {
        this.context.commit('setSaveTodoInMutation', mode);
        await upload(this.settings!);
    }

    @Action
    public async init() {
        const fetch = async () => {
            const result = await new Promise((resolve) => {
                Axios.get('api/shuhelper-config-storage')
                    .then((response) => resolve({
                        mode: response.data.mode,
                        saveSettingsIn: 'server',
                        saveTodoIn: response.data.saveTodoIn
                    }))
                    .catch(() => resolve(null));
            });
            this.context.commit('setAll', result);
        };
        if (localStorage.getItem('settings') !== undefined) {
            const inLocalStorage =
                pipe(
                    fromNullable(localStorage.getItem('settings')),
                    map((settingsString) => JSON.parse(settingsString))
                );
            if (pipe(inLocalStorage,
                map((it) => it.saveSettingsIn === 'client'),
                getOrElse(() => false))) {
                this.context.commit('setAll', toNullable(inLocalStorage));
            } else {
                await fetch();
            }
        } else {
            await fetch();
        }
    }
}
