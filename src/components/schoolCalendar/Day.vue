<template>
    <div :class="{today:isSameDay(date,new Date())}"
         @click="clicked"
         class="d-flex flex-column calendar-day"
    >
        <div>
            {{date.getDate()}}
        </div>
        <div>
            <div class="holiday-text" v-if="isHoliday">
                假期
            </div>
            <div class="d-flex flex-row dots" v-else>
                <span :style="{background:toNullable(courseStore.getById(classObject.course_by_teacher_id)).color}"
                      class="dot" v-for="classObject in allClasses"></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {getModule} from 'vuex-module-decorators';
    import SemesterModule from '@/store/semester';
    import {pipe} from 'fp-ts/lib/pipeable';
    import {getOrElse, isSome, map, toNullable} from 'fp-ts/lib/Option';
    import {DateTimeInSemesterService} from '@/model/semester/dateTimeInSemester';
    import CourseModule, {Class} from '@/store/course';
    import {isSameDay} from 'date-fns';

    @Component({
        methods: {toNullable, isSameDay}
    })
    export default class Day extends Vue {
        @Prop() public date!: Date;
        private semesterStore = getModule(SemesterModule, this.$store);
        private courseStore = getModule(CourseModule, this.$store);

        get dateTimeInSemester() {
            const semester = this.semesterStore.getByDateTime(this.date);
            return pipe(
                semester,
                map((semesterObject) => ({
                    semesterObject,
                    dateTime: this.date
                })),
            );
        }

        get isHoliday(): boolean {
            return pipe(
                this.dateTimeInSemester,
                map(DateTimeInSemesterService.isHoliday),
                getOrElse(() => false)
            );
        }

        get allClasses(): Array<Class> {
            return pipe(
                this.dateTimeInSemester,
                map((dateTimeInSemester) => {
                    return this.courseStore.getClassesByDateTimeInSemester(dateTimeInSemester)
                        .sort((a, b) => a.begin_sector - b.end_sector);
                }),
                getOrElse(() => [] as Array<Class>)
            );
        }

        public async mounted() {
            await this.semesterStore.fetchByDateTime(this.date);
            if (isSome(this.dateTimeInSemester)) {
                await this.courseStore.fetchBySemester(toNullable(this.dateTimeInSemester)!.semester.id);
            }
        }

        public clicked() {
            this.$emit('click');
        }
    }
</script>

<style lang="stylus" scoped>
    .dots {
        height: 12px;
    }

    .dot {
        width: 5px;
        height: 5px;
        min-width: 5px;
        min-height: 5px;
        border-radius: 5px;
        margin-left: 1px;
        margin-right: 1px;
    }

    .calendar-day {
        align-items: center;
        border-radius: 5px;
        border: solid 1px transparent;

        &:hover {
            background: #808080;
            color: white;
        }
    }

    .holiday-text {
        font-size: 12px;
        height: 12px;
        line-height: 12px;
    }

    .today {
        color: #5f95dc;
    }
</style>
