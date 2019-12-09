import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {findIndex} from 'fp-ts/lib/Array';
import {map} from 'fp-ts/es6/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import Axios from '@/tools/axios';
import {genNextId} from '@/tools/idGenerator';
import {parseDateTimeInJSON} from '@/tools/dateTime';
import {fromNullable, getOrElse} from 'fp-ts/lib/Option';
import {Vue} from 'vue-property-decorator';

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
    private todoItems: Array<Todo> = [];

    get orderByDueTime(): Array<Todo> {
        return this.todoItems.sort((a: Todo, b: Todo) => {
            if (a.due !== undefined && b.due === undefined) {
                return -1;
            } else if (a.due === undefined && b.due !== undefined) {
                return 1;
            } else if (a.due === undefined || b.due === undefined) {
                return 0;
            } else {
                return a.due.getTime() - b.due.getTime();
            }
        });
    }

    get orderByLength(): Array<Todo> {
        return this.todoItems.sort((a: Todo, b: Todo) => {
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
        });
    }

    @Mutation
    public addItemMutation(item: Todo) {
        if (item.local_id === undefined && item.id === undefined) {
            item.local_id = genNextId();
        }
        this.todoItems.push(item);
    }

    @Mutation
    public updateItemMutation(item: Todo) {
        const isOldItem = item.id === undefined ?
            (todoItem: Todo) => todoItem.local_id === item.local_id :
            (todoItem: Todo) => todoItem.id === item.id;
        pipe(
            this.todoItems,
            findIndex(isOldItem),
            map((index) => Vue.set(this.todoItems, index, item))
        );
    }

    @Mutation
    public deleteItemMutation(item: Todo) {
        const isOldItem = item.id === undefined ?
            (todoItem: Todo) => todoItem.local_id === item.local_id :
            (todoItem: Todo) => todoItem.id === item.id;
        pipe(
            this.todoItems,
            findIndex(isOldItem),
            map((index) => this.todoItems.splice(index, 1))
        );
    }

    @Mutation
    public setTodoItems(items: Array<Todo>) {
        this.todoItems = items;
    }

    @Action
    public async addItem(item: Todo) {
        if (this.context.rootState.settings.settings.saveTodoIn === 'client') {
            this.context.commit('addItemMutation', item);
            localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
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
        if (this.context.rootState.settings.settings.saveTodoIn === 'client') {
            this.context.commit('updateItemMutation', item);
            localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
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
        if (this.context.rootState.settings.settings.saveTodoIn === 'client') {
            this.context.commit('deleteItemMutation', item);
            localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
        } else {
            await Axios.delete('api/todo?id=' + item.id);
            this.context.commit('deleteItemMutation', item);
        }
    }

    @Action
    public async init() {
        let itemsInStorage;
        if (this.context.rootState.settings.settings.saveTodoIn === 'client') {
            itemsInStorage = pipe(
                localStorage.getItem('todoItems'),
                fromNullable,
                map(JSON.parse),
                getOrElse(() => [])
            );
            this.context.commit('setTodoItems', parseDateTimeInJSON(itemsInStorage));
        } else {
            itemsInStorage = (await new Promise((resolve, reject) => Axios.get('api/todo')
                .then(resolve).catch(reject)) as { data: Array<Todo> }).data;
            itemsInStorage.forEach((it: Todo) => it.estimate_cost = ((parseInt(it.estimate_cost!, 10)) / 1000 / 1000 / 1000 / 60).toString() + 'm');
            this.context.commit('setTodoItems', itemsInStorage);
        }
    }
}
