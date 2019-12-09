<template>
    <v-card>
        <v-container>
            <v-row>
                <v-col class="d-flex justify-center align-center" cols="12" md="4">
                    <v-date-picker scrollable v-model="date">
                    </v-date-picker>
                </v-col>
                <v-col class="d-flex justify-center align-center" cols="12" md="8">
                    <v-time-picker :landscape="$vuetify.breakpoint.mdAndUp" scrollable v-model="time"></v-time-picker>
                </v-col>
                <v-col class="d-flex align-end justify-end" cols="12">
                    <v-btn @click="onCancel" color="primary" text>取消</v-btn>
                    <v-btn @click="onOk" color="primary" text>确定</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {pipe} from 'fp-ts/lib/pipeable';
    import {fromNullable, getOrElse, map, none, Option, option, some, toNullable} from 'fp-ts/lib/Option';
    import {format, parse} from 'date-fns';
    import {_, partial} from '@/tools/partial';
    import {createTime, extractDate, mergeDateTime} from '@/tools/dateTime';
    import {sequenceT} from 'fp-ts/lib/Apply';

    @Component({})
    export default class DateTimePicker extends Vue {
        private value: Option<Date> = none;

        get date(): string | null {
            return pipe(
                this.value,
                map(partial(format, _, 'yyyy-MM-dd')),
                toNullable
            );
        }

        set date(stringForm: string | null) {
            const dateObject = pipe(
                fromNullable(stringForm),
                map(partial(parse, _, 'yyyy-MM-dd', new Date())),
            );
            const time = pipe(this.value, getOrElse(() => createTime(0, 0)));
            this.value = pipe(
                sequenceT(option)(dateObject, some(time)),
                map(([dateValue, timeValue]) => mergeDateTime(dateValue, timeValue))
            );
        }

        get time(): string | null {
            return pipe(
                this.value,
                map(partial(format, _, 'HH:mm')),
                toNullable
            );
        }

        set time(stringForm: string | null) {
            const timeObject = pipe(
                fromNullable(stringForm),
                map(partial(parse, _, 'HH:mm', new Date())),
            );
            const date = pipe(this.value, getOrElse(() => extractDate(new Date())));
            this.value = pipe(
                sequenceT(option)(some(date), timeObject),
                map(([dateValue, timeValue]) => mergeDateTime(dateValue, timeValue))
            );
        }

        @Watch('value')
        public onValueChanged() {
            this.$emit('changed', this.value);
        }

        public onOk() {
            this.$emit('ok', this.value);
        }

        public onCancel() {
            this.$emit('cancel');
        }
    }
</script>

<style scoped>

</style>
