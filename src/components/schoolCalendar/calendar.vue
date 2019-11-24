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
            <template v-slot:day="day">
                <div class="d-flex justify-center mb-1">
                    <span :style="{background:toNullable(courseStore.getById(classObject.course_by_teacher_id)).color}"
                          class="dot"
                          v-for="classObject in getClasses(day.date)">
                    </span>
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
    import {getOrElse, map, toNullable} from "fp-ts/lib/Option";

    @Component({
        methods: {format, parse, toNullable}
    })
    export default class Calendar extends Vue {
        @Prop() public value!: Date;
        private dateTimeStore = getModule(DateTimeModule, this.$store);
        private stringValue = format(new Date(), "yyyy-MM-dd");
        private courseStore = getModule(CourseModule, this.$store);
        private semesterStore = getModule(SemesterModule, this.$store);

        public clicked() {
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
</style>
<!--not scoped-->
<style lang="stylus">
    .school-calendar.v-calendar-weekly {
        .v-calendar-weekly__head-weekday {
            border: none;
        }

        .v-calendar-weekly__day {
            border: none;
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
                height: 25px;
                width: 25px;

                &:before {
                    display: none;
                }

                & .v-ripple__container {
                    display: none;
                }
            }

            &:hover {
                border: solid 1px #626262;
            }
        }

        .v-calendar-weekly__day.v-outside {
            background: transparent;
            opacity: 0.1;
        }
    }
</style>
