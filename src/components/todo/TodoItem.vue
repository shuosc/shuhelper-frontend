<template>
    <v-sheet :class="'todo-'+(item.type === '' ? 'unknown':item.type.toLowerCase())"
             @click="displayControl = !displayControl"
             class="pa-2 todo-item"
             tile>{{item.content}}
        <div class="top-right">
            <span class="due-date red darken-1 white--text" v-if="item.due !== undefined">
                {{ isAfter(item.due, dateTimeStore.now) ? formatDistance(item.due, new Date(), {locale: zhCN}) : "已过期"}}
            </span>
            <span class="estimation-cost purple darken-1 white--text"
                  v-if="item.estimate_cost !== undefined">{{item.estimate_cost}}</span>
        </div>
        <v-expand-transition>
            <div v-show="displayControl">
                <v-divider class="ma-1" light></v-divider>
                <div class="d-flex align-content-space-around justify-space-around">
                    <TodoEditor :initValue="item" @ok="onEditFinish">
                        <template v-slot:button>
                            <v-icon left>mdi-file-document-edit</v-icon>
                            编辑
                        </template>
                        <template v-slot:headline>
                            编辑
                        </template>
                    </TodoEditor>
                    <v-btn @click="deleteItem" class="todo-editor-button" outlined
                           x-small>
                        <v-icon left>mdi-checkbox-marked-circle</v-icon>
                        已完成
                    </v-btn>
                </div>
            </div>
        </v-expand-transition>
    </v-sheet>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TodoEditor from '@/components/todo/TodoEditor.vue';
    import {formatDistance, isAfter} from 'date-fns';
    import {zhCN} from 'date-fns/locale';
    import {getModule} from 'vuex-module-decorators';
    import DateTimeModule from '@/store/dateTime';
    import TodoModule, {Todo} from '@/store/todo';

    @Component({
        components: {TodoEditor},
        methods: {formatDistance, isAfter}
    })
    export default class TodoItem extends Vue {
        @Prop() public item!: Todo;
        private displayControl = false;
        private readonly zhCN = zhCN;
        private dateTimeStore = getModule(DateTimeModule, this.$store);
        private todoStore = getModule(TodoModule, this.$store);

        private async onEditFinish(value: Todo) {
            await this.todoStore.updateItem(value);
        }

        private async deleteItem() {
            await this.todoStore.deleteItem(this.item);
        }
    }
</script>

<style lang="stylus" scoped>
    @import "style/todo-color.styl"
    .todo-homework {
        background-color: homework-color;
        color: dark-font-color;

        & >>> .todo-editor-button {
            color: control-color;
        }
    }

    .todo-coding {
        background-color: coding-color;
        color: dark-font-color;

        & >>> .todo-editor-button {
            color: control-color;
        }
    }

    .todo-report {
        background-color: report-color;
        color: dark-font-color;

        & >>> .todo-editor-button {
            color: control-color;
        }
    }

    .todo-discussion {
        background-color: discussion-color;
        color: dark-font-color;

        & >>> .todo-editor-button {
            color: control-color;
        }
    }

    .todo-unknown {
        background-color: unknown-color;
        color: dark-font-color;

        & >>> .todo-editor-button {
            color: control-color;
        }
    }

    .todo-item {
        position: relative;
        padding-top: 20px !important;
        white-space: pre-wrap;
    }

    .top-right {
        box-sizing: border-box;
        position: absolute;
        top: 4px;
        right: 0;
        line-height: 1em;
    }

    .due-date {
        padding: 2px;
        box-sizing: border-box;
        line-height: 1em;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        opacity: 80%;
    }

    .estimation-cost {
        padding: 2px;
        margin-left: 4px;
        box-sizing: border-box;
        line-height: 1em;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        opacity: 80%;
    }
</style>
