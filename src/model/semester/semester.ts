import {Holiday} from '@/model/semester/holiday/holiday';

export interface Semester {
    id: string,
    name: string,
    start: Date,
    end: Date,
    holidays: Array<Holiday>
}
