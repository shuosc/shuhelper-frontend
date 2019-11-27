import {Class} from '@/store/course';
import {DateTimeInSemester, DateTimeInSemesterService} from '@/model/semester/dateTimeInSemester';
import {findFirst} from 'fp-ts/lib/Array';
import {getOrElse, isSome} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

export namespace ClassService {
    /**
     * 判断在某一天是否要上某节课
     */
    export function isOnDate(classObject: Class, date: DateTimeInSemester): boolean {
        return DateTimeInSemesterService.isWorkingDay(date)
            && date.dateTime.getDay() === classObject.weekday
            && pipe(classObject.weeks, findFirst((week) => DateTimeInSemesterService.getWorkWeekIndex(date) === week), isSome);
    }

    /**
     * 能判断第几节课是否在上某节课
     */
    export function isOnSector(classObject: Class, sectorIndex: number): boolean {
        return classObject.begin_sector - 1 <= sectorIndex
            && sectorIndex <= classObject.end_sector - 1;
    }

    /**
     * 能判断某个时间是否在上某节课
     */
    export function isOnDateTime(classObject: Class, date: DateTimeInSemester): boolean {
        return isOnDate(classObject, date) && isOnSector(classObject, getOrElse(() => 0)(DateTimeInSemesterService.currentSectorIndex(date)));
    }
}
