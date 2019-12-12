<template>
    <div>
        <div class="d-flex justify-space-between pa-1 mt-1">
            <v-btn @click="prev" fab small>
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <p class="ma-auto">{{format(displaying, 'yyyy 年 MM 月')}}</p>
            <v-btn @click="next" fab small>
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </div>
        <div class="d-flex">
            <v-row class="pl-3 pr-3">
                <div class="calendar-daynames">
                    <v-row class="pl-3 pr-3">
                        <div class="calendar-dayname d-flex justify-center"
                             v-for="chineseWeekdayName in chineseWeekdayNames">
                            <span>{{chineseWeekdayName}}</span>
                        </div>
                    </v-row>
                </div>
                <div class="calendar-day-container d-flex pa-1" v-for="day in daysDisplaying">
                    <Day :class="{notSameMonth: !isSameMonth(day,displaying), selected: isSameDay(day, value)}"
                         :date="day"
                         :key="day.toString()"
                         @click="updateValue(day)"
                         class="d-flex fill-height"
                    ></Day>
                </div>
            </v-row>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import Day from '@/components/schoolCalendar/Day.vue';
    import {
        addMonths,
        eachDayOfInterval,
        endOfMonth,
        endOfWeek,
        format,
        isSameDay,
        isSameMonth,
        startOfMonth,
        startOfWeek
    } from 'date-fns';

    @Component({
        components: {Day},
        methods: {format, isSameMonth, isSameDay}
    })
    export default class Calendar extends Vue {
        @Prop() public value!: Date;
        private displaying: Date = this.value;
        private chineseWeekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

        get daysDisplaying() {
            const start = startOfWeek(startOfMonth(this.displaying));
            const end = endOfWeek(endOfMonth(this.displaying));
            return eachDayOfInterval({start, end});
        }

        public mounted() {
            (window as any).addMonths = addMonths;
        }

        public prev() {
            this.displaying = addMonths(this.displaying, -1);
        }

        public next() {
            this.displaying = addMonths(this.displaying, 1);
        }

        public updateValue(day: Date) {
            this.$emit('update', day);
        }

        @Watch('value')
        public onValueChanged(toValue: Date) {
            if (!isSameDay(this.displaying, toValue)) {
                this.displaying = toValue;
            }
        }
    };
</script>

<style lang="stylus" scoped>
    grid-width = 14.28%;

    .calendar-day-container {
        flex: 0 0 grid-width;
        cursor: pointer;
    }

    .notSameMonth {
        opacity: 0.2;
    }

    .selected {
        border: solid 1px #acacac;
    }

    .calendar-day {
        width: 100%;
    }

    .calendar-daynames {
        width: 100%;
        border-top: solid 1px #a1a1a1;
        border-bottom: solid 1px #a1a1a1;
    }

    .calendar-dayname {
        flex: 0 0 grid-width;
        font-size: 14px;

        &:not(:last-of-type) {
            border-right: solid 1px #a1a1a1;
        }
    }
</style>
