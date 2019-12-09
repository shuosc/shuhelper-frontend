<template>
    <v-dialog v-model="dialogOpen"
              width="500">
        <template v-slot:activator="{ on }">
            <v-btn :color="color"
                   :fab="fab"
                   :outlined="outlined"
                   :small="small"
                   :text="text"
                   :x-small="xSmall"
                   class="todo-editor-button"
                   v-on="on">
                <slot name="button"></slot>
            </v-btn>
        </template>
        <v-card :class="'todo-editor-'+(initValue.type === '' ? 'unknown':initValue.type.toLowerCase())">
            <v-card-title class="headline"
                          primary-title>
                <slot name="headline"></slot>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-container>
                    <v-row class="d-flex justify-center align-baseline">
                        <v-col cols="12">
                            <v-textarea label="内容" name="content" outlined v-model="content"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="5" sm="6">
                            <v-dialog :close-on-content-click="false"
                                      min-width="290px"
                                      offset-y
                                      ref="dueDateSelector"
                                      transition="scale-transition"
                                      v-model="dueDateSelector">
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            label="Deadline"
                                            prepend-icon="mdi-camera-timer" readonly
                                            v-model="dueDateString" v-on="on"
                                    ></v-text-field>
                                </template>
                                <DateTimePicker @cancel="dueDateSelector = false"
                                                @ok="onDateTimeChanged"></DateTimePicker>
                            </v-dialog>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field
                                    label="估计时长"
                                    prepend-icon="mdi-timelapse"
                                    suffix="分钟"
                                    v-model="estimateCost"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3" sm="6">
                            <v-select :items="todoTypes" hide-details label="类型"
                                      menu-props="auto"
                                      prepend-icon="mdi-format-list-bulleted-type"
                                      single-line
                                      v-model="type"></v-select>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialogOpen = false" color="primary" text>取消</v-btn>
                <v-btn @click="onOk" color="primary" text>
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import DateTimePicker from '@/components/todo/DateTimePicker.vue';
    import {fromNullable, map, Option, toNullable, toUndefined} from 'fp-ts/lib/Option';
    import {pipe} from 'fp-ts/lib/pipeable';
    import {format} from 'date-fns';
    import {Todo} from '@/store/todo';

    @Component({
        methods: {pipe, toNullable, map},
        components: {DateTimePicker}
    })
    export default class TodoEditor extends Vue {
        @Prop() public initValue!: Todo;
        @Prop({default: true}) public outlined!: boolean;
        @Prop({default: true}) public xSmall!: boolean;
        @Prop({default: false}) public small!: boolean;
        @Prop({default: false}) public fab!: boolean;
        @Prop({default: false}) public text!: boolean;
        @Prop({default: ''}) public color!: string;
        private item: Todo = this.initValue;
        private dialogOpen = false;
        private dueDateSelector = false;
        private todoTypes = [{
            text: '作业', value: 'Homework'
        }, {
            text: '代码', value: 'Coding'
        }, {
            text: '报告', value: 'Report'
        }, {
            text: '研讨', value: 'Discussion'
        }];

        get content(): string {
            return this.item.content;
        }

        set content(value: string) {
            this.item.content = value;
            this.$emit('changed', this.item);
        }

        get dueDate(): Option<Date> {
            return fromNullable(this.item.due);
        }

        set dueDate(value: Option<Date>) {
            // Vue is ssssssshhhhhhhhhiiiiiiitttttt!!!!!!!!!!!
            this.$set(this.item, 'due', toUndefined(value));
            this.$emit('changed', this.item);
        }

        get estimateCost(): number | null {
            return pipe(
                fromNullable(this.item.estimate_cost),
                map((it) => parseInt(it.slice(0, it.length - 1), 10)),
                toNullable
            );
        }

        set estimateCost(minutes: number | null) {
            this.item.estimate_cost = pipe(
                fromNullable(minutes),
                map((it) => it.toString() + 'm'),
                toUndefined
            );
            this.$emit('changed', this.item);
        }

        get dueDateString() {
            return pipe(
                this.dueDate,
                map((it) => format(it, 'yyyy-MM-dd HH:mm')),
                toNullable
            );
        }

        get type() {
            return this.item.type;
        }

        set type(type: 'Homework' | 'Coding' | 'Report' | 'Discussion' | '') {
            this.item.type = type;
            this.$emit('changed', this.item);
        }

        @Watch('initValue')
        public onInitValueChanged(newValue: Todo) {
            this.item = newValue;
        }

        public onOk() {
            this.$emit('ok', this.item);
            this.item = this.initValue;
            this.dialogOpen = false;
        }

        public onDateTimeChanged(date: Option<Date>) {
            this.dueDate = date;
            this.dueDateSelector = false;
        }
    }
</script>

<style lang="stylus" scoped>
    @import "style/todo-color.styl"
    .headline {
        color: light-font-color;
    }

    .todo-editor-homework .headline {
        color: dark-font-color;
        background-color: homework-color;
    }

    .todo-editor-coding .headline {
        background-color: coding-color;
    }

    .todo-editor-report .headline {
        background-color: report-color;
    }

    .todo-editor-discussion .headline {
        background-color: discussion-color;
    }

    .todo-editor-unknown .headline {
        color: dark-font-color;
        background-color: unknown-color;
    }
</style>
