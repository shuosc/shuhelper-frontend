import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Axios from '../tools/axios';
import {fromNullable, getOrElse, isNone, isSome, map, none, Option, some, toNullable} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import {chain} from 'fp-ts/es6/Option';
import {sleep} from '@/tools/sleep';

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

async function download(): Promise<Settings> {
    const inLocalStorage = pipe(
        fromNullable(localStorage.getItem('settings')),
        map((settingsString: string) => JSON.parse(settingsString)),
        chain((object: Settings) => object.saveTodoIn === 'client' ? some(object) : none)
    );
    if (isSome(inLocalStorage)) {
        return toNullable(inLocalStorage)!;
    }
    const inServerStorage: Option<Settings> = await new Promise((resolve) => Axios.get('api/shuhelper-config-storage')
        .then((response) => resolve(some({
            mode: response.data.mode,
            saveSettingsIn: 'server',
            saveTodoIn: response.data.saveTodoIn
        })))
        .catch(() => resolve(none)));
    return pipe(
        inServerStorage,
        getOrElse(() => ({
            mode: 'dark',
            saveSettingsIn: 'server',
            saveTodoIn: 'client'
        } as Settings))
    );
}

@Module({name: 'settings', namespaced: true})
export default class SettingsModule extends VuexModule {
    public settings: Option<Settings> = none;

    @Mutation
    public setAll(settings: Settings) {
        this.settings = some(settings);
    }

    @Mutation
    public setModeMutation(mode: 'dark' | 'light') {
        pipe(
            this.settings,
            map((settings) => settings.mode = mode)
        );
    }

    @Mutation
    public setSaveSettingsInMutation(mode: 'server' | 'client') {
        pipe(
            this.settings,
            map((settings) => settings.saveSettingsIn = mode)
        );
    }

    @Mutation
    public setSaveTodoInMutation(mode: 'server' | 'client') {
        pipe(
            this.settings,
            map((settings) => settings.saveTodoIn = mode)
        );
    }

    @Action
    public async setMode(mode: 'dark' | 'light') {
        this.context.commit('setModeMutation', mode);
        await upload(toNullable(this.settings)!);
    }

    @Action
    public async setSaveSettingsIn(mode: 'server' | 'client') {
        this.context.commit('setSaveSettingsInMutation', mode);
        await upload(toNullable(this.settings)!);
    }

    @Action
    public async setSaveTodoIn(mode: 'server' | 'client') {
        this.context.commit('setSaveTodoInMutation', mode);
        await upload(toNullable(this.settings)!);
    }

    @Action
    public async fetchUntilSuccess() {
        while (isNone(this.settings)) {
            try {
                const inStorage = await download();
                this.context.commit('setAll', inStorage);
                await sleep(100);
            } catch (e) {
                if (process.env !== 'production') {
                    console.error(e);
                }
            }
        }
    }
}
