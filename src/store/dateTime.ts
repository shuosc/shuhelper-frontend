import {Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {addMinutes} from 'date-fns';

@Module({name: 'dateTime'})
export default class DateTimeModule extends VuexModule {
    private intervalId: number = 0;

    private nowBuffer: Date = new Date();

    get now() {
        return this.nowBuffer;
    }

    @Mutation
    public start() {
        if (this.intervalId === 0) {
            this.intervalId = setInterval(() => {
                if (process.env.NODE_ENV === 'development') {
                    this.nowBuffer = addMinutes(this.nowBuffer, 5);
                } else {
                    this.nowBuffer = new Date();
                }
            }, 1000);
        }
    }
}
