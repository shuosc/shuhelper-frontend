import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {findIndex} from 'fp-ts/lib/Array';
import {map} from 'fp-ts/es6/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import Axios from '@/tools/axios';
import {genNextId} from '@/tools/idGenerator';
import {fromNullable, getOrElse, isNone, none, Option, some, toNullable} from 'fp-ts/lib/Option';
import {Vue} from 'vue-property-decorator';
import {Settings} from '@/store/settings';
import {sleep} from '@/tools/sleep';
import {parseDateTimeInJSON} from '@/tools/dateTime';

export interface Todo {
    id?: number,
    local_id?: number,
    content: string,
    due?: Date,
    estimate_cost?: string,
    type: 'Homework' | 'Coding' | 'Report' | 'Discussion' | ''
}

@Module({name: 'todo', namespaced: true})
export default class TodoModule extends VuexModule {
    private todoItems: Option<Array<Todo>> = none;

    get orderByDueTime(): Array<Todo> {
        return pipe(
            this.todoItems,
            map((items) => items.sort((a: Todo, b: Todo) => {
                if (a.due !== undefined && b.due === undefined) {
                    return -1;
                } else if (a.due === undefined && b.due !== undefined) {
                    return 1;
                } else if (a.due === undefined || b.due === undefined) {
                    return 0;
                } else {
                    return a.due.getTime() - b.due.getTime();
                }
            })),
            getOrElse(() => [] as Array<Todo>)
        );
    }

    get orderByLength(): Array<Todo> {
        return pipe(
            this.todoItems,
            map((items) => items.sort((a: Todo, b: Todo) => {
                if (a.estimate_cost !== undefined && b.estimate_cost === undefined) {
                    return -1;
                } else if (a.estimate_cost === undefined && b.estimate_cost !== undefined) {
                    return 1;
                } else if (a.estimate_cost === undefined || b.estimate_cost === undefined) {
                    return 0;
                } else {
                    return parseInt(a.estimate_cost.slice(0, a.estimate_cost.length - 1), 10)
                        - parseInt(b.estimate_cost.slice(0, b.estimate_cost.length - 1), 10);
                }
            })),
            getOrElse(() => [] as Array<Todo>)
        );
    }

    @Mutation
    public addItemMutation(item: Todo) {
        if (item.local_id === undefined && item.id === undefined) {
            item.local_id = genNextId();
        }
        toNullable(this.todoItems)!.push(item);
    }

    @Mutation
    public updateItemMutation(item: Todo) {
        const isOldItem = item.id === undefined ?
            (todoItem: Todo) => todoItem.local_id === item.local_id :
            (todoItem: Todo) => todoItem.id === item.id;
        pipe(
            toNullable(this.todoItems)!,
            findIndex(isOldItem),
            map((index) => Vue.set(toNullable(this.todoItems)!, index, item))
        );
    }

    @Mutation
    public deleteItemMutation(item: Todo) {
        const isOldItem = item.id === undefined ?
            (todoItem: Todo) => todoItem.local_id === item.local_id :
            (todoItem: Todo) => todoItem.id === item.id;
        pipe(
            toNullable(this.todoItems)!,
            findIndex(isOldItem),
            map((index) => toNullable(this.todoItems)!.splice(index, 1))
        );
    }

    @Mutation
    public setTodoItems(items: Array<Todo>) {
        this.todoItems = some(items);
    }

    @Action
    public async addItem(item: Todo) {
        if ((toNullable(this.context.rootState.settings.settings) as Settings).saveTodoIn === 'client') {
            this.context.commit('addItemMutation', item);
            localStorage.setItem('todoItems', JSON.stringify(toNullable(this.todoItems)));
        } else {
            const createdItem: Todo = (await Axios.post('api/todo', item)).data;
            if (createdItem.estimate_cost !== undefined) {
                createdItem.estimate_cost = (parseInt(createdItem.estimate_cost, 10) / 1000 / 1000 / 1000 / 60) + 'm';
            }
            this.context.commit('addItemMutation', createdItem);
        }
    }

    @Action
    public async updateItem(item: Todo) {
        if ((toNullable(this.context.rootState.settings.settings) as Settings).saveTodoIn === 'client') {
            this.context.commit('updateItemMutation', item);
            localStorage.setItem('todoItems', JSON.stringify(toNullable(this.todoItems)));
        } else {
            const createdItem: Todo = (await Axios.put('api/todo', item)).data;
            if (createdItem.estimate_cost !== undefined) {
                createdItem.estimate_cost = (parseInt(createdItem.estimate_cost, 10) / 1000 / 1000 / 1000 / 60) + 'm';
            }
            this.context.commit('updateItemMutation', createdItem);
        }
    }

    @Action
    public async deleteItem(item: Todo) {
        if ((toNullable(this.context.rootState.settings.settings) as Settings).saveTodoIn === 'client') {
            this.context.commit('deleteItemMutation', item);
            localStorage.setItem('todoItems', JSON.stringify(toNullable(this.todoItems)));
        } else {
            await Axios.delete('api/todo', {params: {id: item.id}});
            this.context.commit('deleteItemMutation', item);
        }
    }

    @Action
    public async fetchUntilSuccess() {
        await this.context.dispatch('settings/fetchUntilSuccess', null, {root: true});
        while (isNone(this.todoItems)) {
            try {
                let itemsInStorage;
                if ((toNullable(this.context.rootState.settings.settings) as Settings).saveTodoIn === 'client') {
                    itemsInStorage = pipe(
                        localStorage.getItem('todoItems'),
                        fromNullable,
                        map(JSON.parse),
                        map(parseDateTimeInJSON)
                    );
                } else {
                    itemsInStorage = some(((await new Promise((resolve, reject) => (
                        Axios.get('api/todo')
                            .then(resolve)
                            .catch(reject)
                    ))) as { data: Array<Todo> }).data);
                    pipe(
                        itemsInStorage,
                        map((items) => {
                            items.forEach((it) => {
                                if (it.estimate_cost !== undefined) {
                                    it.estimate_cost = (parseInt(it.estimate_cost, 10) / 1000 / 1000 / 1000 / 60) + 'm';
                                }
                            });
                        })
                    );
                }
                this.context.commit('setTodoItems', pipe(
                    itemsInStorage,
                    getOrElse(() => [])
                ));
            } catch (e) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(e);
                }
            }
            await sleep(100);
        }
    }
}
