import {Semester} from '@/model/semester/semester';
import {addDays, eachWeekOfInterval, getDay, isAfter, isBefore, isSameDay, isWithinInterval} from 'date-fns';
import {findFirst, findIndex, lookup} from 'fp-ts/lib/Array';
import {chain, getOrElse, map, Option} from 'fp-ts/lib/Option';
import {Holiday} from '@/model/semester/holiday/holiday';
import {pipe} from 'fp-ts/lib/pipeable';
import {partial} from '@/tools/partial';
import {extractTime} from '@/tools/dateTime';
import {SectorRepository, SectorService} from '@/model/sector';
import {last} from 'fp-ts/lib/NonEmptyArray';

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
    return findFirst((holiday: Holiday) => isAfter(holiday.start, dateTime.dateTime))(dateTime.semester.holidays.sort((a, b) =>
      a.start.getTime() - b.start.getTime()));
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

  /**
   * 判断某个时间点是否在第一节课之前
   */
  export function isBeforeFirstSector(dateTime: DateTimeInSemester): boolean {
    return isBefore(extractTime(dateTime.dateTime), SectorRepository.sectors[0].start);
  }

  /**
   * 判断某个时间点是否在最后一节课之后
   */
  export function isAfterLastSector(dateTime: DateTimeInSemester): boolean {
    return isAfter(extractTime(dateTime.dateTime), last(SectorRepository.sectors).end);
  }

  /**
   * 找出某一时间点的这一节课
   */
  export function currentSectorIndex(dateTime: DateTimeInSemester): Option<number> {
    return SectorService.sectorIndexForTime(dateTime.dateTime);
  }

  export function currentSector(dateTime: DateTimeInSemester): Option<Interval> {
    return pipe(
      currentSectorIndex(dateTime),
      chain((index) => lookup(index, SectorRepository.sectors))
    );
  }

  /**
   * 找出现在正在进行的课间休息时间
   */
  export function currentRest(dateTime: DateTimeInSemester): Option<Interval> {
    return findFirst((it: Interval) => isWithinInterval(extractTime(dateTime.dateTime), it))(SectorRepository.rests);
  }
}
