<template>
    <div>
        <div class="d-flex justify-space-between pa-1">
            <v-btn @click="$refs.calendar.prev()" fab small>
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <p class="ma-auto">{{format(parse(stringValue, 'yyyy-MM-dd', new Date()), 'yyyy 年 MM 月')}}</p>
            <v-btn @click="$refs.calendar.next()" fab small>
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </div>
        <v-calendar
                :day-format="(date) => date.day"
                :month-format="()=>''"
                :now="format(dateTimeStore.now, 'yyyy-MM-dd')"
                @click:date="clicked"
                class="school-calendar"
                ref="calendar"
                type="month"
                v-model="stringValue">
            <template v-slot:day-label="date">
                <div :class="{selected:date.date === format(value, 'yyyy-MM-dd')}"
                     @click="clicked(date)">
                    <div>{{date.day}}</div>
                    <div class="d-flex justify-center mb-1" v-if="
                    !pipe(semesterStore.getByDateTime(parse(date.date, 'yyyy-MM-dd', dateTimeStore.now)),
                        map(semester => {
                            return DateTimeInSemesterService.isHoliday({
                                dateTime: parse(date.date, 'yyyy-MM-dd', dateTimeStore.now),
                                semester: semester
                            });
                        }),
                        getOrElse(() => true)
                    )">
                    <span :style="{background:toNullable(courseStore.getById(classObject.course_by_teacher_id)).color}"
                          class="dot" v-for="classObject in getClasses(date.date)">
                    </span>
                    </div>
                    <div class="holiday-text"
                         v-else-if="isSome(semesterStore.getByDateTime(parse(date.date, 'yyyy-MM-dd', dateTimeStore.now)))">
                        放假
                    </div>
                </div>
            </template>
        </v-calendar>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {getModule} from "vuex-module-decorators";
    import DateTimeModule from "@/store/dateTime";
    import {format, parse} from "date-fns";
    import CourseModule, {Class} from "@/store/course";
    import SemesterModule from "@/store/semester";
    import {pipe} from "fp-ts/lib/pipeable";
    import {Semester} from "@/model/semester/semester";
    import {getOrElse, isSome, map, toNullable} from "fp-ts/lib/Option";
    import {DateTimeInSemesterService} from "@/model/semester/dateTimeInSemester";

    @Component({
        methods: {format, parse, toNullable, pipe, map, getOrElse, isSome}
    })
    export default class Calendar extends Vue {
        @Prop() public value!: Date;
        private dateTimeStore = getModule(DateTimeModule, this.$store);
        private stringValue = format(new Date(), "yyyy-MM-dd");
        private courseStore = getModule(CourseModule, this.$store);
        private semesterStore = getModule(SemesterModule, this.$store);
        private DateTimeInSemesterService = DateTimeInSemesterService;

        public clicked(day: { date: string }) {
            this.stringValue = day.date;
            this.$emit("update:value", parse(this.stringValue, "yyyy-MM-dd", this.dateTimeStore.now));
        }

        public getClasses(dateString: string): Array<Class> {
            const dateTime = parse(dateString, "yyyy-MM-dd", this.dateTimeStore.now);
            return pipe(
                this.semesterStore.getByDateTime(dateTime),
                map((semester: Semester) => this.courseStore.getClassesByDateTimeInSemester({semester, dateTime})),
                getOrElse(() => [] as Array<Class>)
            );
        }
    };
</script>

<style lang="stylus" scoped>
    .dot {
        display: inline-block;
        min-width: 5px;
        min-height: 5px;
        border-radius: 5px;
        margin-left: 1px;
        margin-right: 1px;
    }

    .selected {
        border: solid 1px #9e9e9e;
        border-radius: 3px;
    }

    .holiday-text {
        font-size: 10px;
    }
</style>
<!--not scoped-->
<style lang="stylus">
    .school-calendar.v-calendar-weekly {
        .v-calendar-weekly__head-weekday {
            border: none;
        }

        .v-calendar-weekly__day {
            border: none !important;
            border-radius: 3px;
            margin: 2px;

            &.v-present {
                & .v-btn {
                    color: #88b3ff;
                    background: inherit;

                    &:before {
                        display: block;
                        opacity: 0.08;
                    }
                }
            }

            & .v-btn {
                margin-bottom: 2px;
                height: 30px;
                width: 30px;
            }
        }

        .v-calendar-weekly__day.v-outside {
            background: transparent !important;
            opacity: 0.1;
        }
    }
</style>
