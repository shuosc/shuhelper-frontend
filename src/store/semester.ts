import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Axios from '@/tools/axios';
import {fromNullable, isSome, map, none, Option, some} from 'fp-ts/lib/Option';
import {format, isWithinInterval} from 'date-fns';
import {Semester} from '@/model/semester/semester';

@Module({name: 'semester', namespaced: true})
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
    public addSemester(semester: Option<Semester>) {
        map((it: Semester) => this.semesters.set(it.id, it))(semester);
    }

    @Action({commit: 'addSemester'})
    public async fetchByDateTime(date: Date | 'now' = 'now') {
        if (date !== 'now' && isSome(this.getByDateTime(date))) {
            return this.getByDateTime(date);
        }
        if (date === 'now' && isSome(this.getByDateTime(new Date()))) {
            return this.getByDateTime(new Date());
        }
        try {
            const result: { data: Semester } = await new Promise((resolve, reject) =>
                Axios.get(`api/semester?date=${date === 'now' ? 'now' : format(date, 'yyyy-MM-dd')}`)
                    .then((data) => resolve(data))
                    .catch(() => reject('sth error with network')));
            return some(result.data);
        } catch (e) {
            return none;
        }
    }
}
