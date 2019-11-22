import {Semester} from '@/model/semester/semester';
import {addDays, eachWeekOfInterval, getDay, isAfter, isSameDay, isWithinInterval} from 'date-fns';
import {findFirst, findIndex} from 'fp-ts/lib/Array';
import {getOrElse, map, Option} from 'fp-ts/lib/Option';
import {Holiday} from '@/model/semester/holiday/holiday';
import {pipe} from 'fp-ts/lib/pipeable';
import {partial} from '@/tools/partial';

export const HOLIDAY = 7;

export interface DateTimeInSemester {
    dateTime: Date;
    semester: Semester;
}

export namespace DateTimeInSemesterService {
    function getWeeks(semester: Semester): Array<Interval> {
        return eachWeekOfInterval(semester).map((firstDayOfWeek) => {
            return {start: firstDayOfWeek, end: addDays(firstDayOfWeek, 7)};
        });
    }

    function getWorkingWeeks(semester: Semester): Array<Interval> {
        return getWeeks(semester).filter((week) => {
            const monday = {semester, dateTime: addDays(week.start, 1)};
            const friday = {semester, dateTime: addDays(week.start, 5)};
            const isMondayHoliday = isHoliday(monday);
            const isFridayHoliday = isHoliday(friday);
            return !isMondayHoliday && !isFridayHoliday;
        });
    }

    export function schoolDay(dateTime: DateTimeInSemester): number {
        for (const holiday of dateTime.semester.holidays) {
            if (holiday.shifts.length !== 0) {
                for (const shift of holiday.shifts) {
                    if (isSameDay(dateTime.dateTime, shift.from)) {
                        return HOLIDAY;
                    } else if (isSameDay(shift.to, dateTime.dateTime)) {
                        return getDay(shift.from);
                    }
                }
            }
            if (isWithinInterval(dateTime.dateTime, holiday)) {
                return HOLIDAY;
            }
        }
        return getDay(dateTime.dateTime);
    }

    export function getHoliday(dateTime: DateTimeInSemester): Option<Holiday> {
        return findFirst(partial(isWithinInterval, dateTime.dateTime))(dateTime.semester.holidays);
    }

    export function getNextHoliday(dateTime: DateTimeInSemester): Option<Holiday> {
        return findFirst((holiday: Holiday) => isAfter(holiday.start, dateTime.dateTime))(dateTime.semester.holidays);
    }

    export function isHoliday(dateTime: DateTimeInSemester): boolean {
        return schoolDay(dateTime) === HOLIDAY;
    }

    export function isWorkingDay(dateTime: DateTimeInSemester): boolean {
        return schoolDay(dateTime) !== 0 && schoolDay(dateTime) !== 6 && schoolDay(dateTime) !== HOLIDAY;
    }

    /**
     * 这是第几周
     * 如果这天放假，返回0
     */
    export function getWorkWeekIndex(dateTime: DateTimeInSemester): number {
        if (isHoliday(dateTime)) {
            return 0;
        }
        return pipe(
            findIndex((week: Interval) =>
                isWithinInterval(dateTime.dateTime, week))(getWorkingWeeks(dateTime.semester)),
            map((it: number) => it + 1),
            getOrElse(() => 0)
        );
    }
}
