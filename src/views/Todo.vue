<template>
    <v-container class="pa-0 ma-0 fill-width">
        <v-toolbar>
            <v-toolbar-title>
                <v-select :items="order"
                          class="pt-8"
                          label="调度算法"
                          v-model="orderValue"></v-select>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <TodoEditor
                        :color="$vuetify.theme.background"
                        :fab="true"
                        :initValue="item"
                        :outlined="false"
                        :small="true"
                        :text="true"
                        :xSmall="false"
                        @ok="addNew">
                    <template v-slot:button>
                        <v-icon small>mdi-note-plus</v-icon>
                    </template>
                    <template v-slot:headline>
                        新建
                    </template>
                </TodoEditor>
            </v-toolbar-items>
        </v-toolbar>
        <v-row class="pa-4">
            <v-col :key="item.id === undefined ? ('local'+item.local_id) : item.id" cols="12" lg="3" md="4" sm="6"
                   v-for="item in todoItems"
                   xl="2">
                <TodoItem :item="item" elevation="12"></TodoItem>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import TodoItem from '@/components/todo/TodoItem.vue';
    import TodoEditor from '@/components/todo/TodoEditor.vue';
    import TodoModule, {Todo} from '@/store/todo';
    import {getModule} from 'vuex-module-decorators';

    @Component({
        components: {TodoItem, TodoEditor}
    })
    export default class TodoView extends Vue {
        private item: Todo = {
            type: '',
            content: ''
        };
        private todoStore = getModule(TodoModule, this.$store);
        private order = [{
            text: '最短剩余时间优先',
            value: 'due'
        }, {
            text: '短作业优先',
            value: 'estimate_cost'
        }];
        private orderValue = 'due';

        get todoItems() {
            return this.orderValue === 'due' ?
                this.todoStore.orderByDueTime : this.todoStore.orderByLength;
        }

        public async mounted() {
            await this.todoStore.fetchUntilSuccess();
        }

        private async addNew(item: Todo) {
            await this.todoStore.addItem(item);
            this.item = {
                type: '',
                content: ''
            };
        }
    }
</script>

<style scoped>

</style>
