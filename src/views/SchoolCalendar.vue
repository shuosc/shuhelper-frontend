<template>
    <v-card class="calendar-container">
        <Calendar :value="this.date"
                  @update:value="update"
        ></Calendar>
        <CourseTable :value="this.date"></CourseTable>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import Calendar from "@/components/schoolCalendar/calendar.vue";
    import {getModule} from "vuex-module-decorators";
    import SemesterModule from "@/store/semester";
    import CourseModule from "@/store/course";
    import {Semester} from "@/model/semester/semester";
    import {map} from "fp-ts/lib/Option";
    import {eachDayOfInterval, endOfMonth, startOfMonth} from "date-fns";
    import CourseTable from "@/components/schoolCalendar/courseTable.vue";
    import LoginRequired from "@/mixins/loginRequired";

    @Component({
        components: {CourseTable, Calendar},
        mixins: [LoginRequired]
    })
    export default class SchoolCalendar extends Vue {
        private date = new Date();

        public async fetchCoursesForDate(date: Date) {
            const semesterModule = getModule(SemesterModule, this.$store);
            const semester = await semesterModule.fetchByDateTime(date);
            const courseModule = getModule(CourseModule, this.$store);
            const semesterId = map((semesterObject: Semester) => semesterObject.id)(semester);
            try {
                await map(async (id: string) => await courseModule.fetchBySemester(id))(semesterId);
            } catch (e) {
                await this.$router.push("login");
            }
        }

        public async update(newDate: Date) {
            const month = {
                start: startOfMonth(newDate),
                end: endOfMonth(newDate)
            };
            await Promise.all(eachDayOfInterval(month).map(this.fetchCoursesForDate));
            this.date = newDate;
        }

        private mounted() {
            this.update(this.date);
        }
    };
</script>

<style lang="stylus" scoped>
    .calendar-container {
        max-width: 400px;
        margin: 0 auto;
    }
</style>

