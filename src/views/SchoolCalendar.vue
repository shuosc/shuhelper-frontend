<template>
    <v-card class="calendar-container">
        <Calendar :value="this.date" @update="update"></Calendar>
        <CourseTable :value="this.date"></CourseTable>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Calendar from '@/components/schoolCalendar/calendar.vue';
    import {getModule} from 'vuex-module-decorators';
    import SemesterModule from '@/store/semester';
    import CourseModule from '@/store/course';
    import {Semester} from '@/model/semester/semester';
    import {isSome, map, toNullable} from 'fp-ts/lib/Option';
    import {eachDayOfInterval, endOfMonth, startOfMonth} from 'date-fns';
    import CourseTable from '@/components/schoolCalendar/courseTable.vue';
    import DateTimeModule from '@/store/dateTime';

    @Component({
        components: {CourseTable, Calendar}
    })
    export default class SchoolCalendar extends Vue {
        private date = new Date();
        private dateTimeStore = getModule(DateTimeModule, this.$store);

        public async fetchCoursesForDate(date: Date) {
            const semesterModule = getModule(SemesterModule, this.$store);
            const semester = await semesterModule.fetchByDateTime(date);
            const courseModule = getModule(CourseModule, this.$store);
            const semesterId = map((semesterObject: Semester) => semesterObject.id)(semester);
            try {
                if (isSome(semesterId)) {
                    await courseModule.fetchBySemester(toNullable(semesterId) as string);
                }
            } catch (e) {
                await this.$router.push("login");
            }
        }

        public async update(newDate: Date) {
            const month = {
                start: startOfMonth(newDate),
                end: endOfMonth(newDate)
            };
            // do not use Promise.all here
            // or it'll request already existed semester's courses
            for (const date of eachDayOfInterval(month)) {
                await this.fetchCoursesForDate(date);
            }
            this.date = newDate;
        }

        private mounted() {
            this.update(this.dateTimeStore.now);
        }
    };
</script>

<style lang="stylus" scoped>
    .calendar-container {
        max-width: 400px;
        margin: 0 auto;
    }
</style>

