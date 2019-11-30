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
    if (settings.saveTodoIn === 'server') {
        return await Axios.post('api/shuhelper-config-storage', settings);
    } else {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}

@Module({name: 'settings', namespaced: true})
export default class SettingsModule extends VuexModule {
    public settings: Settings = {
        mode: 'dark',
        saveSettingsIn: 'server',
        saveTodoIn: 'client'
    };

    @Mutation
    public setAll(settings: Settings) {
        this.settings = settings;
    }

    @Mutation
    public setModeMutation(mode: 'dark' | 'light') {
        this.settings.mode = mode;
    }

    @Mutation
    public setSaveSettingsInMutation(mode: 'server' | 'client') {
        this.settings.saveSettingsIn = mode;
    }

    @Mutation
    public setSaveTodoInMutation(mode: 'server' | 'client') {
        this.settings.saveTodoIn = mode;
    }

    @Action
    public async setMode(mode: 'dark' | 'light') {
        this.context.commit('setModeMutation', mode);
        await upload(this.settings);
    }

    @Action
    public async setSaveSettingsIn(mode: 'server' | 'client') {
        this.context.commit('setSaveSettingsInMutation', mode);
        await upload(this.settings);
    }

    @Action
    public async setSaveTodoIn(mode: 'server' | 'client') {
        this.context.commit('setSaveSettingsInMutation', mode);
        await upload(this.settings);
    }

    @Action
    public async init() {
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
                await Axios.get('api/shuhelper-config-storage')
                    .then((response) => {
                        this.context.commit('setAll', {
                            mode: response.data.mode,
                            saveSettingsIn: 'server',
                            saveTodoIn: response.data.saveTodoIn
                        });
                    }).catch(() => {
                        this.context.commit('setAll', {
                            mode: 'dark',
                            saveSettingsIn: 'client',
                            saveTodoIn: 'client'
                        });
                    });
            }
        }
    }
}
