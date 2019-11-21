import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Axios from '@/tools/axios';
import {fromNullable, Option} from 'fp-ts/lib/Option';
import {format, isWithinInterval} from 'date-fns';
import {Semester} from '@/model/semester/semester';

@Module({name: 'semester'})
export default class SemesterModule extends VuexModule {
    private semesters: Map<string, Semester> = new Map<string, Semester>();

    get getById(): (id: string) => Option<Semester> {
        return (id: string) => fromNullable(this.semesters.get(id));
    }

    get getByDateTime(): (dateTime: Date) => Option<Semester> {
        return (dateTime: Date) =>
            fromNullable(Array.from(this.semesters.values()).find((semester: Semester) => {
                return isWithinInterval(dateTime, semester);
            }));
    }

    @Mutation
    public addSemester(semester: Semester) {
        this.semesters.set(semester.id, semester);
    }

    @Action({commit: 'addSemester'})
    public async fetch(date: Date | 'now' = 'now') {
        const result: { data: Semester } = await new Promise((resolve) =>
            Axios.get(`api/semester?date=${date === 'now' ? 'now' : format(date, 'yyyy-MM-dd')}`)
                .then(resolve));
        return result.data;
    }
}
