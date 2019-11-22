import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {map, Option} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import {addHours} from 'date-fns';
import {DateTimeInSemester} from '@/model/semester/dateTimeInSemester';
import {Semester} from '@/model/semester/semester';

@Module({name: 'dateTime', namespaced: true})
export default class DateTimeModule extends VuexModule {
    private intervalId: number = 0;

    private nowBuffer: Date = new Date();

    get now() {
        return this.nowBuffer;
    }

    get currentDateTimeInSemester(): Option<DateTimeInSemester> {
        return pipe(
            this.context.rootGetters['semester/getByDateTime'](this.now),
            map((semester: Semester) => {
                return {
                    dateTime: this.now,
                    semester
                };
            })
        );
    }

    @Mutation
    public start() {
        if (this.intervalId === 0) {
            if (process.env.NODE_ENV === 'development') {
                this.intervalId = setInterval(() => {
                    this.nowBuffer = addHours(this.nowBuffer, 3);
                }, 125);
            } else {
                this.intervalId = setInterval(() => {
                    this.nowBuffer = new Date();
                }, 1000);
            }
        }
    }
}
