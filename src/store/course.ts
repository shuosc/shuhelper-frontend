import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {DateTimeInSemester, DateTimeInSemesterService, HOLIDAY} from '@/model/semester/dateTimeInSemester';
import {fromNullable, Option} from 'fp-ts/lib/Option';
import Axios from '../tools/axios';
import {nextBeautifulLightColor} from '@/tools/color';
import {extractDate} from '@/tools/dateTime';

export interface Class {
    weeks: Array<number>,
    weekday: number,
    begin_sector: number,
    end_sector: number,
    course_by_teacher_id: string,
    campus_id: number,
    place: string
}

export interface Course {
    id: string,
    course_id: string,
    in_course_teacher_id: string,
    teacher_id: string,
    on_semester_id: string,
    name: string,
    credit: number,
    classes: Array<Class>,
    color: string
}

@Module({name: 'course', namespaced: true})
export default class CourseModule extends VuexModule {
    public courses: Array<Course> = [];
    private classesForDate = new Map<Date, Array<Class>>();

    get getById(): (id: string) => Option<Course> {
        return (id: string) => fromNullable(this.courses.find((it) => it.id === id));
    }

    get getClassesByDateTimeInSemester(): (dateTimeInSemester: DateTimeInSemester) => Array<Class> {
        return (dateTimeInSemester: DateTimeInSemester) => {
            if (this.classesForDate.has(extractDate(dateTimeInSemester.dateTime))) {
                return this.classesForDate.get(extractDate(dateTimeInSemester.dateTime)) as Array<Class>;
            }
            const schoolDay = DateTimeInSemesterService.schoolDay(dateTimeInSemester);
            const weekIndex = DateTimeInSemesterService.getWorkWeekIndex(dateTimeInSemester);
            if (schoolDay === HOLIDAY) {
                return [];
            }
            const result: Array<Class> = [];
            // can't use filter here due to performance problem
            for (const course of this.courses) {
                if (course.on_semester_id === dateTimeInSemester.semester.id) {
                    for (const classObject of course.classes) {
                        if (classObject.weekday === schoolDay && classObject.weeks.includes(weekIndex)) {
                            result.push(classObject);
                        }
                    }
                }
            }
            result.sort((a, b) => a.begin_sector - b.end_sector);
            if (result.length !== 0) {
                this.classesForDate.set(extractDate(dateTimeInSemester.dateTime), result);
            }
            return result;
        };
    }

    @Mutation
    public addCourse(course: Course) {
        if (this.courses.find((it) => it.id === course.id) === undefined) {
            this.courses.push({
                ...course,
                color: nextBeautifulLightColor()
            });
        }
    }

    @Action
    public async fetchBySemester(semesterId: string) {
        try {
            if (Array.from(this.courses.values())
                .find((it) => it.on_semester_id === semesterId) !== undefined) {
                return;
            }
            const ids = (await new Promise((resolve, reject) =>
                Axios.get(`api/student-courses?semester_id=${semesterId}`)
                    .then(resolve).catch(reject)) as { data: Array<string> }).data;
            if (Array.from(this.courses.values())
                .find((it) => it.on_semester_id === semesterId) !== undefined) {
                return;
            }
            ids.map((id) => {
                if (Array.from(this.courses.values()).find((it) => it.id === id) !== undefined) {
                    return;
                }
                Axios.get(`api/course?id=${id}`)
                    .then((response: { data: Course }) => this.context.commit('addCourse', response.data));
            });
        } catch (e) {
            /*pass*/
        }
    }
}
