import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Axios from '@/tools/axios';
import {fromNullable, isSome, map, none, Option, some} from 'fp-ts/lib/Option';
import {format, isWithinInterval} from 'date-fns';
import {Semester} from '@/model/semester/semester';
import {findFirst} from 'fp-ts/lib/Array';

@Module({name: 'semester', namespaced: true})
export default class SemesterModule extends VuexModule {
    private semesters: Array<Semester> = [];
    // for performance
    private dateTimeToSemesterIndex = new Map<Date, Semester>();

    get getById(): (id: string) => Option<Semester> {
        return (id: string) => findFirst((it: Semester) => it.id === id)(this.semesters);
    }

    get getByDateTime(): (dateTime: Date) => Option<Semester> {
        return (dateTime: Date) => {
            if (this.dateTimeToSemesterIndex.has(dateTime)) {
                return some(this.dateTimeToSemesterIndex.get(dateTime) as Semester);
            }
            const result = fromNullable(this.semesters.find((semester: Semester) => {
                return isWithinInterval(dateTime, semester);
            }));
            map((semester: Semester) => this.dateTimeToSemesterIndex.set(dateTime, semester))(result);
            return result;
        };
    }

    @Mutation
    public addSemester(semester: Option<Semester>) {
        map((it: Semester) => this.semesters.push(it))(semester);
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
