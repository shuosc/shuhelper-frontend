<template>
    <v-list subheader two-line>
        <v-list-item
                :key="classObject.course_by_teacher_id+classObject.begin_sector"
                @click=""
                v-for="classObject in classes">
            <v-list-item-avatar>
                <v-icon :style="{background: toNullable(courseStore.getById(classObject.course_by_teacher_id)).color}">
                    mdi-book-multiple
                </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>{{toNullable(courseStore.getById(classObject.course_by_teacher_id)).name}}
                </v-list-item-title>
                <v-list-item-subtitle>
                    <v-container class="class-info">
                        <v-row>
                            <v-col class="pa-0" cols="3">{{classObject.begin_sector}}-{{classObject.end_sector}}</v-col>
                            <v-col class="pa-0" cols="6">
                                {{format(SectorRepository.sectors[classObject.begin_sector-1].start,'kk:mm')}}-{{format(SectorRepository.sectors[classObject.end_sector-1].end,'kk:mm')}}
                            </v-col>
                            <v-col class="pa-0" cols="3">{{classObject.place}}</v-col>
                        </v-row>
                    </v-container>
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {getModule} from "vuex-module-decorators";
    import {format, parse} from "date-fns";
    import CourseModule, {Class} from "@/store/course";
    import SemesterModule from "@/store/semester";
    import {pipe} from "fp-ts/lib/pipeable";
    import {Semester} from "@/model/semester/semester";
    import {getOrElse, map, toNullable} from "fp-ts/lib/Option";
    import {SectorRepository} from "@/model/sector";

    @Component({
        methods: {format, parse, toNullable}
    })
    export default class CourseTable extends Vue {
        @Prop() public value!: Date;
        private courseStore = getModule(CourseModule, this.$store);
        private semesterStore = getModule(SemesterModule, this.$store);
        private SectorRepository = SectorRepository;

        get classes(): Array<Class> {
            return pipe(
                this.semesterStore.getByDateTime(this.value),
                map((semester: Semester) => this.courseStore.getClassesByDateTimeInSemester({
                    semester,
                    dateTime: this.value
                })),
                getOrElse(() => [] as Array<Class>)
            ).sort((a, b) => a.begin_sector - b.begin_sector);
        }
    };
</script>

<style scoped>

</style>
